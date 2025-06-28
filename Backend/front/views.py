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
from .models import Person, Complainee, FoundPerson, ClaimRequest, VerifiedUser
from .serializers import PersonSerializer, ComplaineeWriteSerializer, ComplaineeReadSerializer, FoundPersonSerializer, ClaimRequestSerializer
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings
import os
import easyocr
import face_recognition
from rest_framework.views import APIView
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
#in above func if request is get than all objectes are serialised and fetched if post then new person is created

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
    queryset = Person.objects.all()   #fetches all Person model instances from the database.
    serializer_class = PersonSerializer
    parser_classes = [MultiPartParser]   # allows the API to handle file uploads
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
#to show a list of all claims 
class ClaimRequestListAPIView(generics.ListAPIView):
    queryset = ClaimRequest.objects.all().order_by('-date_submitted')  
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
    



class AadhaarVerificationView(APIView):
    @permission_classes([IsAuthenticated])
    def post(self, request):
        print("\u2705 AadhaarVerificationView hit")
        aadhaar_photo = request.FILES.get('aadhaar_photo')
        selfie_photo = request.FILES.get('selfie_photo')

        if not aadhaar_photo or not selfie_photo:
            return Response({'error': 'Both Aadhaar and selfie photos are required.'}, status=400)

        aadhaar_path = default_storage.save(f'temp/{aadhaar_photo.name}', aadhaar_photo)
        selfie_path = default_storage.save(f'temp/{selfie_photo.name}', selfie_photo)
        aadhaar_full_path = os.path.join(settings.MEDIA_ROOT, aadhaar_path)
        selfie_full_path = os.path.join(settings.MEDIA_ROOT, selfie_path)

        try:
            # OCR
            reader = easyocr.Reader(['en', 'hi'], gpu=False)
            result = reader.readtext(aadhaar_full_path, detail=0)
            safe_result = [line.encode('utf-8', 'ignore').decode('utf-8') for line in result]

            # Name extraction logic
            blacklist = ['GOVERNMENT OF INDIA', 'GOVT. OF INDIA', 'MALE', 'FEMALE', 'DOB', 'YEAR OF BIRTH']
            name = ""
            aadhaar_number = ""

            for line in safe_result:
                cleaned = line.strip().upper()
                if cleaned.replace(" ", "").isdigit() and len(cleaned.replace(" ", "")) == 12:
                    aadhaar_number = cleaned.replace(" ", "")
                elif not name and cleaned not in blacklist and cleaned.isalpha() and len(cleaned) > 3:
                    name = line.strip()  # preserve original casing

            if not name or not aadhaar_number:
                return Response({'error': 'Failed to extract name or Aadhaar number.'}, status=400)

            # Face Match
            aadhaar_img = face_recognition.load_image_file(aadhaar_full_path)
            selfie_img = face_recognition.load_image_file(selfie_full_path)
            aadhaar_encs = face_recognition.face_encodings(aadhaar_img)
            selfie_encs = face_recognition.face_encodings(selfie_img)

            if not aadhaar_encs or not selfie_encs:
                return Response({'error': 'Face not detected in one or both images.'}, status=400)

            match = face_recognition.compare_faces([aadhaar_encs[0]], selfie_encs[0])[0]

            if not match:
                return Response({'error': 'Face does not match Aadhaar photo.'}, status=403)

            print("\u2705 Match found:", name, aadhaar_number)

            # Save verified user
            verified = VerifiedUser.objects.create(
                user=request.user,
                name=name,
                aadhaar_number=aadhaar_number,
                aadhaar_photo=aadhaar_photo,
                selfie_photo=selfie_photo
            )

            return Response({'message': 'Verified successfully', 'user_id': verified.id}, status=201)

        except Exception as e:
            print("\u274c Exception occurred:", str(e))
            return Response({'error': str(e)}, status=500)

        finally:
            if os.path.exists(aadhaar_full_path): os.remove(aadhaar_full_path)
            if os.path.exists(selfie_full_path): os.remove(selfie_full_path)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_verification(request):
    verified = hasattr(request.user, 'verification')
    return Response({'is_verified': verified})



    