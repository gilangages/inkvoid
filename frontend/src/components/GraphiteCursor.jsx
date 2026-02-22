import React, { useEffect, useRef } from "react";

const GraphiteCursor = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const particles = useRef([]);
  const isHovering = useRef(false);
  const cursorSize = useRef(4); // Ukuran awal titik kursor

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Sesuaikan ukuran canvas dengan layar penuh
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Tangkap pergerakan mouse
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Spawn partikel debu setiap kali mouse bergerak (dengan peluang acak agar terlihat natural)
      if (Math.random() > 0.3) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1, // Melayang pelan ke kiri/kanan
          vy: (Math.random() - 0.5) * 1 - 0.5, // Melayang pelan ke atas (seperti asap/debu)
          life: 1, // Umur partikel memudar dari 1 ke 0
          size: Math.random() * 2 + 0.5, // Ukuran debu sangat kecil (0.5px - 2.5px)
        });
      }
    };

    // Deteksi apakah user sedang mengarahkan kursor ke area yang bisa di-klik
    const onMouseOver = (e) => {
      if (e.target.closest("button, a, input, textarea, [role='button']")) {
        isHovering.current = true;
      } else {
        isHovering.current = false;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    // Loop Animasi Canvas
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Gambar Partikel Debu (Graphite Dust)
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Warna debu ungu-keabu-abuan dari palet kamu (#8287ac)
        ctx.fillStyle = `rgba(130, 135, 172, ${p.life * 0.5})`;
        ctx.fill();

        // Update posisi & kurangi umur partikel
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025; // Kecepatan memudar
      }

      // Bersihkan memori dari partikel yang sudah hilang
      particles.current = particles.current.filter((p) => p.life > 0);

      // 2. Gambar Kursor Utama (Titik Graphite)
      // Pergerakan LERP (Linear Interpolation) agar membesar/mengecilnya smooth
      const targetSize = isHovering.current ? 18 : 4;
      cursorSize.current += (targetSize - cursorSize.current) * 0.2;

      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, cursorSize.current, 0, Math.PI * 2);

      if (isHovering.current) {
        // Saat hover tombol: Menjadi lingkaran outline yang besar
        ctx.strokeStyle = "rgba(130, 135, 172, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Saat normal: Menjadi titik solid gelap (#1F1F23) dengan sedikit outline
        ctx.fillStyle = "rgba(31, 31, 35, 1)";
        ctx.strokeStyle = "rgba(130, 135, 172, 0.5)";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup saat komponen dilepas
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // z-[9999] agar selalu paling atas.
      // pointer-events-none agar kita tetap bisa klik tombol di bawah canvas.
      // hidden md:block karena di HP (touchscreen) kita tidak butuh kursor.
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] hidden md:block"
    />
  );
};

export default GraphiteCursor;
