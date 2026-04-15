import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState("all"); // 🔥 NEW

  const fetchDocs = async () => {
    try {
      const res = await axios.get("https://document-processing-production-6311.up.railway.app/documents");
      setDocs(res.data);
    } catch (err) {
      console.log("Backend error", err);
    }
  };

  useEffect(() => {
    fetchDocs();
    const interval = setInterval(fetchDocs, 2000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 FILTER LOGIC
  const filteredDocs =
    filter === "all"
      ? docs
      : docs.filter((doc) => doc.status === filter);

  // DELETE
  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    await axios.delete(`https://document-processing-production-6311.up.railway.app/delete/${id}`);
    fetchDocs();
  };

  // RETRY
  const retryJob = async (id) => {
    await axios.post(`https://document-processing-production-6311.up.railway.app/retry/${id}`);
    alert("Retry started 🔁");
  };

  // EDIT CHANGE
  const handleChange = (id, value) => {
    setEditData({ ...editData, [id]: value });
  };

  // SAVE
  const saveEdit = async (id) => {
    await axios.put(`https://document-processing-production-6311.up.railway.app/update/${id}`, {
      text: editData[id],
    });
    alert("Saved ✅");
    fetchDocs();
  };

  // FINALIZE
  const finalizeDoc = async (id) => {
    await axios.put(`https://document-processing-production-6311.up.railway.app/finalize/${id}`);
    alert("Finalized 🚀");
    fetchDocs();
  };

  return (
    <div className="mt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Documents</h2>
        </div>

        <div className="flex gap-3 items-center">

          {/* 🔥 FILTER DROPDOWN */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20"
          >
            <option value="all">All</option>
            <option value="queued">Queued</option>
            <option value="parsing">Parsing</option>
            <option value="extracting">Extracting</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="finalized">Finalized</option>
          </select>

          <div className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
            <span className="text-xl font-bold text-white">{filteredDocs.length}</span>
            <span className="text-gray-300 ml-2">Total</span>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">

            <div className="relative p-6">

              <h3 className="font-semibold text-white text-lg mb-2">{doc.filename}</h3>

              {/* 🔥 MULTI STEP STATUS */}
              <div className="mb-3 text-sm text-gray-300">
                {doc.status === "parsing" && "📄 Parsing..."}
                {doc.status === "extracting" && "🔍 Extracting..."}
                {doc.status === "processing" && "⚙️ Processing..."}
                {doc.status === "completed" && "✅ Completed"}
                {doc.status === "finalized" && "🎯 Finalized"}
                {doc.status === "queued" && "⏳ Queued"}
              </div>

              {/* EXPORT */}
              {doc.status === "completed" && (
                <div className="flex gap-2 mb-3">
                  <a href={`http://127.0.0.1:8000/export/json/${doc.id}`} className="bg-blue-500 px-3 py-1 rounded text-white">JSON</a>
                  <a href={`http://127.0.0.1:8000/export/csv/${doc.id}`} className="bg-green-500 px-3 py-1 rounded text-white">CSV</a>
                </div>
              )}

              {/* EDIT */}
              {doc.status === "completed" && (
                <>
                  <textarea
                    value={editData[doc.id] || ""}
                    onChange={(e) => handleChange(doc.id, e.target.value)}
                    className="w-full p-2 text-black rounded mb-2"
                  />
                  <button onClick={() => saveEdit(doc.id)} className="bg-purple-500 px-2 py-1 rounded text-white mr-2">Save</button>
                  <button onClick={() => finalizeDoc(doc.id)} className="bg-yellow-500 px-2 py-1 rounded text-white">Finalize</button>
                </>
              )}

              <div className="flex gap-2 mt-3">
                <button onClick={() => retryJob(doc.id)} className="bg-orange-500 px-2 py-1 rounded text-white">Retry</button>
                <button onClick={() => deleteDoc(doc.id)} className="bg-red-500 px-2 py-1 rounded text-white">Delete</button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filteredDocs.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No documents found 🚀
        </p>
      )}
    </div>
  );
}

export default Dashboard;