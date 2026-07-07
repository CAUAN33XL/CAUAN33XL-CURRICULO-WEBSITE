import re

with open('src/generators/docx.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'export function buildDocx(data: CVData): Document {',
    'export function buildDocx(data: CVData, labels: any): Document {'
)

replacements = {
    'new TextRun({ text: "Resumo de Qualificações",': 'new TextRun({ text: labels.summary,',
    'new TextRun({ text: "Experiência Profissional",': 'new TextRun({ text: labels.experience,',
    'new TextRun({ text: "Formação Acadêmica",': 'new TextRun({ text: labels.education,',
    'new TextRun({ text: "Habilidades e Competências",': 'new TextRun({ text: labels.skills,',
    'new TextRun({ text: "Idiomas",': 'new TextRun({ text: labels.languages,',
    'new TextRun({ text: "Tecnologia",': 'new TextRun({ text: labels.technology,',
    'new TextRun({ text: "Administrativo",': 'new TextRun({ text: labels.administrative,',
    'new TextRun({ text: "Projetos Pessoais & Portfólio",': 'new TextRun({ text: labels.projects,',
    'new TextRun({ text: "Principais atividades:",': 'new TextRun({ text: labels.mainActivities,',
    'new TextRun({ text: "Objetivo:",': 'new TextRun({ text: labels.objective,',
    'text: "Objetivo: "': 'text: `${labels.objective} `',
    'text: "Acesse minhas redes profissionais abaixo para visualizar código-fonte completo e histórico profissional:"': 'text: labels.accessNetworks',
    'text: "ACESSAR"': 'text: labels.accessBtn'
}

for old, new_val in replacements.items():
    content = content.replace(old, new_val)

with open('src/generators/docx.ts', 'w') as f:
    f.write(content)
