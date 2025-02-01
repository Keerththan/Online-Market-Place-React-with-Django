from django.db import models
from django.contrib.auth.models import AbstractUser

USER_TYPE_CHOICES = (
    ('seller', 'Seller'),
    ('buyer', 'Buyer'),
)

class User(AbstractUser):
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    username = models.CharField(max_length=150, unique=True)  # Explicit username field
    address = models.TextField()
    contact_number = models.CharField(max_length=15)
    district = models.CharField(max_length=50)

    # Add related_name to resolve clashes
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='inventory_user_set', 
        blank=True, 
        help_text='The groups this user belongs to.' 
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='inventory_user_permissions', 
        blank=True, 
        help_text='Specific permissions for this user.'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Products(models.Model):
    seller_id = models.IntegerField(null=True, blank=True)
    product_image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    product_name = models.CharField(max_length=200, null=True)
    product_net_weight = models.FloatField(default=0, help_text="Net weight of the product in grams or kg")
    product_category = models.CharField(max_length=200, null=True, help_text="Category of the product")
    product_price = models.FloatField(default=0, help_text="Price of the product")

    def __str__(self):
        return self.product_name


class Order(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('cash_on_delivery', 'Cash on Delivery'),
    )

    buyer_id = models.IntegerField(help_text="ID of the buyer")
    seller_id = models.IntegerField(help_text="ID of the seller")  # New field added
    product_id = models.IntegerField(help_text="ID of the product being ordered")
    product_name = models.CharField(max_length=200, help_text="Name of the product being ordered")  # New field added
    quantity = models.IntegerField(default=1, help_text="Quantity of the product being ordered")
    price = models.FloatField(default=0, help_text="Price of the product at the time of purchase")
    address = models.TextField(help_text="Delivery address for the order")
    mobile_number = models.CharField(max_length=15, help_text="Mobile number of the buyer")
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, default='credit_card', help_text="Method of payment"
    )
    order_date = models.DateTimeField(auto_now_add=True, help_text="Date and time when the order was placed")
    status = models.CharField(
        max_length=20, choices=[('pending', 'Pending'), ('shipped', 'Shipped'), ('delivered', 'Delivered')], 
        default='pending', help_text="Order status"
    )

    def __str__(self):
        return f"Order #{self.id} by Buyer {self.buyer_id} for Product {self.product_name} (Seller ID: {self.seller_id})"

    def get_total_price(self):
        """Calculate the total price for the order (quantity * price)."""
        return self.quantity * self.price


