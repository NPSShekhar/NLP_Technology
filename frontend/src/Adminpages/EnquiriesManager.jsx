import { useEffect, useRef, useState } from "react";
import DocxPreview from "../components/DocxPreview";
import { Eye, Trash2, RefreshCw, X, Mail, Search, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";

const endpoint = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/contact-enquiries`;
const dateText = value => value ? new Date(value).toLocaleString() : "—";
const actionClass = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export default function EnquiriesManager({ authorization }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const dialog = useRef(null);
  const deleteDialog = useRef(null);
  const fileDialog = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => { if (pendingDelete) deleteDialog.current?.showModal(); }, [pendingDelete]);
  useEffect(() => { if (filePreview) fileDialog.current?.showModal(); }, [filePreview]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview.url); }, [filePreview]);

  async function openFile(item) {
    setFileLoading(true);
    setError("");
    try {
      const response = await fetch(`${endpoint}/${item.id}/file`, { headers: { Authorization: authorization } });
      if (!response.ok) throw new Error((await response.json()).message || "Unable to load uploaded file.");
      const blob = await response.blob();
      setFilePreview({ url: URL.createObjectURL(blob), name: item.file_name, type: blob.type, blob });
    } catch (failure) { setError(failure.message); }
    finally { setFileLoading(false); }
  }

  function fileLink(item, compact = false) {
    return item.file_name ? <button disabled={fileLoading} onClick={() => openFile(item)} title={item.file_name} className={`inline-flex items-start gap-2 text-left text-[#007fb2] no-underline hover:underline underline-offset-4 disabled:opacity-50 ${compact ? "max-w-[210px]" : "max-w-full"}`}><FileText size={16} className="mt-0.5 shrink-0" /><span className={compact ? "truncate" : "break-all"}>{item.file_name}</span></button> : <span className="text-slate-500">No uploaded file</span>;
  }

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(endpoint, { headers: { Authorization: authorization }, signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load enquiries.");
        setEnquiries(data.enquiries);
      } catch (failure) {
        if (failure.name !== "AbortError") setError(failure.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [authorization, revision]);

  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);

  async function remove(enquiry) {
    if (deleting !== null) return;
    setDeleteError("");
    setDeleting(enquiry.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${endpoint}/${enquiry.id}`, { method: "DELETE", headers: { Authorization: authorization } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete enquiry.");
      setEnquiries(items => items.filter(item => item.id !== enquiry.id));
      setNotice("Enquiry deleted successfully.");
      deleteDialog.current.close();
    } catch (failure) {
      setDeleteError(failure.message);
    } finally {
      setDeleting(null);
    }
  }

  const needle = query.trim().toLowerCase();
  const filtered = enquiries.filter(item => [item.name, item.email, item.phone, item.address, item.message].some(value => String(value || "").toLowerCase().includes(needle)));
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <section aria-labelledby="enquiries-heading" className="text-[#2A2E34]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="enquiries-heading" className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">Enquiries</h2>
          
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative w-full sm:w-80">
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input aria-label="Search enquiries" type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Name, email, company or message" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#00B2F9] focus:ring-2 focus:ring-sky-100" />
          </label>
          <span className="rounded-full bg-[#2A2E34] px-4 py-2 text-sm font-semibold text-white">{enquiries.length} {enquiries.length === 1 ? "Enquiry" : "Enquiries"}</span>
          <button className={`${actionClass} bg-[#EEF6FD] text-[#007fb2]`} disabled={loading || deleting !== null} onClick={() => setRevision(value => value + 1)}><RefreshCw size={17} />Refresh</button>
        </div>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-green-50 p-4 text-green-700">{notice}</p>}
      <div className="overflow-hidden rounded-[20px] bg-[#EEF6FD] p-4 shadow-sm md:p-6" aria-busy={loading}>
        {loading ? <p role="status" className="py-12 text-center">Loading enquiries…</p> : !filtered.length ? (
          <div className="py-12 text-center text-slate-500"><Mail className="mx-auto mb-3" /><p>{query ? "No enquiries match your search." : error ? "Enquiries could not be loaded. Please try Refresh." : "No enquiries yet."}</p></div>
        ) : <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead><tr className="border-b border-sky-200 text-slate-500">{["Name", "Company", "Contact", "Date & Time", "Message / Enquiry", "Uploaded Files", "Action"].map(title => <th key={title} scope="col" className="px-2 py-5 text-[16px] font-semibold">{title}</th>)}</tr></thead>
              <tbody className="[&_td]:align-top [&_td]:leading-6">{visible.map(item => <tr key={item.id} className="border-b border-sky-200 last:border-0">
                <td className="max-w-[160px] break-words px-3 py-5 font-semibold">{item.name}</td>
                <td className="max-w-[160px] break-words px-3 py-5">{item.address}</td>
                <td className="max-w-[240px] break-words px-3 py-5"><p>{item.email}</p><p className="mt-1 text-slate-500">{item.phone}</p></td>
                <td className="px-3 py-5 whitespace-nowrap">{dateText(item.created_at)}</td>
                <td className="px-3 py-5 whitespace-nowrap">{Array.from(item.message || "").slice(0, 15).join("")}{Array.from(item.message || "").length > 15 ? "...." : ""}</td>
                <td className="px-3 py-5">{fileLink(item, true)}</td>
                <td className="px-3 py-3"><div className="flex gap-2">
                  <button aria-label={`View enquiry from ${item.name}`} className={`${actionClass} bg-white text-[#008fce]`} onClick={() => setSelected(item)}><Eye size={16} />View</button>
                  <button aria-label={`Delete enquiry from ${item.name}`} className={`${actionClass} bg-red-50 text-red-600`} disabled={deleting !== null} onClick={() => { setDeleteError(""); setPendingDelete(item); }}><Trash2 size={16} />{deleting === item.id ? "Deleting…" : "Delete"}</button>
                </div></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p>{filtered.length} {filtered.length === 1 ? "result" : "results"} · Page {currentPage} of {pages}</p>
            <div className="flex gap-2"><button aria-label="Previous page" title="Previous page" className={`${actionClass} h-10 w-10 bg-white !p-0`} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={20} aria-hidden="true" /></button><button aria-label="Next page" title="Next page" className={`${actionClass} h-10 w-10 bg-white !p-0`} disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={20} aria-hidden="true" /></button></div>
          </div>
        </>}
      </div>
      <dialog ref={dialog} onClose={() => setSelected(null)} aria-labelledby="enquiry-detail-heading" className="m-auto max-h-[85vh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-[20px] bg-white p-6 text-[#2A2E34] shadow-2xl backdrop:bg-black/50 md:p-8">
        {selected && <>
          <div className="mb-6 flex items-center justify-between gap-4"><h2 id="enquiry-detail-heading" className="text-2xl font-bold">Enquiry details</h2><button autoFocus onClick={() => dialog.current.close()} aria-label="Close enquiry details" className="rounded-lg p-2 hover:bg-slate-100"><X /></button></div>
          <dl className="grid gap-5 sm:grid-cols-2">{[["Name", selected.name], ["Company", selected.address], ["Email", selected.email], ["Phone", selected.phone], ["Date & Time", dateText(selected.created_at)]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>
          <h3 className="mb-2 mt-6 font-semibold">Uploaded Files</h3>{fileLink(selected)}
          <h3 className="mb-2 mt-6 font-semibold">Message / Enquiry</h3><p className="whitespace-pre-wrap break-words rounded-xl bg-[#EEF6FD] p-4">{selected.message}</p>
        </>}
      </dialog>
      <dialog ref={deleteDialog} onCancel={event => { if (deleting !== null) event.preventDefault(); }} onClose={() => setPendingDelete(null)} aria-labelledby="delete-enquiry-heading" className="m-auto w-[calc(100%-32px)] max-w-md rounded-[20px] bg-white p-7 text-[#2A2E34] shadow-2xl backdrop:bg-black/50">
        <h2 id="delete-enquiry-heading" className="text-xl font-bold">Delete enquiry?</h2>
        <p className="mt-3 break-words text-slate-600">Delete the enquiry from {pendingDelete?.name}? This removes the saved enquiry and uploaded file. The email in your inbox will remain.</p>
        {deleteError && <p role="alert" className="mt-3 text-red-600">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button autoFocus disabled={deleting !== null} onClick={() => deleteDialog.current.close()} className={`${actionClass} bg-slate-100`}>Cancel</button>
          <button disabled={deleting !== null} onClick={() => remove(pendingDelete)} className={`${actionClass} bg-red-600 text-white`}><Trash2 size={16} />{deleting !== null ? "Deleting…" : "Delete"}</button>
        </div>
      </dialog>
      <dialog ref={fileDialog} onClose={() => setFilePreview(null)} aria-labelledby="file-preview-heading" className="m-auto max-h-[90vh] w-[calc(100%-32px)] max-w-4xl overflow-y-auto rounded-[20px] bg-white p-6 text-[#2A2E34] shadow-2xl backdrop:bg-black/50">
        {filePreview && <>
          <div className="mb-5 flex items-center justify-between gap-4"><h2 id="file-preview-heading" className="break-all text-xl font-bold">{filePreview.name}</h2><button autoFocus aria-label="Close file preview" onClick={() => fileDialog.current.close()} className="rounded-lg p-2 hover:bg-slate-100"><X /></button></div>
          {/\.docx$/i.test(filePreview.name) ? <DocxPreview key={filePreview.url} blob={filePreview.blob} name={filePreview.name} /> : filePreview.type.startsWith("image/") ? <img src={filePreview.url} alt={filePreview.name} className="mx-auto max-h-[60vh] object-contain" /> : ["application/pdf", "text/plain"].includes(filePreview.type) ? <iframe title={filePreview.name} src={filePreview.url} sandbox className="h-[60vh] w-full rounded-xl border" /> : <p className="rounded-xl bg-slate-50 p-5">Preview is unavailable for this file type. Download it to view.</p>}
          <div className="mt-5 flex justify-end"><a href={filePreview.url} download={filePreview.name} className={`${actionClass} bg-[#00B2F9] text-white`}><Download size={17} />Download</a></div>
        </>}
      </dialog>
    </section>
  );
}
