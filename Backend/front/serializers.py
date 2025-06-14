from rest_framework import serializers
from .models import *



class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'fname', 'age', 'gender', 'photo', 'desc', 'address', 'address1', 'date', 'city', 'state', 'is_matched', 'matched_found_person']

class ComplaineeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complainee
        fields = '__all__'

class ComplaineeReadSerializer(serializers.ModelSerializer):
    reported_person = PersonSerializer(read_only=True)

    class Meta:
        model = Complainee
        fields = '__all__'


class FoundPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundPerson
        fields = '__all__'

class ClaimRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimRequest
        fields = '__all__'