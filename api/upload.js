const { requireAuth } = require("./_lib/auth");
const { getContentShaAndText, putBinaryContent } = require("./_lib/github");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (!requireAuth(req, res)) return;
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const contentType = req.headers["content-type"] || "";
    if (!contentType.startsWith("multipart/form-data")) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: "invalid_multipart" }));
    }
    // naive boundary extraction
    const boundary = contentType.split("boundary=")[1];
    const buffer = Buffer.concat(chunks);
    const parts = buffer.toString("binary").split(`--${boundary}`);
    let path = "public/uploads/";
    let filename = `file-${Date.now()}`;
    let fileBuffer = null;
    for (const part of parts) {
      if (!part || part === "--\r\n") continue;
      const [rawHeaders, rawBody] = part.split("\r\n\r\n");
      if (!rawHeaders || !rawBody) continue;
      const headers = rawHeaders.toString();
      if (headers.includes('name="path"')) {
        const val = rawBody.split("\r\n")[0];
        if (val) path = val.replace(/^\/+/, "");
      }
      if (headers.includes('name="file"')) {
        const m = headers.match(/filename="([^"]+)"/);
        if (m) filename = m[1];
        const bodyBin = Buffer.from(rawBody, "binary");
        // remove trailing CRLF and boundary ending
        fileBuffer = bodyBin.slice(0, bodyBin.length - 2);
      }
    }
    if (!fileBuffer) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: "no_file" }));
    }
    // Compose GitHub path under public/
    const fullPath = `${path}${
      path.endsWith("/") ? "" : "/"
    }${filename}`.replace(/^\/+/, "");
    // Try to get sha (if the file exists) to allow overwrite
    let sha = undefined;
    try {
      const stat = await getContentShaAndText(fullPath);
      sha = stat.sha;
    } catch {}
    await putBinaryContent(
      fullPath,
      `chore(upload): ${fullPath}`,
      fileBuffer,
      sha
    );
    const url = `/${fullPath.replace(/^public\//, "")}`;
    res.end(JSON.stringify({ ok: true, path: fullPath, url }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: "upload_failed" }));
  }
};
