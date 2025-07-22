from rest_framework import serializers
from .models import PDF

class PDFSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    uploaded = serializers.SerializerMethodField()

    class Meta:
        model = PDF
        fields = ["id", "title", "file", "uploaded_at", "filename", "uploaded"]

    def get_filename(self, obj):
        return obj.filename()

    def get_uploaded(self, obj):
        # Format as 'YYYY-MM-DD HH:MM' or similar
        return obj.uploaded_at.strftime('%Y-%m-%d %H:%M') if obj.uploaded_at else ""
