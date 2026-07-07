import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import chalk from "chalk";
import { generatePdf } from "./generators/pdf";
import { buildDocx } from "./generators/docx";
import { Packer } from "docx";
import { CVData } from "./data/schema";

async function main() {
  const dataPath = path.resolve(process.cwd(), "src/data/cv-data.yaml");
  const outputDir = path.resolve(process.cwd(), "output");

  if (!fs.existsSync(dataPath)) {
    console.error(chalk.red(`Error: Could not find ${dataPath}`));
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log(chalk.blue("Reading CV data..."));
  const fileContent = fs.readFileSync(dataPath, "utf8");
  const data: CVData = yaml.parse(fileContent);

  const format = process.argv[2] || "all";
  
  const pdfOutput = path.join(outputDir, "CV.pdf");
  const docxOutput = path.join(outputDir, "CV.docx");

  try {
    if (format === "all" || format === "pdf") {
      console.log(chalk.yellow("Generating PDF..."));
      await generatePdf(data, pdfOutput);
    }
    
    if (format === "all" || format === "docx") {
      console.log(chalk.yellow("Generating DOCX..."));
      const labels = {
        objective: "Objetivo:",
        summary: "Resumo de Qualificações",
        experience: "Experiência Profissional",
        education: "Formação Acadêmica",
        skills: "Habilidades e Competências",
        languages: "Idiomas",
        mainActivities: "Principais atividades:",
        technology: "Tecnologia",
        administrative: "Administrativo",
        projects: "Projetos Pessoais & Portfólio",
        accessNetworks: "Acesse minhas redes profissionais abaixo para visualizar código-fonte completo e histórico profissional:",
        accessBtn: "ACESSAR"
      };
      const doc = buildDocx(data, labels);
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(docxOutput, buffer);
      console.log(`[DOCX] Successfully generated ${docxOutput}`);
    }

    console.log(chalk.green("Done! ✓"));
  } catch (error) {
    console.error(chalk.red("An error occurred during generation:"));
    console.error(error);
  }
}

main();
