import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from .models import PDF
from .serializers import PDFSerializer
from .langchain_utils import store_pdfs, ask_question

class PDFUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        title = request.data.get("title")
        pdf_file = request.data.get("file")

        if not title or not pdf_file:
            return Response({"error": "Title and file required"}, status=400)

        pdf = PDF.objects.create(title=title, file=pdf_file)
        file_path = os.path.join(settings.MEDIA_ROOT, pdf.file.name)
        store_pdfs([file_path])
        return Response(PDFSerializer(pdf).data, status=201)

class ListPDFView(APIView):
    def get(self, request):
        pdfs = PDF.objects.all().order_by("-uploaded_at")
        return Response(PDFSerializer(pdfs, many=True).data)

class DeletePDFView(APIView):
    def delete(self, request, pk):
        try:
            pdf = PDF.objects.get(pk=pk)
            pdf.file.delete(save=False)
            pdf.delete()
            return Response(status=204)
        except PDF.DoesNotExist:
            return Response({"error": "PDF not found"}, status=404)

class AskQuestionView(APIView):
    def post(self, request):
        question = request.data.get("question")
        if not question:
            return Response({"error": "Question required"}, status=400)
        answer = ask_question(question)
        return Response({"answer": answer})
