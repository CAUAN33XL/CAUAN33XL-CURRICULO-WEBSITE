import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Resume } from './components/Resume'
import { Scene3D } from './components/3d/Scene'
import { buildDocx } from './generators/docx'
import { Packer } from 'docx'
import { toPng } from 'html-to-image'
import './index.css'
// @ts-ignore
import cvDataPt from './data/cv-data.yaml'
// @ts-ignore
import cvDataEn from './data/cv-data-en.yaml'
// @ts-ignore
import cvDataEs from './data/cv-data-es.yaml'

const translations = {
  pt: {
    data: cvDataPt,
    labels: {
      objective: "Objetivo:",
      summary: "Resumo de Qualificações",
      experience: "Experiência Profissional",
      mainActivities: "Principais atividades:",
      education: "Formação Acadêmica",
      skills: "Habilidades e Competências",
      languages: "Idiomas",
      technology: "Tecnologia",
      administrative: "Administrativo",
      projects: "Projetos Pessoais & Portfólio",
      accessNetworks: "Acesse minhas redes profissionais abaixo para visualizar código-fonte completo e histórico profissional:",
      accessBtn: "ACESSAR"
    }
  },
  en: {
    data: cvDataEn,
    labels: {
      objective: "Objective:",
      summary: "Summary of Qualifications",
      experience: "Professional Experience",
      mainActivities: "Main activities:",
      education: "Academic Background",
      skills: "Skills and Competencies",
      languages: "Languages",
      technology: "Technology",
      administrative: "Administrative",
      projects: "Personal Projects & Portfolio",
      accessNetworks: "Access my professional networks below to view full source code and professional history:",
      accessBtn: "ACCESS"
    }
  },
  es: {
    data: cvDataEs,
    labels: {
      objective: "Objetivo:",
      summary: "Resumen de Cualificaciones",
      experience: "Experiencia Profesional",
      mainActivities: "Actividades principales:",
      education: "Formación Académica",
      skills: "Habilidades y Competencias",
      languages: "Idiomas",
      technology: "Tecnología",
      administrative: "Administrativo",
      projects: "Proyectos Personales y Portafolio",
      accessNetworks: "Accede a mis redes profesionales a continuación para ver el código fuente completo y el historial profesional:",
      accessBtn: "ACCEDER"
    }
  }
};

type Lang = 'pt' | 'en' | 'es';

const getInitialLang = (): Lang => {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('es')) return 'es';
  }
  return 'en';
};

const App = () => {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close menu when pressing ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDocx = async () => {
    const { data, labels } = translations[lang];
    const doc = buildDocx(data, labels);
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV-${data.personal_info.name.replace(/\s+/g, '_')}_${lang.toUpperCase()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePng = async () => {
    const { data } = translations[lang];
    const elements = document.querySelectorAll('.resume-page-export');
    if (elements.length === 0) return;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      const url = await toPng(el, { quality: 1, pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV-${data.personal_info.name.replace(/\s+/g, '_')}_${lang.toUpperCase()}_Pagina_${i + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      await new Promise(res => setTimeout(res, 300));
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.share({
        title: `Currículo - ${translations[lang].data.personal_info.name}`,
        text: 'Confira meu currículo e portfólio completo:',
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing link:', err);
    }
    setIsMenuOpen(false);
  };

  const handleShareDocx = async () => {
    try {
      const { data, labels } = translations[lang];
      const doc = buildDocx(data, labels);
      const blob = await Packer.toBlob(doc);
      const file = new File([blob], `CV-${data.personal_info.name.replace(/\s+/g, '_')}_${lang.toUpperCase()}.docx`, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Currículo - ${data.personal_info.name}`,
          text: 'Confira meu currículo no formato DOCX:',
        });
      } else {
        alert("Seu navegador não suporta envio direto de arquivos. O download será iniciado.");
        handleDocx();
      }
    } catch (err) {
      console.error('Error sharing DOCX:', err);
    }
    setIsMenuOpen(false);
  };

  const handleSharePng = async () => {
    try {
      const { data } = translations[lang];
      const elements = document.querySelectorAll('.resume-page-export');
      if (elements.length === 0) return;
      
      const files: File[] = [];
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        files.push(new File([blob], `CV_${lang.toUpperCase()}_Pagina_${i + 1}.png`, { type: 'image/png' }));
      }
      
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: `Currículo - ${data.personal_info.name}`,
          text: 'Confira meu currículo em formato de imagem:',
        });
      } else {
        alert("Seu navegador não suporta envio direto de arquivos. O download será iniciado.");
        handlePng();
      }
    } catch (err) {
      console.error('Error sharing PNG:', err);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen py-6 lg:py-10 px-4 sm:px-6 bg-neutral-100 dark:bg-black flex flex-col items-center relative">
      {/* MENU BUTTON (TOP RIGHT) */}
      <div className="no-print fixed top-6 right-6 z-[60]">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-bold py-2 px-4 rounded-md shadow-lg flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all"
        >
          <span className="text-xs tracking-[0.2em] uppercase">MENU</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* DRAWER MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] flex justify-center items-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white dark:bg-black font-['Xirod'] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-bold tracking-[0.3em] uppercase text-sm dark:text-white">Opções</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-500 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Modo 3D */}
              <div>
                <button 
                  onClick={() => { setIs3DMode(true); setIsMenuOpen(false); }}
                  className="w-full py-4 px-4 bg-white hover:bg-neutral-200 text-black border-2 border-black dark:border-white font-black text-xs tracking-widest uppercase rounded shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                  Iniciar Modo 3D
                </button>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* Tema e Idioma */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">Tema</span>
                  <button 
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <svg className="w-4 h-4 hidden dark:block text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                    <svg className="w-4 h-4 block dark:hidden text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.364a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.364a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm2.364-4.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">Idioma</span>
                  <div className="flex gap-1 border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
                    {(['pt', 'en', 'es'] as Lang[]).map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`py-1.5 px-3 text-[10px] font-bold tracking-wider transition-colors ${lang === l ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black' : 'bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* Exportação (Subgaveta) */}
              <div>
                <button 
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white py-2 group"
                >
                  <span className="group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">Exportar & Compartilhar</span>
                  <svg className={`w-4 h-4 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {isExportOpen && (
                  <div className="mt-4 flex flex-col gap-2 pl-2 border-l-2 border-neutral-200 dark:border-neutral-800">
                    <button onClick={handlePrint} className="text-left text-xs tracking-wider py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Imprimir / Salvar PDF
                    </button>
                    <button onClick={handleDocx} className="text-left text-xs tracking-wider py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Baixar arquivo DOCX
                    </button>
                    <button onClick={handlePng} className="text-left text-xs tracking-wider py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Baixar imagens (PNG)
                    </button>
                    <button onClick={handleShareLink} className="text-left text-xs tracking-wider py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      Compartilhar Link (Web API)
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}


      <div className="flex flex-col gap-10 w-full max-w-4xl mb-24">
        <Resume data={translations[lang].data} labels={translations[lang].labels} onOpenIframe={setIframeUrl} />
      </div>

      {iframeUrl && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="h-6 bg-black flex justify-between items-center px-3 border-b border-neutral-800 shrink-0">
            <span className="text-neutral-400 text-[10px] font-mono truncate max-w-md">{iframeUrl}</span>
            <button 
              onClick={() => setIframeUrl(null)} 
              className="text-neutral-400 hover:text-red-500 transition-colors p-0.5"
              title="Fechar (X)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <iframe 
            src={iframeUrl} 
            className="w-full flex-1 bg-white" 
            title="Project Preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      )}

      {is3DMode && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="h-6 bg-black flex justify-between items-center px-3 border-b border-neutral-800 shrink-0">
            <span className="text-neutral-400 text-[10px] font-mono truncate max-w-md">3D Mode - Portfólio Interativo</span>
            <button 
              onClick={() => setIs3DMode(false)} 
              className="text-neutral-400 hover:text-red-500 transition-colors p-0.5"
              title="Fechar (X)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Scene3D />
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
