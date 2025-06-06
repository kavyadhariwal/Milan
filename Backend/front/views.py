from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView, ListAPIView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from .models import Person, Complainee, FoundPerson, ClaimRequest
from .serializers import PersonSerializer, ComplaineeSerializer, FoundPersonSerializer, ClaimRequestSerializer
from rest_framework import generics


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

# Create a new complainee entry
@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser])
def create_complainee(request):
    serializer = ComplaineeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    
    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)

# User registration
@api_view(['POST'])
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

# Class-based: Retrieve a single person by ID
class PersonDetailAPIView(RetrieveAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

# Class-based: List complainees, optionally filtered by reported_person
class ComplaineeListAPIView(ListAPIView):
    serializer_class = ComplaineeSerializer

    def get_queryset(self):
        qs = Complainee.objects.all()
        person_id = self.request.query_params.get('reported_person')
        if person_id:
            qs = qs.filter(reported_person_id=person_id)
        return qs


class FoundPersonListCreateView(generics.ListCreateAPIView):
    queryset = FoundPerson.objects.all()
    serializer_class = FoundPersonSerializer

class ClaimRequestCreateView(generics.CreateAPIView):
    queryset = ClaimRequest.objects.all()
    serializer_class = ClaimRequestSerializer

class FoundPersonListAPIView(generics.ListAPIView):
    queryset = FoundPerson.objects.all()
    serializer_class = FoundPersonSerializer


def get_stats(request):
    missing_count = Person.objects.count()
    found_count = ClaimRequest.objects.count()

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
        "found": found_count,
        "age_groups": age_groups
    })

class ClaimRequestListAPIView(generics.ListAPIView):
    queryset = ClaimRequest.objects.all().order_by('-date_submitted')  # latest first
    serializer_class = ClaimRequestSerializer