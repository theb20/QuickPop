import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavBar() {
  const location = useLocation();

  const links = [
    { label: 'Accueil', path: '/app' },
    { label: 'Aide', path: '/app/help' },
    { label: 'Mon Compte', path: '/app/account' },
  ];

  return (
    <nav className="p-1 bg-white/90 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl shadow-black/5 ring-1 ring-black/5">
      <ul className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative block px-4 py-2 md:px-6 md:py-2.5 text-sm font-bold tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-100/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
