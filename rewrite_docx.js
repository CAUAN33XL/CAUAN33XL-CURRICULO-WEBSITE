const fs = require('fs');

let content = fs.readFileSync('src/generators/docx.ts', 'utf8');

// Remove ImageRun from docx import
content = content.replace(/,\s*ImageRun\s*/g, '');

// Remove qrcode import
content = content.replace(/import QRCode from "qrcode";\n/g, '');

// Make buildDocx synchronous
content = content.replace(/export async function buildDocx\(data: CVData\): Promise<Document> {/g, 'export function buildDocx(data: CVData): Document {');

// Remove headerQrCodes generation block completely
const startBlock = content.indexOf('  let headerQrCodes: any[] = [];');
const endBlock = content.indexOf('  const doc = new Document({');
if (startBlock !== -1 && endBlock !== -1) {
  content = content.substring(0, startBlock) + content.substring(endBlock);
}

// Replace headerQrCodes insertion logic with simple text links
const qrInsertStart = content.indexOf('            ...(headerQrCodes.length > 0 ? [');
const qrInsertEnd = content.indexOf('            ...(data.projects_disclaimer ? [');

if (qrInsertStart !== -1 && qrInsertEnd !== -1) {
  let textLinks = `            new Paragraph({
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
            }),\n`;
  content = content.substring(0, qrInsertStart) + textLinks + content.substring(qrInsertEnd);
}

// Replace Promise.all(data.projects.map(async ... with synchronous map
content = content.replace(/\.\.\.await Promise\.all\(data\.projects\.map\(async \(proj\) => {/g, '...data.projects.map((proj) => {');
// Remove qrCodeParagraph and its generation
content = content.replace(/              let qrCodeParagraph = null;\n              if \(proj\.link\) \{[\s\S]*?              \}\n\n              return \[/g, '              return [');

// Update the [ACESSAR] button in projects to a simple text link
content = content.replace(/\.\.\.\(qrCodeParagraph \? \[qrCodeParagraph\] : \[\]\),\n/g, '');
content = content.replace(/new TextRun\(\{ text: "\[ ACESSAR \]", color: "FFFFFF", shading: \{ type: "clear", fill: "000000" \}, bold: true, size: 20 \}\)/g, 'new TextRun({ text: proj.link, color: "0563C1", underline: { type: "single" } })');

// Fix the `.then(res => res.flat())` at the end
content = content.replace(/\}\)\)\.then\(res => res\.flat\(\)\)/g, '}).flat()');

fs.writeFileSync('src/generators/docx.ts', content);
