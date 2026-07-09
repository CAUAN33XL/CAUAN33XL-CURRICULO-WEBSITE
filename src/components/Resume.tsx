import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { CVData } from "../data/schema";

export interface ResumeProps {
  data: CVData;
  labels: any;
  onOpenIframe?: (url: string) => void;
  onOpen3DMode?: () => void;
}

export const Resume: React.FC<ResumeProps> = ({ data, labels, onOpenIframe, onOpen3DMode }) => {
  const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="resume-page-export antialiased w-full p-12 bg-white dark:bg-black text-[#1f2937] dark:text-neutral-100 shadow-2xl dark:shadow-neutral-900/50 rounded-lg overflow-hidden">
      {children}
    </div>
  );

  return (
    <>
      <Page>
      <header className="mb-10 text-center border-b-2 border-neutral-200 dark:border-neutral-800 pb-8">
        <h1 className="text-3xl md:text-4xl dark:text-2xl dark:md:text-3xl font-bold text-neutral-900 dark:text-white dark:font-['Xirod'] tracking-tight uppercase mb-2">
          {data.personal_info.name}
        </h1>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>{data.personal_info.address}</span>
          <span>&bull;</span>
          <span>{data.personal_info.email}</span>
          <span>&bull;</span>
          <span>{data.personal_info.phone.join(" | ")}</span>
        </div>
        <div className="mt-4 inline-block bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {labels.objective} {data.personal_info.objective}
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white dark:font-['Xirod'] mb-4 uppercase tracking-wider border-l-4 border-black dark:border-white pl-3">
          {labels.summary}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          {data.summary.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10 page-break">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white dark:font-['Xirod'] mb-6 uppercase tracking-wider border-l-4 border-black dark:border-white pl-3">
          {labels.experience}
        </h2>
        <div className="space-y-6">
          {data.experience.map((exp, i) => (
            <div key={i} className="relative pl-4 border-l border-neutral-200 dark:border-neutral-800">
              <div className="absolute w-2 h-2 bg-black dark:bg-white rounded-full -left-[4.5px] top-1.5"></div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{exp.role}</h3>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded">
                  {exp.period}
                </span>
              </div>
              <p className="text-md font-medium text-neutral-700 dark:text-neutral-300 mb-2">{exp.company}</p>
              <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                {labels.mainActivities}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                {exp.responsibilities.map((resp, j) => (
                  <li key={j}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 page-break">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white dark:font-['Xirod'] mb-6 uppercase tracking-wider border-l-4 border-black dark:border-white pl-3">
          {labels.education}
        </h2>
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-bold text-neutral-900 dark:text-white">{edu.degree}</h3>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{edu.period}</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{edu.institution}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-break">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white dark:font-['Xirod'] mb-6 uppercase tracking-wider border-l-4 border-black dark:border-white pl-3">
          {labels.skills}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              {labels.technology}
            </h3>
            <ul className="space-y-2">
              {data.skills.technology.map((skill, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">{skill.name}</span>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{skill.level}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              {labels.administrative}
            </h3>
            <ul className="space-y-2">
              {data.skills.administrative.map((skill, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">{skill.name}</span>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{skill.level}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              {labels.languages}
            </h3>
            <ul className="space-y-2">
              {data.skills.languages.map((skill, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-1">
                  <span className="text-neutral-700 dark:text-neutral-300">{skill.name}</span>
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{skill.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      </Page>

      {data.projects && data.projects.length > 0 && (
        <Page>
        <section className="mt-10 page-break">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white dark:font-['Xirod'] mb-6 uppercase tracking-wider border-l-4 border-black dark:border-white pl-3">
            {labels.projects}
          </h2>
          
          <div className="mb-6 flex flex-col items-center border border-neutral-200 dark:border-neutral-800 rounded p-4 bg-white dark:bg-neutral-900 shadow-sm">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-4 text-center">
              {labels.accessNetworks}
            </p>
            <div className="flex gap-24">
              {data.personal_info.linkedin && (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-widest uppercase">LinkedIn</span>
                  <div className="p-1 bg-white border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm">
                    <QRCodeSVG value={data.personal_info.linkedin} size={96} level="M" />
                  </div>
                  <a href={data.personal_info.linkedin} target="_blank" className="text-[10px] font-bold text-white dark:text-black bg-neutral-900 dark:bg-white px-3 py-1 rounded w-full text-center hover:bg-white hover:text-black hover:outline hover:outline-2 hover:outline-black dark:hover:bg-black dark:hover:text-white dark:hover:outline-white transition-all tracking-wider no-underline">
                    {labels.accessBtn}
                  </a>
                </div>
              )}
              {data.personal_info.github && (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-widest uppercase">GitHub</span>
                  <div className="p-1 bg-white border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm">
                    <QRCodeSVG value={data.personal_info.github} size={96} level="M" />
                  </div>
                  <a href={data.personal_info.github} target="_blank" className="text-[10px] font-bold text-white dark:text-black bg-neutral-900 dark:bg-white px-3 py-1 rounded w-full text-center hover:bg-white hover:text-black hover:outline hover:outline-2 hover:outline-black dark:hover:bg-black dark:hover:text-white dark:hover:outline-white transition-all tracking-wider no-underline">
                    {labels.accessBtn}
                  </a>
                </div>
              )}
            </div>
          </div>
          {data.projects_disclaimer && (
            <div className="mb-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-3 text-sm text-neutral-600 dark:text-neutral-400 italic">
              {data.projects_disclaimer}
            </div>
          )}
          <div className="space-y-6">
            {data.projects.map((proj, i) => (
              <React.Fragment key={i}>
                {proj.name === "33XL SYSTEM (WEBSITE OFICIAL)" && onOpen3DMode && (
                  <div className="w-full flex justify-center my-8">
                    <button 
                      onClick={onOpen3DMode}
                      className="bg-black text-white dark:bg-white dark:text-black border-2 border-transparent dark:border-white hover:bg-white hover:text-black hover:border-black dark:hover:bg-black dark:hover:text-white dark:hover:border-white px-6 py-3 rounded font-['Xirod'] text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">🕶️</span>
                      ENTRAR NO MODO 3D (INTERATIVO)
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{proj.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proj.technologies.map((tech, j) => (
                        <span key={j} className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {proj.link && (
                    <div className="flex-shrink-0 pt-1 flex flex-col items-center gap-1.5 ml-4">
                      <div className="p-1 bg-white border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm inline-block">
                        <QRCodeSVG value={proj.link} size={64} level="M" />
                      </div>
                      <a 
                        href={proj.link} 
                        target="_blank" 
                        onClick={(e) => {
                          if (onOpenIframe) {
                            e.preventDefault();
                            onOpenIframe(proj.link!);
                          }
                        }}
                        className="text-[10px] font-bold text-white dark:text-black bg-neutral-900 dark:bg-white px-3 py-1 rounded w-full text-center hover:bg-white hover:text-black hover:outline hover:outline-2 hover:outline-black dark:hover:bg-black dark:hover:text-white dark:hover:outline-white transition-all tracking-wider no-underline"
                      >
                        {labels.accessBtn}
                      </a>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>
        </Page>
      )}
    </>
  );
};
