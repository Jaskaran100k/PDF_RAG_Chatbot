from django.urls import path
from .views import PDFUploadView, ListPDFView, DeletePDFView, AskQuestionView

urlpatterns = [
    path("upload/", PDFUploadView.as_view()),
    path("list/", ListPDFView.as_view()),
    path("delete/<int:pk>/", DeletePDFView.as_view()),
    path("chat/", AskQuestionView.as_view()), 
]
