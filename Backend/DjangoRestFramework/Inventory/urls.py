from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('products/', ProductsView.as_view()),
    path('products/<int:id>/', ProductsViewById.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/seller/<int:seller_id>/', GetProductsBySellerId.as_view(), name='get-products-by-seller'),
    path('user/details/', views.UserDetailsByEmailView.as_view(), name='user-details-by-email')
    
    # other URLs...
] 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
