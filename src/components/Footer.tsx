export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-rose-500 to-orange-400 to-blue-500 text-white py-4 ">
      <div className="max-w-6xl mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} OQU.EDU. Барлық құқықтар қорғалған.</p>
        <p className="mt-1">📞 Байланыс: oqu.edu@gmail.com</p>
      </div>
    </footer>
  );
}
