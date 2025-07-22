import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../components/UploadModal';

interface PDF {
  id: string;
  title: string;
  filename: string;
  uploaded: string;
}

// Extracted styles for better maintainability
const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, overflowX: 'hidden' as const },
  navbar: {
    width: '100%', position: 'sticky' as const, top: 0, zIndex: 20,
    background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    minHeight: '4.5rem', display: 'flex', alignItems: 'center', padding: '0 2rem',
    fontFamily: 'Playfair Display, serif'
  },
  navContent: {
    width: '100%', maxWidth: '1280px', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logoIcon: {
    width: '40px', height: '40px', background: 'linear-gradient(135deg, #232b4a 0%, #1a2040 100%)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)'
  },
  logoText: { fontWeight: 700, fontSize: '1.25rem', color: '#e5e7eb', letterSpacing: '0.5px', lineHeight: 1.2 },
  logoSubtext: { fontSize: '0.75rem', color: '#b0b8d1', fontWeight: 500, letterSpacing: '0.5px' },
  navActions: { display: 'flex', alignItems: 'center', gap: '1rem' },
  btnSecondary: {
    background: 'rgba(31, 41, 55, 0.8)', color: '#d1d5db', border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)',
    minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
  },
  btnPrimary: {
    background: 'rgba(17, 24, 39, 0.9)', color: '#e5e7eb', border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.2s ease', minWidth: '80px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
  },
  main: {
    width: '100%', maxWidth: 1280, margin: '0 auto', padding: '2.5rem 2vw 2rem 2vw',
    display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '2.5rem',
    alignItems: 'flex-start', fontFamily: 'Playfair Display, serif'
  },
  card: {
    background: 'rgba(255,255,255,0.10)', borderRadius: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(18px)', color: '#e0eaff',
    padding: '2.5rem 2.5rem', margin: 0, display: 'flex', flexDirection: 'column' as const,
    justifyContent: 'center', alignItems: 'flex-start', animation: 'fadeIn 0.8s'
  },
  title: { color: '#b4c9ff', fontWeight: 700, fontSize: '2rem', marginBottom: '1.2rem', letterSpacing: '1px' },
  description: { color: '#e0eaff', fontSize: '1.08rem', marginBottom: '2.2rem', lineHeight: 1.6 },
  highlight: { color: '#6eb6ff' },
  uploadBtn: {
    background: 'rgba(17, 24, 39, 0.9)', color: '#e5e7eb', border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '12px', fontFamily: 'Playfair Display, serif', fontWeight: 500, letterSpacing: '0.02em',
    fontSize: '1rem', padding: '0.75rem 1.5rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', cursor: 'pointer',
    transition: 'all 0.2s ease', outline: 'none'
  },
  sectionTitle: {
    background: 'rgba(255,255,255,0.10)', borderRadius: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(18px)', marginBottom: '2rem',
    padding: '1.1rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 'unset', height: 'auto', animation: 'fadeIn 0.8s'
  },
  sectionTitleText: {
    fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '2.2rem',
    color: '#b4c9ff', letterSpacing: '0.01em', textAlign: 'center' as const, width: '100%'
  },
  error: { color: '#f87171', textAlign: 'center' as const },
  loading: { textAlign: 'center' as const, padding: '2rem', color: '#e0eaff' },
  empty: {
    textAlign: 'center' as const, padding: '2rem', background: 'rgba(255,255,255,0.10)',
    borderRadius: '1.2rem', color: '#e0eaff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(18px)'
  },
  cardsGrid: { gap: '24px 18px', maxWidth: 800 },
  cardContent: { marginBottom: 12, maxWidth: '100%', overflow: 'hidden' },
  cardTitle: { fontSize: '1rem', marginBottom: 4, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' },
  cardMeta: { fontSize: '0.85rem', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  cardActions: { gap: 8 },
  startChatBtn: { 
    fontSize: '0.9rem', 
    padding: '0.6rem 1rem',
    background: 'rgba(17, 24, 39, 0.9)',
    color: '#e5e7eb',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  deleteBtn: { 
    fontSize: '0.9rem', 
    padding: '0.6rem 1rem',
    background: 'rgba(31, 41, 55, 0.8)',
    color: '#d1d5db',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modalOverlay: {
    position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(36,40,80,0.7)', zIndex: 100, display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  },
  modalContent: {
    background: 'rgba(36,40,80,0.98)', borderRadius: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    border: '1.5px solid rgba(255,255,255,0.18)', padding: '2.5rem 2.5rem',
    minWidth: 340, maxWidth: 420, width: '100%', margin: 0, textAlign: 'center' as const, zIndex: 101
  },
  modalTitle: { color: '#e0eaff', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.2rem', textAlign: 'center' as const },
  modalText: { color: '#b4c9ff', marginBottom: '2rem', textAlign: 'center' as const, fontSize: '1.1rem', lineHeight: 1.5 },
  modalActions: { display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 24 },
  btnCancel: {
    background: 'rgba(31, 41, 55, 0.8)', color: '#d1d5db', border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px', fontWeight: 500, padding: '0.7rem 1.5rem', outline: 'none',
    cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s ease'
  },
  btnDelete: {
    background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '12px', fontWeight: 500,
    padding: '0.7rem 1.5rem', border: '1px solid rgba(255, 255, 255, 0.15)', outline: 'none', cursor: 'pointer',
    fontSize: '1rem', transition: 'all 0.2s ease'
  },
  footer: {
    width: '100%', textAlign: 'center' as const, color: '#b4c9ff', fontSize: '1rem',
    padding: '2rem 0 1rem 0', marginTop: 'auto', opacity: 0.7, letterSpacing: '0.04em'
  }
};

const Dashboard: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/list/');
      const data = await res.json();
      setPdfs(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch PDFs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await fetch(`http://localhost:8000/api/delete/${id}/`, { method: 'DELETE' });
      setPdfs(pdfs.filter(pdf => pdf.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      setError('Failed to delete PDF. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handlePrimaryBtnHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.background = 'rgba(31, 41, 55, 0.95)';
      e.currentTarget.style.color = '#f9fafb';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.35)';
    } else {
      e.currentTarget.style.background = 'rgba(17, 24, 39, 0.9)';
      e.currentTarget.style.color = '#e5e7eb';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
    }
  };

  const handleUploadBtnHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.background = 'rgba(31, 41, 55, 0.95)';
      e.currentTarget.style.color = '#f9fafb';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.35)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
      e.currentTarget.style.background = 'rgba(17, 24, 39, 0.9)';
      e.currentTarget.style.color = '#e5e7eb';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleUploadBtnFocus = (e: React.FocusEvent<HTMLButtonElement>, isFocus: boolean) => {
    e.currentTarget.style.boxShadow = isFocus 
      ? '0 0 0 2px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)';
  };

  const handleCancelHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.background = 'rgba(55, 65, 81, 0.9)';
      e.currentTarget.style.color = '#f3f4f6';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    } else {
      e.currentTarget.style.background = 'rgba(31, 41, 55, 0.8)';
      e.currentTarget.style.color = '#d1d5db';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    }
  };

  const handleDeleteHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
      e.currentTarget.style.color = '#fecaca';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
    } else {
      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
      e.currentTarget.style.color = '#fca5a5';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  return (
    <div className="dashboardBg" style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <span style={{ fontSize: '20px', color: '#f3f6fa' }}>📄</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={styles.logoText}>PDF Chatbot</span>
              <span style={styles.logoSubtext}>AI-Powered Document Chat</span>
            </div>
          </div>
          <div style={styles.navActions}>
            <button 
              style={styles.btnPrimary}
              onMouseOver={(e) => handlePrimaryBtnHover(e, true)}
              onMouseOut={(e) => handlePrimaryBtnHover(e, false)}
            >
              <span style={{ fontSize: '14px' }}>📊</span>Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.title}>PDF Chatbot<br/>Dashboard</h2>
          <p style={styles.description}>
            Welcome to your PDF Chatbot dashboard. Upload your PDF documents, chat with them to extract information, and manage your files—all in one place.<br/>
            <span style={styles.highlight}>Interact with your PDFs using RAG based AI chat with seamless document management.</span>
          </p>
          <button 
            style={styles.uploadBtn}
            onClick={() => setShowModal(true)}
            onMouseOver={(e) => handleUploadBtnHover(e, true)}
            onMouseOut={(e) => handleUploadBtnHover(e, false)}
            onFocus={(e) => handleUploadBtnFocus(e, true)}
            onBlur={(e) => handleUploadBtnFocus(e, false)}
          >
            Upload PDF
          </button>
        </section>

        <section style={{ width: '100%' }}>
          <div style={styles.sectionTitle}>
            <span style={styles.sectionTitleText}>My Stored Docs and PDF'S</span>
          </div>
          
          {error && <p style={styles.error}>{error}</p>}
          
          {loading ? (
            <div style={styles.loading}>
              <p>Loading documents...</p>
            </div>
          ) : pdfs.length === 0 ? (
            <div style={styles.empty}>
              <h2>No documents yet</h2>
              <p>Click "Upload PDF" to get started.</p>
            </div>
          ) : (
            <ul className="cardsGrid" style={styles.cardsGrid}>
              {pdfs.map(pdf => (
                <li className="cardBox" key={pdf.id}>
                  <div className="cardContent" style={styles.cardContent}>
                    <h3 className="cardTitle" style={styles.cardTitle} title={pdf.title}>{pdf.title}</h3>
                    <p className="cardMeta" style={styles.cardMeta} title={pdf.filename}>Filename: {pdf.filename}</p>
                    <p className="cardMeta" style={styles.cardMeta}>Uploaded: {pdf.uploaded}</p>
                  </div>
                  <div className="cardActions" style={styles.cardActions}>
                    <button 
                      className="startChatBtn" 
                      style={styles.startChatBtn} 
                      onClick={() => navigate(`/chat/${pdf.id}`)}
                    >
                      START CHAT
                    </button>
                    <button 
                      className="deleteBtn" 
                      style={styles.deleteBtn} 
                      onClick={() => setDeleteConfirmId(pdf.id)}
                    >
                      DELETE
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Modals */}
      {showModal && <UploadModal onClose={() => { setShowModal(false); fetchPDFs(); }} />}

      {deleteConfirmId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Confirm Deletion</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete this PDF? This action<br />cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                style={styles.btnCancel}
                onMouseOver={(e) => handleCancelHover(e, true)}
                onMouseOut={(e) => handleCancelHover(e, false)}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                style={styles.btnDelete}
                onMouseOver={(e) => handleDeleteHover(e, true)}
                onMouseOut={(e) => handleDeleteHover(e, false)}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} PDF Chatbot. All rights reserved.
      </footer>

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 0 1rem !important; }
          nav > div { gap: 1rem !important; }
          nav button { padding: 0.4rem 0.8rem !important; font-size: 0.8rem !important; min-width: 70px !important; }
          nav button span { display: none !important; }
        }
        @media (max-width: 480px) {
          nav { padding: 0 0.75rem !important; }
          nav > div { flex-direction: column !important; gap: 0.75rem !important; align-items: center !important; }
          nav > div > div:first-child { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          nav > div > div:first-child > div:last-child { align-items: center !important; }
          nav > div > div:last-child { gap: 0.5rem !important; }
          nav button { padding: 0.35rem 0.6rem !important; font-size: 0.75rem !important; min-width: 60px !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
