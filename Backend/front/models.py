from django.db import models
from django.contrib.auth.models import User

class FoundPerson(models.Model):
    STATE_CHOICES = [
        ('RJ', 'Rajasthan'),
        ('GJ', 'Gujarat'),
        ('PB', 'Punjab'),
    ]

    name = models.CharField(max_length=100, blank=True, null=True)
    photo = models.ImageField(upload_to='found_photos/')  
    description = models.TextField(blank=True)
    date_found = models.DateField()
    address = models.TextField(blank=True)
    contact = models.CharField(max_length=10)
    state = models.CharField(max_length=10, choices=STATE_CHOICES, blank=True)
    city = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name or "Unnamed Found Person"


class Person(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    STATE_CHOICES = [
        ('RJ', 'Rajasthan'),
        ('GJ', 'Gujarat'),
        ('PB', 'Punjab'),
    ]

    fname = models.CharField(max_length=50)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    photo = models.ImageField()
    desc = models.TextField()
    date = models.DateField()
    address = models.TextField()
    address1 = models.TextField()
    state = models.CharField(max_length=10, choices=STATE_CHOICES)
    city = models.CharField(max_length=50)
    is_matched = models.BooleanField(default=False)
    matched_found_person = models.ForeignKey('FoundPerson', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.fname

class Complainee(models.Model):
    reported_person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='complainees')
    rep_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    STATE_CHOICES = [
        ('RJ', 'Rajasthan'),
        ('GJ', 'Gujarat'),
        ('PB', 'Punjab'),
    ]
    fullname = models.CharField(max_length=50)
    email = models.EmailField()
    contact = models.CharField(max_length=10)
    relation = models.TextField()
    address = models.TextField()
    address1 = models.TextField(blank=True)
    state = models.CharField(max_length=10, choices=STATE_CHOICES)
    city = models.CharField(max_length=50)
    notified_about_match = models.BooleanField(default=False)

    

    def __str__(self):
        return f"{self.fullname} reporting {self.reported_person.fname}"


    
class ClaimRequest(models.Model):
    found_person = models.ForeignKey(FoundPerson, on_delete=models.CASCADE)
    cname = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    relation = models.CharField(max_length=100)
    message = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim by {self.cname} for {self.found_person}"


