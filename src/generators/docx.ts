import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
  ExternalHyperlink,
} from "docx";
import { CVData } from "../data/schema";

export function buildDocx(data: CVData, labels: any): Document {
  const doc = new Document({
    creator: data.personal_info.name,
    title: `CV - ${data.personal_info.name}`,
    description: "Resume",
    styles: {
      default: {
        heading1: {
          run: {
            size: 28,
            bold: true,
            color: "333333",
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
            border: {
              bottom: {
                color: "AAAAAA",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          },
        },
        heading2: {
          run: {
            size: 24,
            bold: true,
            color: "444444",
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 120, after: 60 },
          },
        },
        document: {
          run: {
            size: 22, // 11pt
            font: "Calibri",
            color: "000000",
          },
          paragraph: {
            spacing: { line: 276, before: 60, after: 60 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.personal_info.name.toUpperCase(),
                bold: true,
                size: 32, // 16pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: data.personal_info.address }),
              new TextRun({ text: " | " }),
              new TextRun({ text: data.personal_info.email }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: data.personal_info.phone.join(" | ") }),
              new TextRun({ text: " | " }),
              new TextRun({ text: data.personal_info.nationality }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: `${labels.objective} `, bold: true }),
              new TextRun({ text: data.personal_info.objective }),
            ],
          }),

          // Resumo
          new Paragraph({
            text: "RESUMO DE QUALIFICAÇÕES",
            heading: HeadingLevel.HEADING_1,
          }),
          ...data.summary.map(
            (item) =>
              new Paragraph({
                text: item,
                bullet: { level: 0 },
              })
          ),

          // Formação Acadêmica
          new Paragraph({
            text: "FORMAÇÃO ACADÊMICA",
            heading: HeadingLevel.HEADING_1,
          }),
          ...data.education.flatMap((edu) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({ text: edu.institution, bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree }),
                new TextRun({ text: ` — (${edu.period})`, italics: true }),
              ],
            }),
          ]),

          // Experiência Profissional
          new Paragraph({
            text: "EXPERIÊNCIA PROFISSIONAL",
            heading: HeadingLevel.HEADING_1,
          }),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({ text: exp.company, bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true }),
                new TextRun({ text: ` | ${exp.period}`, italics: true }),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: labels.mainActivities, bold: true })],
              spacing: { before: 60 },
            }),
            ...exp.responsibilities.map(
              (resp) =>
                new Paragraph({
                  text: resp,
                  bullet: { level: 0 },
                })
            ),
          ]),

          // Habilidades e Competências
          new Paragraph({
            text: "HABILIDADES E COMPETÊNCIAS",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: "Idiomas:",
          }),
          ...data.skills.languages.map((lang) => 
            new Paragraph({ text: `${lang.name} – ${lang.level}`, bullet: { level: 0 }})
          ),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: "Tecnologia:",
          }),
          ...data.skills.technology.map((tech) => 
            new Paragraph({ text: `${tech.name} – ${tech.level}`, bullet: { level: 0 }})
          ),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            text: "Competências Administrativas:",
          }),
          ...data.skills.administrative.map((admin) => 
            new Paragraph({ text: `${admin.name} – ${admin.level}`, bullet: { level: 0 }})
          ),
          
          ...(data.projects && data.projects.length > 0 ? [
            new Paragraph({
              text: "PROJETOS PESSOAIS & PORTFÓLIO",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 240 },
              children: [
                ...(data.personal_info.linkedin ? [
                  new TextRun({ text: "LinkedIn: ", bold: true }),
                  new ExternalHyperlink({
                    children: [new TextRun({ text: data.personal_info.linkedin, color: "0563C1", underline: { type: "single" } })],
                    link: data.personal_info.linkedin
                  }),
                  new TextRun({ text: "    " })
                ] : []),
                ...(data.personal_info.github ? [
                  new TextRun({ text: "GitHub: ", bold: true }),
                  new ExternalHyperlink({
                    children: [new TextRun({ text: data.personal_info.github, color: "0563C1", underline: { type: "single" } })],
                    link: data.personal_info.github
                  })
                ] : [])
              ]
            }),
            ...(data.projects_disclaimer ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.projects_disclaimer,
                    italics: true,
                  })
                ],
                spacing: { before: 120, after: 120 },
                style: "WellSpaced"
              })
            ] : []),
            ...data.projects.map((proj) => {
              return [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  children: [
                    new TextRun({ text: proj.name, bold: true }),
                  ],
                }),
                new Paragraph({
                  text: proj.description,
                  spacing: { before: 60 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Tecnologias: ", bold: true }),
                    new TextRun({ text: proj.technologies.join(", ") })
                  ],
                  spacing: { before: 60, after: 60 }
                }),
                ...(proj.link ? [
                                    new Paragraph({
                    children: [
                      new ExternalHyperlink({
                        children: [
                          new TextRun({ text: proj.link, color: "0563C1", underline: { type: "single" } })
                        ],
                        link: proj.link,
                      })
                    ],
                    spacing: { before: 0, after: 120 }
                  })
                ] : []),
              ];
            }).flat()
          ] : [])
        ],
      },
    ],
  });

  return doc;
}
