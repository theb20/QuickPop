import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Accueil', path: '/app' },
    { label: 'Aide', path: '/app/help' },
    { label: 'Mon Compte', path: '/app/account' },
  ];

  return (
    <nav className="flex rounded-b-xl items-center gap-12 px-10 py-5 bg-white border-b border-gray-100">
      {links.map((link) => {
        const active = location.pathname === link.path;

        return (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="relative group text-sm font-semibold tracking-wide"
          >
            {/* Texte */}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                active
                  ? 'text-red-600'
                  : 'text-gray-800 group-hover:text-red-500'
              }`}
            >
              {link.label}
            </span>

            {/* Seal anime */}
            {active && (
              <motion.span
                initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="absolute -inset-x-4 -inset-y-2 rounded-md bg-red-600/10 border border-red-500/30"
              />
            )}

            {/* Hover accent */}
            <span className="absolute -bottom-3 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-red-500/70 rounded-full transition-all duration-300 group-hover:w-full" />
          </button>
        );
      })}
    </nav>
  );
}
