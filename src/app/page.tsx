export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded shadow p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">IMS for IT</h1>
        <p className="mb-6 text-gray-700">
          BT departmanları için modern, güvenli ve kapsamlı bir envanter yönetim
          sistemi.
        </p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          Giriş Yap
        </a>
      </div>
    </main>
  );
}
