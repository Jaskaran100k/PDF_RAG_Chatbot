import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import api from '../api';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess?: () => void;
}

// Extracted styles
const styles = {
  overlay: {
    position: 'fixed' as const, inset: 0, zIndex: 100,
    background: 'rgba(36,40,80,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
  },
  modal: {
    position: 'relative' as const, background: 'rgba(255,255,255,0.10)', color: '#e0eaff',
    borderRadius: '2rem', boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
    border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(24px)',
    padding: '2.5rem 2.5rem', maxWidth: 420, minWidth: 320, minHeight: 260,
    width: '100%', boxSizing: 'border-box' as const, zIndex: 101, animation: 'fadeIn 0.5s',
    overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', fontFamily: 'Playfair Display, serif'
  },
  closeBtn: {
    position: 'absolute' as const, top: 18, right: 22, background: 'none', border: 'none',
    color: '#b4c9ff', fontSize: 28, cursor: 'pointer', fontWeight: 700, zIndex: 2,
    transition: 'color 0.18s'
  },
  title: {
    color: '#b4c9ff', fontWeight: 700, fontSize: '1.35rem', marginBottom: '1.2rem',
    textAlign: 'center' as const, letterSpacing: '0.01em', fontFamily: 'Playfair Display, serif'
  },
  error: { color: '#f87171', marginBottom: '1rem', textAlign: 'center' as const, fontWeight: 500 },
  form: {
    width: '100%', display: 'flex', flexDirection: 'column' as const,
    gap: '1.1rem', alignItems: 'center'
  },
  field: { width: '100%' },
  label: {
    color: '#e0eaff', fontWeight: 600, marginBottom: 8, display: 'block',
    fontSize: '1.05rem', letterSpacing: '0.01em', fontFamily: 'Playfair Display, serif'
  },
  input: {
    borderRadius: '999px', background: 'rgba(80,80,90,0.22)', border: '1.5px solid #333',
    padding: '1rem 1.3rem', fontSize: '1.08rem', width: '100%', color: '#e0eaff',
    fontWeight: 500, letterSpacing: '0.04em', outline: 'none', boxShadow: 'none',
    backdropFilter: 'blur(2px)', marginBottom: 0, transition: 'border 0.18s, box-shadow 0.18s',
    fontFamily: 'Playfair Display, serif'
  },
  fileInput: {
    borderRadius: '999px', background: 'rgba(80,80,90,0.22)', border: '1.5px solid #333',
    padding: '0.7rem 1.1rem', fontSize: '1.05rem', width: '100%', color: '#e0eaff',
    fontWeight: 500, outline: 'none', boxShadow: 'none', backdropFilter: 'blur(2px)',
    marginBottom: 0, transition: 'border 0.18s, box-shadow 0.18s', WebkitAppearance: 'none' as const,
    fontFamily: 'Playfair Display, serif'
  },
  buttonContainer: {
    display: 'flex', justifyContent: 'space-between', gap: '4%',
    marginTop: '1.5rem', width: '100%'
  },
  cancelBtn: {
    background: 'rgba(31, 41, 55, 0.8)', color: '#d1d5db', borderRadius: 12, fontWeight: 500,
    padding: '0.7rem 0', border: '1px solid rgba(255, 255, 255, 0.2)', outline: 'none', cursor: 'pointer',
    transition: 'all 0.2s ease', width: '48%', minWidth: 148, fontSize: '1rem', 
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', letterSpacing: '0.02em', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center' as const, whiteSpace: 'nowrap' as const, fontFamily: 'Playfair Display, serif'
  },
  uploadBtn: {
    borderRadius: 12, fontWeight: 500, padding: '0.7rem 0', border: '1px solid rgba(255, 255, 255, 0.25)',
    outline: 'none', transition: 'all 0.2s ease', width: '48%', minWidth: 148, fontSize: '1rem', 
    letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center' as const, whiteSpace: 'nowrap' as const, fontFamily: 'Playfair Display, serif'
  }
};

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        setFile(null);
        return;
      }
      if (!title) {
        const fileName = selectedFile.name;
        const titleWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setTitle(titleWithoutExt);
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for the PDF');
      return;
    }
    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      await api.post('/upload/', formData);
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (err) {
      setError('Failed to upload the PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    e.currentTarget.style.color = isHover ? '#ef4444' : '#b4c9ff';
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>, isFocus: boolean) => {
    if (isFocus) {
      e.currentTarget.style.border = '1.5px solid #6366f1';
      e.currentTarget.style.boxShadow = '0 0 0 2px #6366f155';
    } else {
      e.currentTarget.style.border = '1.5px solid #333';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  const handleCancelHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.background = 'rgba(55, 65, 81, 0.9)';
      e.currentTarget.style.color = '#f3f4f6';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
      e.currentTarget.style.background = 'rgba(31, 41, 55, 0.8)';
      e.currentTarget.style.color = '#d1d5db';
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleCancelFocus = (e: React.FocusEvent<HTMLButtonElement>, isFocus: boolean) => {
    e.currentTarget.style.boxShadow = isFocus 
      ? '0 0 0 2px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)';
  };

  const handleUploadHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (!(uploading || !file)) {
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
    }
  };

  const handleUploadFocus = (e: React.FocusEvent<HTMLButtonElement>, isFocus: boolean) => {
    if (!(uploading || !file)) {
      e.currentTarget.style.boxShadow = isFocus 
        ? '0 0 0 2px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  };

  const isDisabled = uploading || !file;

  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button
          aria-label="Close upload modal"
          onClick={onClose}
          style={styles.closeBtn}
          onMouseOver={(e) => handleCloseHover(e, true)}
          onMouseOut={(e) => handleCloseHover(e, false)}
        >
          ×
        </button>
        
        <h3 style={styles.title}>Upload a New PDF</h3>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="title" style={styles.label}>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your PDF"
              required
              style={styles.input}
              onFocus={(e) => handleInputFocus(e, true)}
              onBlur={(e) => handleInputFocus(e, false)}
            />
          </div>
          
          <div style={styles.field}>
            <label htmlFor="file" style={styles.label}>PDF File</label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              required
              style={styles.fileInput}
              onFocus={(e) => handleInputFocus(e, true)}
              onBlur={(e) => handleInputFocus(e, false)}
            />
            <style>{`
              input[type='file']::file-selector-button {
                background: rgba(255,255,255,0.22);
                color: #fff;
                border: none;
                border-radius: 999px;
                padding: 0.5rem 1.3rem;
                font-size: 1.05rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.18s, color 0.18s, box-shadow 0.18s;
                margin-right: 1rem;
                box-shadow: 0 2px 8px rgba(99,102,241,0.10);
                fontFamily: 'Playfair Display, serif';
              }
              input[type='file']::file-selector-button:hover {
                background: rgba(255,255,255,0.32);
                color: #fff;
                box-shadow: 0 4px 12px rgba(99,102,241,0.13);
              }
              input[type='file']:focus::file-selector-button {
                outline: 2px solid #fff;
                outline-offset: 2px;
                background: rgba(255,255,255,0.28);
                color: #fff;
              }
            `}</style>
          </div>
          
          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              onMouseOver={(e) => handleCancelHover(e, true)}
              onMouseOut={(e) => handleCancelHover(e, false)}
              onFocus={(e) => handleCancelFocus(e, true)}
              onBlur={(e) => handleCancelFocus(e, false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              style={{
                ...styles.uploadBtn,
                background: isDisabled ? '#232b4d' : '#22d3ee',
                color: '#fff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.7 : 1,
                boxShadow: isDisabled ? 'none' : '0 1px 4px rgba(34,211,238,0.04)'
              }}
              onMouseOver={(e) => handleUploadHover(e, true)}
              onMouseOut={(e) => handleUploadHover(e, false)}
              onFocus={(e) => handleUploadFocus(e, true)}
              onBlur={(e) => handleUploadFocus(e, false)}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UploadModal;
