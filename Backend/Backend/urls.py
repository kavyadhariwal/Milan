from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from front.views import (
    create_person,
    register,
    PersonListCreateAPIView,
    PersonDetailAPIView,
    ComplaineeListCreateView,
    FoundPersonListCreateView, ClaimRequestCreateView,FoundPersonListAPIView,ClaimRequestListAPIView, 
    get_stats,
    get_profile,
    mark_notified,
    ComplaineeDetailAPIView,
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
    path('api/profile/', get_profile, name='get_profile'),


    # Complainee APIs
              
    path('api/complainee/list/', ComplaineeListCreateView.as_view(), name='complainee-list'),  # GET with ?reported_person=id
    path('api/found/', FoundPersonListCreateView.as_view(), name='found-create'),
    path('api/found/list/', FoundPersonListAPIView.as_view(), name='found-list'),
    path('api/claim/', ClaimRequestCreateView.as_view(), name='claim-create'),
    path('api/stats/', get_stats, name='get_stats'),
    path('api/claim-requests/', ClaimRequestListAPIView.as_view(), name='claim-requests-list'),
    path('api/complainee/mark_notified/<int:complainee_id>/', mark_notified),
    path('api/complainee/', ComplaineeListCreateView.as_view(), name='complainee-list-create'),
    path('api/complainee/<int:pk>/', ComplaineeDetailAPIView.as_view(), name='complainee-detail'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
