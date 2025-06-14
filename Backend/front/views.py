from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView, ListAPIView, RetrieveDestroyAPIView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .models import Person, Complainee, FoundPerson, ClaimRequest
from .serializers import PersonSerializer, ComplaineeWriteSerializer, ComplaineeReadSerializer, FoundPersonSerializer, ClaimRequestSerializer
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser


# Create or List all persons
@csrf_exempt
@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser])
def create_person(request):
    if request.method == 'GET':
        people = Person.objects.all()
        serializer = PersonSerializer(people, many=True)
        return Response(serializer.data)

    serializer = PersonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    
    return Response(serializer.errors, status=400)


# User registration
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

# Class-based: List or Create a person
class PersonListCreateAPIView(ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]
# Class-based: Retrieve a single person by ID
class PersonDetailAPIView(RetrieveAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class ComplaineeListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        reported_id = self.request.GET.get("reported_person")
        if reported_id:
            return Complainee.objects.filter(reported_person__id=reported_id)
        return Complainee.objects.filter(rep_by=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ComplaineeReadSerializer
        return ComplaineeWriteSerializer

    def perform_create(self, serializer):
        serializer.save(rep_by=self.request.user)



class FoundPersonListCreateView(generics.ListCreateAPIView):
    queryset = FoundPerson.objects.all()
    serializer_class = FoundPersonSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

class ClaimRequestCreateView(generics.CreateAPIView):
    queryset = ClaimRequest.objects.all()
    serializer_class = ClaimRequestSerializer

class FoundPersonListAPIView(generics.ListAPIView):
    queryset = FoundPerson.objects.all()
    serializer_class = FoundPersonSerializer
    permission_classes = [IsAuthenticated] 


def get_stats(request):
    missing_count = Person.objects.count()
    reunited_count = ClaimRequest.objects.count()

    age_groups = {
        "0-10": 0, "11-20": 0, "21-30": 0, "31-40": 0,
        "41-50": 0, "51-60": 0, "61+": 0
    }

    for person in Person.objects.all():
        age = person.age
        if age <= 10:
            age_groups["0-10"] += 1
        elif age <= 20:
            age_groups["11-20"] += 1
        elif age <= 30:
            age_groups["21-30"] += 1
        elif age <= 40:
            age_groups["31-40"] += 1
        elif age <= 50:
            age_groups["41-50"] += 1
        elif age <= 60:
            age_groups["51-60"] += 1
        else:
            age_groups["61+"] += 1

    return JsonResponse({
        "missing": missing_count,
        "reunited": reunited_count,
        "age_groups": age_groups
    })

class ClaimRequestListAPIView(generics.ListAPIView):
    queryset = ClaimRequest.objects.all().order_by('-date_submitted')  # latest first
    serializer_class = ClaimRequestSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "name": user.get_full_name() or user.username,
        "email": user.email
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notified(request, complainee_id):
    try:
        complainee = Complainee.objects.get(id=complainee_id, rep_by=request.user)
        complainee.notified_about_match = True
        complainee.save()
        return Response({'message': 'Marked as notified'})
    except Complainee.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

class ComplaineeDetailAPIView(RetrieveDestroyAPIView):
   
    queryset = Complainee.objects.all()
    serializer_class = ComplaineeReadSerializer  # or ComplaineeSerializer if you prefer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        # get the Complainee instance
        instance = self.get_object()
        # grab the linked Person
        person = instance.reported_person
        # first delete the complainee
        self.perform_destroy(instance)
        # then delete the person record
        person.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)