# Generated by Django 5.1.4 on 2025-01-31 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Inventory', '0003_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='seller_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
