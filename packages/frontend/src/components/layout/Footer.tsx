export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-white font-semibold text-lg mb-2">Burguer House</p>
        <p className="text-sm">
          Seg - Dom: 18:00 - 23:00
        </p>
        <p className="text-sm mt-4">
          &copy; {new Date().getFullYear()} Burguer House. Projeto educacional.
        </p>
      </div>
    </footer>
  );
}
