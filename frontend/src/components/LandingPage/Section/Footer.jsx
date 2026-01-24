export const Footer = () => {
  return (
    <footer className="bg-[#EAE7DF] border-t-2 border-[#E5E0D8] py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-black text-xl text-[#3E362E]">LumaSticker.</h3>
          <p className="text-[#6B5E51] text-sm mt-1">Stiker lucu-lucuan buat jurnal kamu.</p>
        </div>

        <div className="text-[#6B5E51] text-xs">&copy; {new Date().getFullYear()} Dibuat dengan ☕ & 🎨</div>
      </div>
    </footer>
  );
};
