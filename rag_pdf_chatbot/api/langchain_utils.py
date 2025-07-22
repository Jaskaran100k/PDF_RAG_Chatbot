
import os
from langchain_chroma import Chroma

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

CHROMA_DIR = "./chroma_db"
llm = ChatGroq(model="llama3-8b-8192")
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def store_pdfs(file_paths):
    documents = []
    for path in file_paths:
        loader = PyPDFLoader(path)
        docs = loader.load()
        documents.extend(docs)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)

    vectordb = Chroma.from_documents(
        chunks,
        embedding=embedding,
        persist_directory=CHROMA_DIR,
    )


def ask_question(query):
    vectordb = Chroma(persist_directory=CHROMA_DIR, embedding_function=embedding)
    retriever = vectordb.as_retriever()
    docs = retriever.invoke(query)

    # Create formatted context
    context = ""
    for i, doc in enumerate(docs[:3], 1):  # limit to top 3
        context += f"[{i}] {doc.page_content.strip()[:300]}...\n"

    # Build structured prompt
    prompt = f"""
You are a helpful AI assistant. Use ONLY the context below to answer the question.
If the answer is not in the context, respond with "I could not find the answer in the provided documents."

Format your response clearly in Markdown. Add bullet points if applicable.

Context:
{context}

Question: {query}

Answer:
"""
    answer = llm.invoke(prompt).content.strip()
    return answer

