from django.contrib import admin
from .models import Person,Complainee,ClaimRequest,FoundPerson
admin.site.register(Person)
admin.site.register(Complainee)
admin.site.register(ClaimRequest)
admin.site.register(FoundPerson)

