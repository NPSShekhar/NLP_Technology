import { useEffect, useRef, useState } from "react";
import { Eye, Trash2, RefreshCw, X, Mail } from "lucide-react";

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
    if (deleting !== null || !window.confirm(`Delete the enquiry from ${enquiry.name}? This removes the saved enquiry, not the email in your inbox.`)) return;
    setDeleting(enquiry.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${endpoint}/${enquiry.id}`, { method: "DELETE", headers: { Authorization: authorization } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete enquiry.");
      setEnquiries(items => items.filter(item => item.id !== enquiry.id));
      setNotice("Enquiry deleted successfully.");
    } catch (failure) {
      setError(failure.message);
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
          <h2 id="enquiries-heading" className="text-2xl font-bold">Enquiries</h2>
          <p className="mt-1 text-sm text-slate-500">Website enquiries sent to your admin email, newest first.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#2A2E34] px-4 py-2 text-sm font-semibold text-white">{enquiries.length} {enquiries.length === 1 ? "Enquiry" : "Enquiries"}</span>
          <button className={`${actionClass} bg-[#EEF6FD] text-[#007fb2]`} disabled={loading || deleting !== null} onClick={() => setRevision(value => value + 1)}><RefreshCw size={17} />Refresh</button>
        </div>
      </div>
      <label className="mb-5 block max-w-lg text-sm font-semibold">Search enquiries
        <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Name, email, company or message" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-[#00B2F9] focus:ring-2 focus:ring-sky-100" />
      </label>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-green-50 p-4 text-green-700">{notice}</p>}
      <div className="overflow-hidden rounded-[20px] bg-[#EEF6FD] p-4 shadow-sm md:p-6" aria-busy={loading}>
        {loading ? <p role="status" className="py-12 text-center">Loading enquiries…</p> : !filtered.length ? (
          <div className="py-12 text-center text-slate-500"><Mail className="mx-auto mb-3" /><p>{query ? "No enquiries match your search." : error ? "Enquiries could not be loaded. Please try Refresh." : "No enquiries yet."}</p></div>
        ) : <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead><tr className="border-b border-sky-100 text-slate-500">{["Received", "Name / Company", "Contact", "Email status", "Actions"].map(title => <th key={title} scope="col" className="px-3 py-3 font-semibold">{title}</th>)}</tr></thead>
              <tbody>{visible.map(item => <tr key={item.id} className="border-b border-sky-100 last:border-0">
                <td className="px-3 py-5 whitespace-nowrap">{dateText(item.created_at)}</td>
                <td className="max-w-[240px] break-words px-3 py-5"><p className="font-semibold">{item.name}</p><p className="mt-1 text-slate-500">{item.address}</p></td>
                <td className="max-w-[280px] break-words px-3 py-5"><p>{item.email}</p><p className="mt-1 text-slate-500">{item.phone}</p></td>
                <td className="px-3 py-5"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${item.email_sent ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{item.email_sent ? "Sent to admin" : "Not sent"}</span></td>
                <td className="px-3 py-5"><div className="flex gap-2">
                  <button aria-label={`View enquiry from ${item.name}`} className={`${actionClass} bg-white text-[#008fce]`} onClick={() => setSelected(item)}><Eye size={16} />View</button>
                  <button aria-label={`Delete enquiry from ${item.name}`} className={`${actionClass} bg-red-50 text-red-600`} disabled={deleting !== null} onClick={() => remove(item)}><Trash2 size={16} />{deleting === item.id ? "Deleting…" : "Delete"}</button>
                </div></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p>{filtered.length} {filtered.length === 1 ? "result" : "results"} · Page {currentPage} of {pages}</p>
            <div className="flex gap-2"><button className={`${actionClass} bg-white`} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><button className={`${actionClass} bg-white`} disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>
          </div>
        </>}
      </div>
      <dialog ref={dialog} onClose={() => setSelected(null)} aria-labelledby="enquiry-detail-heading" className="m-auto max-h-[85vh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-[20px] bg-white p-6 text-[#2A2E34] shadow-2xl backdrop:bg-black/50 md:p-8">
        {selected && <>
          <div className="mb-6 flex items-center justify-between gap-4"><h2 id="enquiry-detail-heading" className="text-2xl font-bold">Enquiry details</h2><button autoFocus onClick={() => dialog.current.close()} aria-label="Close enquiry details" className="rounded-lg p-2 hover:bg-slate-100"><X /></button></div>
          <dl className="grid gap-5 sm:grid-cols-2">{[["Name", selected.name], ["Company", selected.address], ["Email", selected.email], ["Phone", selected.phone], ["Received", dateText(selected.created_at)], ["Admin email", selected.email_sent ? `Sent ${dateText(selected.email_sent_at)}` : "Not sent"]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>
          <h3 className="mb-2 mt-6 font-semibold">Message / Enquiry</h3><p className="whitespace-pre-wrap break-words rounded-xl bg-[#EEF6FD] p-4">{selected.message}</p>
        </>}
      </dialog>
    </section>
  );
}
