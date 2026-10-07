import { useEffect, useState } from "react";

export default function DocxPreview({ blob, name }) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const [{ default: mammoth }, { default: DOMPurify }] = await Promise.all([
          import("mammoth/mammoth.browser.js"), import("dompurify"),
        ]);
        const result = await mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() }, { externalFileAccess: false });
        const html = DOMPurify.sanitize(result.value, { USE_PROFILES: { html: true } });
        if (!cancelled) setDocument(`<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'"><style>body{font:16px/1.6 Arial,sans-serif;color:#2a2e34;padding:24px;margin:0;overflow-wrap:anywhere}h1,h2,h3{line-height:1.25}table{border-collapse:collapse;width:100%;margin:16px 0}td,th{border:1px solid #cbd5e1;padding:8px;vertical-align:top}img{max-width:100%;height:auto}a{color:#007fb2}</style></head><body>${html || "<p>This document has no previewable content.</p>"}</body></html>`);
      } catch {
        if (!cancelled) setError("This Word document could not be previewed. You can still download the original file.");
      }
    }
    render();
    return () => { cancelled = true; };
  }, [blob]);

  if (error) return <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">{error}</p>;
  if (document === null) return <p role="status" className="rounded-xl bg-slate-50 p-5">Preparing document preview…</p>;
  return <iframe title={name} srcDoc={document} sandbox="" className="h-[60vh] w-full rounded-xl border bg-white" />;
}
