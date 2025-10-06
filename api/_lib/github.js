const fetch = require("node-fetch");

const GITHUB_API = "https://api.github.com";

async function getContentShaAndText(path) {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;
  const url = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(
    path
  )}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "vercel-fn",
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub get content failed: ${res.status} ${txt}`);
  }
  const json = await res.json();
  const sha = json.sha;
  const content = Buffer.from(json.content || "", "base64").toString("utf8");
  return { sha, content };
}

async function putContent(path, message, text, sha) {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;
  const url = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(
    path
  )}`;
  const body = {
    message,
    content: Buffer.from(text, "utf8").toString("base64"),
    branch,
    sha,
  };
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "vercel-fn",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub put content failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

module.exports = { getContentShaAndText, putContent };
