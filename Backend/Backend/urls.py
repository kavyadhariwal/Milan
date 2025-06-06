from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from front.views import (
    create_person,
    create_complainee,
    register,
    PersonListCreateAPIView,
    PersonDetailAPIView,
    ComplaineeListAPIView,
    FoundPersonListCreateView, ClaimRequestCreateView,FoundPersonListAPIView,ClaimRequestListAPIView, 
    get_stats
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication
    path('api/register/', register, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Person APIs
    path('api/person/', PersonListCreateAPIView.as_view(), name='person-list-create'),  # GET & POST
    path('api/person/<int:pk>/', PersonDetailAPIView.as_view(), name='person-detail'),  # GET single

    # Complainee APIs
    path('api/complainee/', create_complainee, name='complainee-create'),              # POST only
    path('api/complainee/list/', ComplaineeListAPIView.as_view(), name='complainee-list'),  # GET with ?reported_person=id
    path('api/found/', FoundPersonListCreateView.as_view(), name='found-create'),
    path('api/found/list/', FoundPersonListAPIView.as_view(), name='found-list'),
    path('api/claim/', ClaimRequestCreateView.as_view(), name='claim-create'),
    path('api/stats/', get_stats, name='get_stats'),
    path('api/claim-requests/', ClaimRequestListAPIView.as_view(), name='claim-requests-list'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
