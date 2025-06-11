import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-emerald-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau tidak tersedia.
          </p>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link 
            href="/"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link 
            href="/#destinations"
            className="inline-block border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
          >
            Jelajahi Destinasi
          </Link>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 text-sm">
            Atau hubungi kami jika Anda memerlukan bantuan:
          </p>
          <p className="text-emerald-600 font-semibold">
            info@explorekaltara.com
          </p>
        </div>
      </div>
    </div>
  );
}
