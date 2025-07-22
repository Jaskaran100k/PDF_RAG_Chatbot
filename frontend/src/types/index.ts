export interface PDFInfo {
  id: number;
  title: string;
  pdf: string;
  uploaded_at: string;
}

export interface Message {
  text: string;
  from: "user" | "bot";
}
