// --1. imports--
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import 'react-quill/dist/quill.snow.css';

// --2. main component--
export default function JadualBayaranBalik({ auth, documents = [] }) {
  const product = documents.length > 0 ? documents[0] : null;
  const isImage = (path) => path && (path.toLowerCase().endsWith('.jpg') || path.toLowerCase().endsWith('.jpeg') || path.toLowerCase().endsWith('.png') || path.toLowerCase().endsWith('.gif') || path.toLowerCase().endsWith('.webp'));

  const getValidUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const formatDescription = (html) => {
    if (!html) return '';
    let formatted = html.replace(/href="([^"]+)"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('/') || url.startsWith('#')) return match;
      return `href="https://${url}"`;
    });
    return formatted.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  };

  // --5. UI--
  return (
    <PublicLayout auth={auth}>
      <Head title="Jadual Bayaran Balik - MESF" />
      <div className="max-w-[1350px] mx-auto px-4 md:px-8 py-8 md:py-10 text-left border-b border-slate-300">
        <h1 className="text-3xl md:text-4xl font-black mt-2 text-slate-900 leading-tight">
          Jadual Bayaran Balik <span className="text-slate-900">Pembiayaan</span>
        </h1>
      </div>
      <main className="max-w-[1350px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="mb-8">
          <button
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0a192f] hover:text-amber-500 transition shrink-0"
          >
            <svg className="w-4 h-4 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Laman Utama
          </button>
        </div>

        {product ? (
          <div className="bg-white rounded-md shadow-sm border border-slate-200 p-8 md:p-12 flex flex-col gap-8">
            {product?.title && (
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
                {product.title}
              </h2>
            )}
            {product?.file_path && isImage(product.file_path) && (
              <div className="mx-auto max-w-md overflow-hidden rounded border border-slate-100 shadow-sm flex justify-center">
                <img src={`/storage/${product.file_path}`} alt={product.title} className="w-full h-auto object-contain" />
              </div>
            )}

            {product?.description && (
              <div className="ql-snow">
                  <div 
                    className="ql-editor !p-0 text-slate-700 font-medium 
                                [&_h2]:font-black [&_h2]:text-[#0a192f] [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                                [&_h3]:font-bold [&_h3]:text-[#0a192f] [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                                [&_a]:text-blue-600 hover:[&_a]:text-blue-800 [&_a]:underline
                                [&_img]:rounded-xl [&_img]:shadow-md"
                    dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }}
                  />
              </div>
            )}

            {(product?.url_link || (product?.file_path && !isImage(product.file_path))) && (
              <div className="mt-4 max-w-sm">
                <a
                  href={product.url_link ? getValidUrl(product.url_link) : `/storage/${product.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11.5px] text-[#0a192f] mt-1.5 font-semibold leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-between group/brochure"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {product.url_link ? 'Buka Pautan' : 'Muat Turun'}
                  </span>
                  <svg className="w-4 h-4 opacity-50 group-hover/brochure:opacity-100 group-hover/brochure:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-medium text-sm">
            Tiada maklumat ditemui.
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
