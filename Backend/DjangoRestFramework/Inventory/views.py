from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Products, Order
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist


class ProductsView(APIView):

    def get(self, request):
        all_products = Products.objects.all()
        products_data = []

        for product in all_products:
            single_product = {
                "id": product.id,
                "product_image": product.product_image.url if product.product_image else None,
                "product_name": product.product_name,
                "product_net_weight": product.product_net_weight,
                "product_category": product.product_category,
                "product_price": product.product_price,
                "seller_id": product.seller_id,  # Added seller_id here
            }
            products_data.append(single_product)

        return Response(products_data)

    def post(self, request):
        new_product = Products(
            product_image=request.FILES.get("product_image"),
            product_name=request.data["product_name"],
            product_net_weight=request.data["product_net_weight"],
            product_category=request.data["product_category"],
            product_price=request.data["product_price"],
            seller_id=request.data["seller_id"],
        )

        new_product.save()
        return Response("Data Saved")


class ProductsViewById(APIView):

    def get(self, request, id):
        try:
            product = Products.objects.get(id=id)
            single_product = {
                "id": product.id,
                "product_image": product.product_image.url if product.product_image else None,
                "product_name": product.product_name,
                "product_net_weight": product.product_net_weight,
                "product_category": product.product_category,
                "product_price": product.product_price,
                "seller_id": product.seller_id,  # Added seller_id here
            }
            return Response(single_product)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

    def patch(self, request, id):
        try:
            product = Products.objects.get(id=id)

            # Updating the fields, including seller_id if provided
            product.product_image = request.FILES.get("product_image", product.product_image)
            product.product_name = request.data.get("product_name", product.product_name)
            product.product_net_weight = request.data.get("product_net_weight", product.product_net_weight)
            product.product_category = request.data.get("product_category", product.product_category)
            product.product_price = request.data.get("product_price", product.product_price)
            product.seller_id = request.data.get("seller_id", product.seller_id)  # Updating seller_id

            product.save()
            return Response("Updated")
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

    def delete(self, request, id):
        try:
            product = Products.objects.get(id=id)
            product.delete()
            return Response("Deleted")
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)

            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "user_type": user.user_type,
                        "username": user.username,
                        "address": user.address,
                        "contact_number": user.contact_number,
                        "district": user.district,
                    }
                }, status=status.HTTP_200_OK)

            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsByEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            user_data = {
                "id": user.id,
                "email": user.email,
                "user_type": user.user_type,
                "username": user.username,
                "address": user.address,
                "contact_number": user.contact_number,
                "district": user.district,
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# New class to get products by seller_id
class GetProductsBySellerId(APIView):
    def get(self, request, seller_id):
        try:
            products = Products.objects.filter(seller_id=seller_id)
            products_data = []

            for product in products:
                single_product = {
                    "id": product.id,
                    "product_image": product.product_image.url if product.product_image else None,
                    "product_name": product.product_name,
                    "product_net_weight": product.product_net_weight,
                    "product_category": product.product_category,
                    "product_price": product.product_price,
                    "seller_id": product.seller_id,  # Added seller_id here
                }
                products_data.append(single_product)

            return Response(products_data, status=status.HTTP_200_OK)

        except Products.DoesNotExist:
            return Response({"error": "No products found for this seller"}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
def create_order(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        buyer_id = data.get('buyer_id')
        product_id = data.get('product_id')
        product_name = data.get('product_name')
        seller_id = data.get('seller_id')
        quantity = data.get('quantity', 1)
        price = data.get('price')
        address = data.get('address')
        mobile_number = data.get('mobile_number')
        payment_method = data.get('payment_method')

        try:
            buyer = User.objects.get(id=buyer_id)
            product = Products.objects.get(id=product_id)
        except (User.DoesNotExist, Products.DoesNotExist):
            return JsonResponse({'error': 'Buyer or Product not found'}, status=400)

        order = Order.objects.create(
            buyer_id=buyer_id,
            product_id=product_id,
            product_name=product_name,
            quantity=quantity,
            price=price,
            address=address,
            mobile_number=mobile_number,
            payment_method=payment_method,
            seller_id=seller_id,
        )

        return JsonResponse({'message': 'Order placed successfully', 'order_id': order.id}, status=201)

    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_orders_by_seller(request, seller_id):
    if request.method == 'GET':
        try:
            products = Products.objects.filter(seller_id=seller_id)
            product_ids = products.values_list('id', flat=True)

            orders = Order.objects.filter(product_id__in=product_ids)

            order_list = []
            for order in orders:
                order_list.append({
                    'order_id': order.id,
                    'buyer_id': order.buyer_id,
                    'product_id': order.product_id,
                    'product_name': order.product_name,
                    'quantity': order.quantity,
                    'price': order.price,
                    'address': order.address,
                    'mobile_number': order.mobile_number,
                    'payment_method': order.payment_method,
                    'order_date': order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
                })

            return JsonResponse({'orders': order_list}, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({'error': 'No orders found for this seller'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
