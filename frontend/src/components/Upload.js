import axios from "axios";
import { useState } from "react";

function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("https://document-processing-production-6311.up.railway.app/upload", formData);
      alert("Uploaded Successfully! 🚀");
      setSelectedFile(null);
      e.target.value = "";
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };


  

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = { target: { files: [file], value: "" } };
      handleUpload(syntheticEvent);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Upload Document</h2>
            <p className="text-gray-400">Drag & drop your file or click to browse</p>
          </div>

          {/* Drag & Drop Area */}
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative block w-full p-10 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
              ${isDragging 
                ? "border-blue-400 bg-blue-500/20 scale-[1.02]" 
                : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
              }
              ${isUploading ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input
              type="file"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <div className="text-center">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-blue-500/20 rounded-full">
                    <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">Uploading...</p>
                    <p className="text-gray-400 text-sm mt-1">{selectedFile?.name}</p>
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-green-500/20 rounded-full">
                    <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">File Selected</p>
                    <p className="text-gray-400 text-sm mt-1 break-all">{selectedFile.name}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-white/10 rounded-full">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {isDragging ? "Drop your file here" : "Choose a file"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">or drag and drop</p>
                  </div>
                </div>
              )}
            </div>
          </label>

          {/* Supported Formats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/20">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-300 text-sm">PDF</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/20">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300 text-sm">Images</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/20">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-gray-300 text-sm">Documents</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white/5 border-t border-white/10">
          <p className="text-gray-400 text-sm text-center">
            Maximum file size: 50MB • Secure upload • All formats supported
          </p>
        </div>
      </div>
    </div>
  );
}

export default Upload;