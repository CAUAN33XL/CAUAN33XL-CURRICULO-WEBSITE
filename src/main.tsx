import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Resume } from './components/Resume'
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

const App = () => {
  const [lang, setLang] = useState<Lang>('pt');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

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
    setIsShareOpen(false);
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
    setIsShareOpen(false);
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
    setIsShareOpen(false);
  };

  return (
    <div className="min-h-screen py-10 bg-neutral-100 dark:bg-black flex justify-center relative">
      {/* EXPORT BUTTONS (LEFT) */}
      <div className="no-print fixed top-6 left-6 flex flex-col gap-2 z-50">
        <button 
          onClick={handlePrint}
          className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 text-xs font-medium py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-center w-20 tracking-wider"
        >
          PDF
        </button>
        <button 
          onClick={handleDocx}
          className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-neutral-800 text-xs font-medium py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-center w-20 tracking-wider"
        >
          DOCX
        </button>
        <button 
          onClick={handlePng}
          className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-white dark:hover:bg-neutral-800 text-xs font-medium py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-center w-20 tracking-wider"
        >
          PNG
        </button>
      </div>

      {/* TOOL BUTTONS (RIGHT) */}
      <div className="no-print fixed top-6 right-6 flex flex-col gap-2 z-50 w-24">
        <button 
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="bg-white dark:bg-black text-black dark:text-white border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-center w-full h-8"
          title="Alternar Tema"
        >
          <svg className="w-4 h-4 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <svg className="w-4 h-4 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.364a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.364a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm2.364-4.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="relative w-full">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="bg-white dark:bg-black text-black dark:text-white font-bold text-xs border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-between w-full h-8 tracking-wider"
            title="Alternar Idioma"
          >
            <span>{lang.toUpperCase()}</span>
            <svg className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isLangOpen && (
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg overflow-hidden flex flex-col z-50">
              {(['pt', 'en', 'es'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setIsLangOpen(false); }}
                  className={`py-1.5 px-3 text-xs font-bold tracking-wider text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 ${lang === l ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full">
          <button 
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="bg-white dark:bg-black text-black dark:text-white font-bold text-[10px] border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-between w-full h-8 tracking-wider"
            title="Compartilhar"
          >
            <span>SHARE</span>
            <svg className={`w-3 h-3 transition-transform ${isShareOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
          {isShareOpen && (
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg overflow-hidden flex flex-col z-50">
               <button
                  onClick={handleShareLink}
                  className="py-1.5 px-3 text-[10px] font-bold tracking-wider text-left text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white"
                >
                  LINK
                </button>
                <button
                  onClick={handleShareDocx}
                  className="py-1.5 px-3 text-[10px] font-bold tracking-wider text-left text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white"
                >
                  DOCX
                </button>
                <button
                  onClick={handleSharePng}
                  className="py-1.5 px-3 text-[10px] font-bold tracking-wider text-left text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white"
                >
                  PNG
                </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10 w-full max-w-4xl mb-24">
        <Resume data={translations[lang].data} labels={translations[lang].labels} onOpenIframe={setIframeUrl} />
      </div>

      {iframeUrl && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="h-8 bg-neutral-100 dark:bg-neutral-900 flex justify-between items-center px-3 border-b border-neutral-300 dark:border-neutral-800 shrink-0">
            <span className="text-neutral-600 dark:text-neutral-400 text-[10px] font-mono truncate max-w-md">{iframeUrl}</span>
            <button 
              onClick={() => setIframeUrl(null)} 
              className="text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1"
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
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
