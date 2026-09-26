import React, { useRef, useState, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ChevronDown,
  FileCheck,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Settings,
  Layers,
  Scissors,
  RotateCw,
  Trash2,
  Lock,
  Unlock,
  PenTool,
  Search,
  Edit3,
  Camera,
  FileText,
  FileImage,
  Sparkles,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";

import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://comprimirpdf.onrender.com";

/* =========================================================
   SIMPLE DOCUMENT ICON
   ========================================================= */

const DocIcon = ({ text = "PDF", color = "red" }) => (
  <div className={`doc-icon doc-icon-${color}`}>{text}</div>
);

/* =========================================================
   MEGA MENU
   ========================================================= */

const MegaMenu = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="cp-mega-menu" onMouseLeave={onClose}>
      <div className="cp-mega-container">

        {/* COLUMN 1 */}
        <div className="cp-mega-column">
          <div className="cp-mega-group">
            <h4>Comprimir</h4>
            <Link to="/compress-pdf" className="cp-mega-item" onClick={onClose}>
              <span className="cp-mega-icon pdf">PDF</span>
              <span><strong>Comprimir PDF</strong><small>Reduza o tamanho do seu PDF</small></span>
            </Link>
            <Link to="/compress-image" className="cp-mega-item" onClick={onClose}>
              <span className="cp-mega-icon image">IMG</span>
              <span><strong>Comprimir imagem</strong><small>JPG, PNG e WebP</small></span>
            </Link>
          </div>
          <div className="cp-mega-group">
            <h4>Converter</h4>
            <span className="cp-mega-item cp-soon" onClick={onClose}>
              <span className="cp-mega-icon jpg">JPG</span>
              <span><strong>PDF para JPG</strong><small>Converta páginas em imagens</small></span>
            </span>
            <span className="cp-mega-item cp-soon" onClick={onClose}>
              <span className="cp-mega-icon png">PNG</span>
              <span><strong>PDF para PNG</strong><small>Exporte como PNG</small></span>
            </span>
            <span className="cp-mega-item cp-soon" onClick={onClose}>
              <span className="cp-mega-icon word">W</span>
              <span><strong>PDF para Word</strong><small>Converta para DOCX</small></span>
            </span>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="cp-mega-column">
          <div className="cp-mega-group">
            <h4>Organizar PDF</h4>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Layers size={20} /><span><strong>Juntar PDF</strong><small>Combine vários PDFs</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Scissors size={20} /><span><strong>Dividir PDF</strong><small>Separe páginas do PDF</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><RotateCw size={20} /><span><strong>Girar PDF</strong><small>Gire páginas facilmente</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Trash2 size={20} /><span><strong>Excluir páginas</strong><small>Remova páginas do documento</small></span></span>
          </div>
          <div className="cp-mega-group">
            <h4>PDF para Office</h4>
            <span className="cp-mega-item cp-soon" onClick={onClose}><span className="cp-mega-icon word">W</span><span><strong>PDF para Word</strong><small>Documento editável</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><span className="cp-mega-icon excel">X</span><span><strong>PDF para Excel</strong><small>Converta tabelas</small></span></span>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="cp-mega-column">
          <div className="cp-mega-group">
            <h4>Editar PDF</h4>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Edit3 size={20} /><span><strong>Editar PDF</strong><small>Edite seu documento</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><PenTool size={20} /><span><strong>Anotar PDF</strong><small>Adicione comentários</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Search size={20} /><span><strong>Leitor de PDF</strong><small>Leia seus documentos</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><FileText size={20} /><span><strong>Numerar páginas</strong><small>Adicione números</small></span></span>
          </div>
          <div className="cp-mega-group">
            <h4>Segurança</h4>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Lock size={20} /><span><strong>Proteger PDF</strong><small>Adicione uma senha</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Unlock size={20} /><span><strong>Desbloquear PDF</strong><small>Remova restrições</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><PenTool size={20} /><span><strong>Assinar PDF</strong><small>Assine documentos</small></span></span>
          </div>
        </div>

        {/* COLUMN 4 */}
        <div className="cp-mega-column">
          <div className="cp-mega-feature">
            <div className="cp-mega-feature-icon"><Sparkles size={23} /></div>
            <div>
              <span className="cp-mega-feature-label">NOVO</span>
              <h3>PDF com IA</h3>
              <p>Trabalhe com seus documentos usando ferramentas inteligentes.</p>
            </div>
          </div>
          <div className="cp-mega-group">
            <span className="cp-mega-item cp-soon" onClick={onClose}><Sparkles size={20} /><span><strong>Conversar com PDF</strong><small>Faça perguntas ao documento</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Sparkles size={20} /><span><strong>Resumo de PDF</strong><small>Resuma documentos longos</small></span></span>
            <span className="cp-mega-item cp-soon" onClick={onClose}><Sparkles size={20} /><span><strong>Traduzir PDF</strong><small>Traduza seu documento</small></span></span>
          </div>
          <div className="cp-mega-bottom-card">
            <Camera size={20} />
            <div><strong>Scanner de PDF</strong><small>Digitalize documentos</small></div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================================================
   HEADER
   ========================================================= */

const Header = () => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="cp-header">
      <div className="cp-header-inner">
        <Link to="/" className="cp-logo">
          <div className="cp-logo-mark"><span /><span /><span /><span /></div>
          <span className="cp-logo-text">ComprimirPDF</span>
        </Link>

        <nav className="cp-nav">
          <button
            type="button"
            className={toolsOpen ? "active" : ""}
            onMouseEnter={() => setToolsOpen(true)}
            onClick={() => setToolsOpen((v) => !v)}
          >
            Ferramentas
            <ChevronDown size={15} style={{ marginLeft: "4px", transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s ease" }} />
          </button>
          <Link to="/compress-pdf">Comprimir</Link>
          <span className="cp-nav-soon">Converter</span>
          <span className="cp-nav-soon">Juntar</span>
          <span className="cp-nav-soon">Editar</span>
          <span className="cp-nav-soon">Assinar</span>
        </nav>

        <div className="cp-actions">
          <span className="cp-price cp-soon-text">Preços</span>
          <span className="cp-login cp-soon-text">Entrar</span>
          <button type="button" className="cp-pro" onClick={() => navigate("/compress-pdf")}>Começar grátis</button>
        </div>
      </div>
      <MegaMenu open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </header>
  );
};

/* =========================================================
   COMPRESS TOOL — reusable for PDF and Image pages
   ========================================================= */

const CompressTool = ({ accept, fileTypeLabel, acceptedFormats }) => {
  const inputRef = useRef(null);
  const [file, setFile]           = useState(null);
  const [status, setStatus]       = useState("idle"); // idle | loading | done | error
  const [result, setResult]       = useState(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const [dragOver, setDragOver]   = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/files/compress`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Compression failed");
      }

      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}${result.download_url}`, "_blank");
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
  };

  return (
    <div className="cp-tool-page">
      <div className="cp-tool-page-card" style={{ maxWidth: 600, textAlign: "left" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="cp-tool-page-icon" style={{ margin: "0 auto 16px" }}>
            <FileText size={30} />
          </div>
          <h2 style={{ margin: 0 }}>Comprimir {fileTypeLabel}</h2>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            {acceptedFormats} · Máximo 50 MB · Gratuito
          </p>
        </div>

        {/* UPLOAD AREA */}
        {!file && (
          <div
            className="cp-upload"
            style={{ cursor: "pointer", border: dragOver ? "2px dashed #4f46e5" : undefined }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="cp-upload-icon"><FileCheck size={32} /></div>
            <p className="cp-upload-title">Arraste seu arquivo aqui</p>
            <p className="cp-upload-text">ou clique para selecionar</p>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button type="button" className="cp-upload-button">Escolher arquivo</button>
          </div>
        )}

        {/* FILE SELECTED */}
        {file && status === "idle" && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 18, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="cp-pdf-icon"><DocIcon text={fileTypeLabel === "PDF" ? "PDF" : "IMG"} color={fileTypeLabel === "PDF" ? "red" : "blue"} /></div>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{file.name}</div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="cp-pro" style={{ flex: 1, border: 0, borderRadius: 10, padding: "11px 0", cursor: "pointer" }} onClick={handleCompress}>
                Comprimir agora
              </button>
              <button type="button" className="cp-login" style={{ borderRadius: 10, padding: "11px 16px", cursor: "pointer", fontSize: 13 }} onClick={handleReset}>
                Trocar arquivo
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Loader2 size={40} style={{ color: "#4f46e5", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", fontWeight: 600 }}>Comprimindo seu arquivo...</p>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dc2626", fontWeight: 700, marginBottom: 6 }}>
              <AlertCircle size={18} /> Erro
            </div>
            <p style={{ color: "#dc2626", margin: 0, fontSize: 13 }}>{errorMsg}</p>
            <button type="button" className="cp-upload-button" style={{ marginTop: 12 }} onClick={handleReset}>Tentar novamente</button>
          </div>
        )}

        {/* SUCCESS */}
        {status === "done" && result && (
          <div>
            {/* Stats */}
            <div className="cp-result" style={{ marginTop: 0, marginBottom: 16 }}>
              <div className="cp-result-row">
                <div>
                  <div className="cp-result-label">TAMANHO ORIGINAL</div>
                  <div className="cp-result-value">{result.original_size}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="cp-result-label">APÓS COMPRESSÃO</div>
                  <div className="cp-result-value">{result.compressed_size}</div>
                </div>
              </div>
              <div className="cp-progress">
                <div className="cp-progress-bar" style={{ width: `${result.saving_percent}%`, animation: "none" }} />
              </div>
              <div className="cp-result-row">
                <span className="cp-result-label">ECONOMIA</span>
                <strong style={{ color: "#16a34a", fontSize: 14 }}>{result.saving_percent}% menor</strong>
              </div>
            </div>

            {/* Download button */}
            <button
              type="button"
              className="cp-pro"
              style={{ width: "100%", border: 0, borderRadius: 12, padding: "13px 0", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onClick={handleDownload}
            >
              <Download size={18} /> Baixar arquivo comprimido
            </button>

            <button
              type="button"
              className="cp-login"
              style={{ width: "100%", marginTop: 10, borderRadius: 12, padding: "11px 0", cursor: "pointer", fontSize: 14, textAlign: "center" }}
              onClick={handleReset}
            >
              Comprimir outro arquivo
            </button>
          </div>
        )}

        <Link to="/" className="cp-back-btn" style={{ display: "inline-flex", marginTop: 20 }}>
          ← Voltar para o início
        </Link>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* =========================================================
   COMPRESSOR PREVIEW (homepage widget — demo only)
   ========================================================= */

const CompressorPreview = () => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("documento.pdf");

  return (
    <div className="cp-visual">
      <div className="cp-glow" />
      <div className="cp-dashboard">
        <div className="cp-dashboard-top">
          <div className="cp-dots"><span className="cp-dot" /><span className="cp-dot" /><span className="cp-dot" /></div>
          <span className="cp-dashboard-title">ComprimirPDF</span>
        </div>
        <div className="cp-dashboard-body">
          <div className="cp-file-heading">
            <div>
              <p className="cp-file-label">SEU ARQUIVO</p>
              <p className="cp-file-name">{fileName}</p>
            </div>
            <div className="cp-pdf-icon"><DocIcon text="PDF" color="red" /></div>
          </div>
          <div className="cp-upload">
            <div className="cp-upload-icon"><FileCheck size={32} /></div>
            <p className="cp-upload-title">Arraste seu arquivo aqui</p>
            <p className="cp-upload-text">ou selecione um arquivo do computador</p>
            <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }} />
            <button type="button" className="cp-upload-button" onClick={() => inputRef.current?.click()}>Escolher arquivo</button>
          </div>
          <div className="cp-result">
            <div className="cp-result-row">
              <div><div className="cp-result-label">TAMANHO ORIGINAL</div><div className="cp-result-value">8,4 MB</div></div>
              <div style={{ textAlign: "right" }}><div className="cp-result-label">APÓS COMPRESSÃO</div><div className="cp-result-value">1,9 MB</div></div>
            </div>
            <div className="cp-progress"><div className="cp-progress-bar" /></div>
            <div className="cp-result-row"><span className="cp-result-label">ECONOMIA</span><strong style={{ color: "#16a34a", fontSize: "14px" }}>76% menor</strong></div>
          </div>
        </div>
      </div>
      <div className="cp-floating cp-floating-1">
        <div className="cp-floating-inner">
          <div className="cp-floating-icon indigo"><CheckCircle2 size={19} /></div>
          <div><p className="cp-floating-small">Compressão</p><p className="cp-floating-big">76% menor</p></div>
        </div>
      </div>
      <div className="cp-floating cp-floating-2">
        <div className="cp-floating-inner">
          <div className="cp-floating-icon green"><ShieldCheck size={19} /></div>
          <div><p className="cp-floating-small">Processo</p><p className="cp-floating-big">Simples e rápido</p></div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   HERO
   ========================================================= */

const Hero = () => (
  <section className="cp-hero">
    <div className="cp-hero-grid">
      <div className="cp-hero-content">
        <div className="cp-badge"><span className="cp-badge-dot" />Ferramentas simples para seus arquivos</div>
        <h1 className="cp-title">Seus arquivos.<span className="cp-title-gradient">Menores. Mais rápidos.</span></h1>
        <p className="cp-description">Comprima PDFs e imagens rapidamente sem complicação. Reduza o tamanho dos seus arquivos e facilite o envio, compartilhamento e armazenamento.</p>
        <div className="cp-buttons">
          <Link to="/compress-pdf" className="cp-primary-btn">Comprimir PDF</Link>
          <Link to="/compress-image" className="cp-secondary-btn">Comprimir imagem</Link>
        </div>
        <div className="cp-benefits">
          <span className="cp-benefit">✓ Fácil de usar</span>
          <span className="cp-benefit">✓ PDF + JPG + PNG + WebP</span>
          <span className="cp-benefit">✓ Interface rápida</span>
        </div>
      </div>
      <CompressorPreview />
    </div>
    <div className="cp-tools">
      <div className="cp-tools-grid">
        <div className="cp-tool-card"><div className="cp-tool-icon"><FileText size={21} /></div><h3 className="cp-tool-title">Compressor de PDF</h3><p className="cp-tool-text">Reduza documentos PDF rapidamente e prepare seus arquivos para envio.</p></div>
        <div className="cp-tool-card"><div className="cp-tool-icon"><FileImage size={21} /></div><h3 className="cp-tool-title">Compressor de imagens</h3><p className="cp-tool-text">Comprima JPG, PNG e WebP sem complicações.</p></div>
        <div className="cp-tool-card"><div className="cp-tool-icon"><Settings size={21} /></div><h3 className="cp-tool-title">Simples de usar</h3><p className="cp-tool-text">Interface limpa e fácil para qualquer pessoa.</p></div>
      </div>
    </div>
  </section>
);

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/compress-pdf" element={<CompressTool accept=".pdf" fileTypeLabel="PDF" acceptedFormats="PDF · Máximo 50 MB" />} />
            <Route path="/compress-image" element={<CompressTool accept=".jpg,.jpeg,.png,.webp" fileTypeLabel="Imagem" acceptedFormats="JPG · PNG · WebP" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
