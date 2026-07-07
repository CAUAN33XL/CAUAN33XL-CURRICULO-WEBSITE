import re

with open('src/components/Resume.tsx', 'r') as f:
    content = f.read()

# 1. Update interface
content = content.replace(
    'export const Resume: React.FC<{ data: CVData }> = ({ data }) => {',
    'export const Resume: React.FC<{ data: CVData; labels: any }> = ({ data, labels }) => {'
)

# 2. Replace static labels with `labels.something`
replacements = {
    'Objetivo: ': '{labels.objective} ',
    'Resumo de Qualificações': '{labels.summary}',
    'Experiência Profissional': '{labels.experience}',
    'Principais atividades:': '{labels.mainActivities}',
    'Formação Acadêmica': '{labels.education}',
    'Habilidades e Competências': '{labels.skills}',
    'Idiomas\n            </h3>': '{labels.languages}\n            </h3>',
    'Tecnologia\n            </h3>': '{labels.technology}\n            </h3>',
    'Administrativo\n            </h3>': '{labels.administrative}\n            </h3>',
    'Projetos Pessoais & Portfólio': '{labels.projects}',
    'Acesse minhas redes profissionais abaixo para visualizar código-fonte completo e histórico profissional:': '{labels.accessNetworks}',
    '>\n                    ACESSAR\n                  </a>': '>\n                    {labels.accessBtn}\n                  </a>',
    '>\n                      ACESSAR\n                    </a>': '>\n                      {labels.accessBtn}\n                    </a>'
}

for old, new_val in replacements.items():
    content = content.replace(old, new_val)

with open('src/components/Resume.tsx', 'w') as f:
    f.write(content)
