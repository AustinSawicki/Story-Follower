# Generated by Django 4.2.13 on 2024-07-09 21:33

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_story_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='charactercard',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.character_image_upload_path),
        ),
    ]
