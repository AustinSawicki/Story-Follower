# Generated by Django 4.2.13 on 2024-07-16 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='description',
            field=models.TextField(default='About story...', max_length=5000),
        ),
    ]
