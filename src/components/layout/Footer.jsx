import React from "react";
import { Phone, Mail } from "lucide-react";

const socials = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@fiberstech",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a3.005 3.005 0 00-2.116-2.127C19.44 3.5 12 3.5 12 3.5s-7.44 0-9.382.559A3.005 3.005 0 00.502 6.186C0 8.14 0 12 0 12s0 3.86.502 5.814a3.005 3.005 0 002.116 2.127C4.56 20.5 12 20.5 12 20.5s7.44 0 9.382-.559a3.005 3.005 0 002.116-2.127C24 15.86 24 12 24 12s0-3.86-.502-5.814zM9.75 15.569V8.431L15.818 12 9.75 15.569z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/fiberstech",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22 12a10 10 0 10-11.5 9.95v-7.04H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.29.2 2.29.2v2.51h-1.29c-1.27 0-1.66.79-1.66 1.6V12h2.83l-.45 2.91h-2.38v7.04A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/fiberstech",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.15V23h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.75 1.86-2.75 3.78V23h-4V8z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/fiberstech",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2H21.5l-7.5 8.568L23.5 22h-7.356l-5.754-7.206L3.5 22H.244l8.214-9.393L.5 2h7.38l5.19 6.69L18.244 2zm-1.29 18h2.02L7.12 4H5.02l11.934 16z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/fiberstech",
    svg: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM18 6.5a1 1 0 110 2 1 1 0 010-2z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const variant = "dark"; // change to "red" to try red background
  const bgClass = variant === "red" ? "bg-red-700/60" : "bg-black/70";

  return (
    <footer
      className={`${bgClass} text-neutral-200 mt-4 relative overflow-hidden w-full`}
    >
      {/* Top row: 2 columns */}
      <div className="container-app pt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6">
          {/* 1) Arriba Izquierda: Brand */}
          <div className="md:pr-8">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-auto object-contain rounded-sm"
                src="/assets/images/logo/logo_NFT-300x269.png"
                alt="NFT logo"
              />
              <div>
                <p className="text-sm uppercase tracking-widest text-red-400">
                  NATURAL FIBERB'S TECH
                </p>
                <p className="text-xs text-neutral-300">
                  Centro de I+D en tecnología textil
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-300 max-w-xl">
              Diseñamos y desarrollamos tecnología para análisis de fibras,
              integrando ciencia, ingeniería y experiencia de campo.
            </p>
          </div>

          {/* 2) Arriba Derecha: Contacto */}
          <div className="md:pl-8 mt-8 md:mt-0">
            <h3 className="text-sm font-semibold text-white mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a
                  href="mailto:edgarquispe62@gmail.com"
                  className="hover:text-white flex items-center hover:underline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  edgarquispe62@gmail.com
                </a>
              </li>
              <li className="lg:whitespace-nowrap ">
                <a
                  href="https://wa.me/51988496839"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:underline flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +51 988 496 839
                </a>
              </li>
              <li className="lg:whitespace-nowrap">
                <span>Lima, Perú • Atención internacional</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Middle row: Social icons centered */}
      <div className="container-app p-6">
        <div className="flex justify-center gap-4 sm:gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.name}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white backdrop-blur-sm shadow-sm hover:shadow transition outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 border-0"
            >
              {s.svg}
            </a>
          ))}
        </div>
      </div>

      {/* Divider between rows */}
      <div className="h-px bg-neutral-700/60" />

      {/* Bottom row: compact bar COPYRIGHT */}
      <div className="container-app py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-300">
            © 2025 Fiberstech — Diseñado por Christian QB (XtianDev)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
