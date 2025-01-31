from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('products/', ProductsView.as_view()),
    path('products/<int:id>/', ProductsViewById.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('products/seller/<int:seller_id>/', GetProductsBySellerId.as_view(), name='get-products-by-seller'),
    path('user/details/', UserDetailsByEmailView.as_view(), name='user-details-by-email'),
    path('orders/seller/<int:seller_id>/', get_orders_by_seller, name='get_orders_by_seller'),
    path('orders/create/', create_order, name='create_order'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
