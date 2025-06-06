from django.db import models

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

    def __str__(self):
        return self.fname

class Complainee(models.Model):
    reported_person = models.ForeignKey(
        Person,
        on_delete=models.CASCADE,
        related_name='complainees'
    )
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

    def __str__(self):
        return f"{self.fullname} reporting {self.reported_person.fname}"


# models.py

from django.db import models

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

    
class ClaimRequest(models.Model):
    found_person = models.ForeignKey(FoundPerson, on_delete=models.CASCADE)
    cname = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    relation = models.CharField(max_length=100)
    message = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim by {self.cname} for {self.found_person}"


