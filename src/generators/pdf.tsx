import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import puppeteer from "puppeteer";
import * as fs from "fs";
import { CVData } from "../data/schema";
import { Resume } from "../components/Resume";

export async function generatePdf(data: CVData, outputPath: string) {
  const html = "<!DOCTYPE html>\n" + renderToStaticMarkup(
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${data.personal_info.name} - CV`}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: white;
            color: #1f2937; /* gray-800 */
          }
          .page-break {
            page-break-inside: avoid;
          }
        `}</style>
      </head>
      <body>
        <Resume data={data} />
      </body>
    </html>
  );

  // Launch puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set content and wait for network (tailwind CDN) to finish loading
  await page.setContent(html, { waitUntil: "load" });
  
  // Emulate print media type
  await page.emulateMediaType("print");
  
  // Generate PDF
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: "0px",
    },
  });

  await browser.close();
  console.log(`[PDF] Successfully generated ${outputPath}`);
}
