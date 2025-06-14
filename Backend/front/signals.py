import face_recognition
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Person, FoundPerson, Complainee

MATCH_THRESHOLD = 0.5

def try_match(missing_instance, found_instance):
    # load & encode missing face
    missing_img = face_recognition.load_image_file(missing_instance.photo.path)
    missing_encs = face_recognition.face_encodings(missing_img)
    if not missing_encs:
        return False
    missing_enc = missing_encs[0]

    # load & encode found face
    found_img = face_recognition.load_image_file(found_instance.photo.path)
    found_encs = face_recognition.face_encodings(found_img)
    if not found_encs:
        return False
    found_enc = found_encs[0]

    # if distance below threshold, it's a match
    dist = face_recognition.face_distance([found_enc], missing_enc)[0]
    return dist < MATCH_THRESHOLD

def perform_matching(missing_instance, found_instance):
    if try_match(missing_instance, found_instance):
        missing_instance.is_matched = True
        missing_instance.matched_found_person = found_instance
        missing_instance.save(update_fields=['is_matched', 'matched_found_person'])
        # reset notifications
        Complainee.objects.filter(reported_person=missing_instance) \
                          .update(notified_about_match=False)

@receiver(post_save, sender=Person)
def on_person_saved(sender, instance, created, **kwargs):
    # only run on create
    if created:
        for f in FoundPerson.objects.exclude(photo=''):
            perform_matching(instance, f)

@receiver(post_save, sender=FoundPerson)
def on_foundperson_saved(sender, instance, created, **kwargs):
    # whenever a new FoundPerson arrives, re‑scan all missing Persons
    for p in Person.objects.exclude(photo=''):
        perform_matching(p, instance)
