import { GoogleGenerativeAI } from "@google/generative-ai";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body;

    // Handle different input formats (Vite vs standalone)
    if (req.body && Buffer.isBuffer(req.body)) {
      // Vite middleware passes raw buffer
      body = req.body;
    } else {
      // Standard formidable parsing for standalone use
      const form = formidable();
      const [fields, files] = await form.parse(req);

      const pdfFile = files.pdf && files.pdf[0];
      if (!pdfFile) {
        return res.status(400).json({ error: "No PDF file provided" });
      }

      body = fs.readFileSync(pdfFile.filepath);
    }

    // For Vite middleware, we need to parse the multipart data manually
    if (Buffer.isBuffer(body)) {
      const boundary = req.headers["content-type"]?.split("boundary=")[1];
      if (!boundary) {
        return res.status(400).json({ error: "Invalid multipart form data" });
      }

      // Simple multipart parsing for PDF extraction
      const bodyStr = body.toString("binary");
      const parts = bodyStr.split(`--${boundary}`);

      let pdfBuffer = null;

      for (const part of parts) {
        if (part.includes("filename=") && part.includes(".pdf")) {
          // Find the start of binary data (after double CRLF)
          const dataStart = part.indexOf("\r\n\r\n") + 4;
          if (dataStart > 3) {
            const binaryData = part.substring(dataStart);
            // Remove the trailing boundary
            const endIndex = binaryData.lastIndexOf("\r\n--");
            const cleanBinaryData =
              endIndex > 0 ? binaryData.substring(0, endIndex) : binaryData;
            pdfBuffer = Buffer.from(cleanBinaryData, "binary");
            break;
          }
        }
      }

      if (!pdfBuffer) {
        return res.status(400).json({ error: "No PDF file found in request" });
      }

      body = pdfBuffer;
    }

    // Extract text from PDF
    const pdfData = await pdf(body);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 100) {
      return res.status(400).json({ error: "PDF content too short or empty" });
    }

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `Genera contenido para un CMS de productos en formato JSON.

IMPORTANTE: Responde SOLAMENTE con JSON válido. No uses markdown ni explicaciones.

ROLE: You are an extraction and structuring engine. You read a single Spanish PDF text about ONE product and output a bilingual, UX-ready JSON for two front-end views (Card/Detail). Do not add Markdown. Output JSON ONLY.

GROUNDING RULES (very strict):
- Use ONLY facts present in the PDF text below. Do NOT invent specs, features, or numbers.
- If a field truly has no support in the PDF, omit that key OR leave it empty ("") but keep array sizes when required.
- Prefer measurable/technical phrasing over marketing fluff.

UX DEFINITIONS:
- features (Card): EXACTLY 4 short phrases (3–6 words) capturing WHAT the product does / measures / outputs (not benefits). No punctuation at the end.
- featuresDetail (Detail): EXACTLY 4 objects, same order as features. Each object:
  - title: 1–2 words related to the corresponding feature_i (title ≠ the full feature_i text)
  - description: 10–22 words that explain HOW/WHAT with a concrete, technical angle (no benefits, no fluff).
- capabilities: operational BENEFITS (what the user can accomplish). Size MUST be {{capabilitiesTarget}} items (allowed values: 4, 6, or 8). Do not merely repeat features. Examples of capability patterns: trazabilidad, productividad, trabajo en campo, representatividad estadística, integración de datos, auditoría, exportación, multisede, etc.
- specifications: pick 4–6 key comparable specs (peso, dimensiones, alimentación, cámara/sensores, garantía, materiales, sistemas, etc.). Key names concise.

BILINGUAL REQUIREMENT:
- Provide ES and EN for ALL user-facing fields. If the PDF is only in Spanish, translate to English faithfully (no invented facts).
- English should be clear and technical.

OUTPUT SHAPE (JSON ONLY):
{
  "name": { "es": "", "en": "" },
  "category": { "es": "", "en": "" },
  "tagline": { "es": "", "en": "" },              // 3–4 words oriented to result
  "description": { "es": "", "en": "" },          // 1–2 sentences, value-oriented (Card)
  "descriptionDetail": { "es": "", "en": "" },    // 3–5 sentences, more context (Detail)
  "features": {
    "es": ["", "", "", ""],
    "en": ["", "", "", ""]
  },
  "featuresDetail": {
    "es": [
      { "title": "", "description": "" }, //featuresDetail[1].title must be a 1–2 word label derived from features[1] (not copy-pasted) and featuresDetail[1].description must be 10–12 words related to features[1]
      { "title": "", "description": "" }, //featuresDetail[2].title must be a 1–2 word label derived from features[2] (not copy-pasted) and featuresDetail[2].description must be 10–12 words related to features[2]
      { "title": "", "description": "" }, //featuresDetail[3].title must be a 1–2 word label derived from features[3] (not copy-pasted) and featuresDetail[3].description must be 10–12 words related to features[3]
      { "title": "", "description": "" }  //featuresDetail[4].title must be a 1–2 word label derived from features[4] (not copy-pasted) and featuresDetail[4].description must be 10–12 words related to features[4]
    ],
    "en": [
      { "title": "", "description": "" },
      { "title": "", "description": "" },
      { "title": "", "description": "" },
      { "title": "", "description": "" }
    ]
  },
  "specifications": {
    "es": { "": "", "": "", "": "", "": "" },
    "en": { "": "", "": "", "": "", "": "" }
  },
  "capabilities": {             
    "es": ["", "", "", ""], //4 capabilities = non-redundant benefits, not restating features
    "en": ["", "", "", ""]
  }
}

CONSTRAINTS:
- features.length must be 4 exactly. featuresDetail.length must be 4 exactly. capabilities.length must be 4 exactly.
- featuresDetail[i].title must be a 1–2 word label derived from features[i] (not copy-pasted).
- No marketing claims, no "state-of-the-art" unless stated. Avoid adjectives like “innovador” unless present in PDF.
- Numbers, units, and ranges must match the PDF exactly.
- If a spec exists in multiple variants in the PDF, choose the most recent/explicit numeric value (avoid conflicts).

CHECKLIST BEFORE EMITTING:
- [ ] 4 features (3–6 words each, WHAT it does/outputs).
- [ ] 4 featuresDetail with titles (1–2 words) and technical descriptions (10–12 words).
- [ ] 4 capabilities = non-redundant benefits, not restating features.
- [ ] 4–6 specs, concise keys.
- [ ] Bilingual (ES/EN) for all user-facing fields.

Contenido del PDF (Spanish, source-of-truth):
${pdfText.slice(0, 25000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // DEBUG: Log de la respuesta completa del modelo
    console.log("🤖 DEBUG - Respuesta RAW completa del modelo Gemini:");
    console.log("================================");
    console.log(text);
    console.log("================================");

    // Clean and parse JSON response with better error handling
    let cleanText = text.trim();

    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?|\n?```/g, "");

    // Try to find JSON object in the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    // Additional cleanup
    cleanText = cleanText.trim();

    let generatedContent;
    try {
      generatedContent = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Raw response:", text);
      console.error("Cleaned text:", cleanText);

      // Try alternative cleaning approach
      const alternativeClean = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^\s*[\w\s]*?\{/, "{") // Remove text before opening brace
        .replace(/\}[\w\s]*?$/, "}") // Remove text after closing brace
        .trim();

      try {
        generatedContent = JSON.parse(alternativeClean);
      } catch (secondParseError) {
        throw new Error(
          `Error parsing AI response: ${
            parseError.message
          }. Raw response: ${text.substring(0, 500)}...`
        );
      }
    }

    // Cleanup temp file
    fs.unlinkSync(pdfFile.filepath);

    // DEBUG: Log del contenido generado
    console.log(
      "🔍 DEBUG - Contenido generado por Gemini:",
      JSON.stringify(generatedContent, null, 2)
    );

    res.status(200).json(generatedContent);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      error: "Error generating content",
      details: error.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
