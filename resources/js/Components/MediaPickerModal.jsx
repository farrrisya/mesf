import React, { useState, useEffect } from 'react';

// --1. main component--
export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  // --2. state--
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --3. fetch data--
  useEffect(() => { // trigger
    if (isOpen) {
      setLoading(true);
      fetch('/admin/api/media')
        .then(res => res.json())
        .then(data => {
          setMediaItems(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch media", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredMedia = mediaItems.filter(item => 
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --4. UI--
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded shadow-xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-lg font-extrabold text-slate-800">Pilih dari Media Library</h3>
          <button 
            onClick={onClose} // trigger
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-slate-50 flex-1 flex flex-col overflow-hidden">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari media..."
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // state
            />
          </div>
          
          {loading ? ( // check
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredMedia.length === 0 ? ( // check
            <div className="flex-1 flex justify-center items-center text-slate-400 font-medium">
              Tiada media dijumpai.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => { // trigger
                      onSelect(item);
                      onClose();
                    }}
                    className="group cursor-pointer bg-white rounded-md border border-slate-100 shadow-sm hover:border-amber-400 transition overflow-hidden flex flex-col"
                  >
                    <div className="aspect-square bg-slate-100 relative flex items-center justify-center overflow-hidden">
                      {item.file_type.includes('image') ? ( // check
                        <img src={`/storage/${item.file_path}`} alt={item.file_name} className="w-full h-full object-cover transition-transform duration-300" />
                      ) : (
                        <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-50 flex flex-col justify-between flex-1">
                      <p className="text-xs font-bold text-slate-700 truncate" title={item.file_name}>{item.file_name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">{item.file_type.split('/')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
