# 🤖 PDF RAG Chatbot
<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/5efe3109-9298-4f47-8ece-4ffea5bb810f" />

A Retrieval-Augmented Generation (RAG) chatbot that lets users upload PDFs and chat with an AI assistant powered by the documents’ content. Built with Django, LangChain, Chroma, and React.

---

## 📚 Overview

This project demonstrates a full-stack implementation of a **PDF-based RAG system**, with:

- 📄 **PDF Upload & Processing**
- 🔍 **Semantic Search with Embeddings**
- 🤖 **AI Chat with Groq LLM**
- 🧠 **LangChain for orchestration**
- 💬 **Modern React UI for interaction**

---

## 🛠️ Features

- Upload one or more PDF files
- Embed documents into a vector database (Chroma)
- Ask questions using an intuitive chat interface
- Receive intelligent responses based on document content
- Clean, glassmorphic UI with responsive design

---

## 📦 Project Structure

```
pdf-rag-chatbot/
├── rag_pdf_chatbot/        # Django backend (API, embedding, chat)
├── frontend/               # React frontend (dashboard, chat UI)
├── media/pdfs/            # Uploaded PDFs stored here
└── README.md               # Project documentation
```

---

## 🧠 Backend Overview

### Core Technologies

- **Django + DRF** – REST API for PDF handling and chat
- **LangChain** – For text splitting and LLM prompt construction
- **Chroma** – Vector store for semantic search
- **HuggingFace Embeddings** – For dense vector generation
- **Groq LLM** – For generating context-aware responses

### API Endpoints

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| POST   | `/api/upload/`       | Upload a PDF                    |
| GET    | `/api/list/`         | List all uploaded PDFs          |
| DELETE | `/api/delete/<id>/`  | Delete a PDF                    |
| POST   | `/api/chat/`         | Ask a question about a PDF      |

### Core Workflow

- **PDF Upload**: Uses PyPDFLoader to extract and chunk text
- **Storage**: Chunks are embedded and stored in Chroma
- **Question Handling**: Queries retrieve top-k chunks → Groq LLM generates answer

## 💻 Frontend Overview

### Key Components

- **Dashboard Page**: View, upload, and delete PDFs
- **Chat Page**: Chat interface for selected PDF
- **Upload Modal**: Handles PDF selection and upload
- **React Router**: Navigation between dashboard and chat views

### UI Features

- 📂 File list with delete and chat options
- 💬 Chat bubbles for user and bot messages
- ⌛ Typing animation for smoother UX
- 🎨 Playfair Display font with glassmorphic design

---

## 🔁 Frontend–Backend Flow

1. 📤 Upload: React uploads PDF to Django via `/api/upload/`
2. 🧠 Embedding: Backend extracts, chunks, and embeds PDF into Chroma
3. 💬 Chat: User sends questions to `/api/chat/`
4. 🤖 Response: Backend retrieves relevant chunks and queries Groq LLM
5. 📥 Display: React shows the answer in the chat interface
