from django.db import models

class PDF(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="pdfs/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def filename(self):
        return self.file.name.split("/")[-1]
