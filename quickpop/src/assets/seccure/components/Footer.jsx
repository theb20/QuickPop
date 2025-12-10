import React from 'react';
import { MapPin, TabletSmartphone, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, MonitorSmartphone } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function RestaurantFooter() {
  const location = useLocation();

  const IsPlay = location.pathname === '/app/play';

  return (
    <div className="">
      {!IsPlay && (
      <footer className="bg-white text-gray-900">
        {/* Newsletter Section */}
        <div className="bg-[url('/imgs/wall-minion.jpg')] bg-cover bg-center">
          <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="text-3xl font-black mb-4">
                Quick<span className="text-red-600">Pop</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                QuickPop te propose des vidéos de formation claires et pratiques pour maîtriser toutes les procédures Quick.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/Quick/?locale=fr_FR" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition text-gray-600">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/quick.france/" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition text-gray-600">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://x.com/QuickFrance_?lang=fr" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition text-gray-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@quick" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition text-gray-600">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-gray-900">Liens rapides</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-red-600 transition">Catalogue</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-600 transition">Mon compte</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-600 transition">Hors connexion</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-gray-900">Aide & Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-red-600 transition">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-600 transition">Conditions générales</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-600 transition">Politique de confidentialité</a></li>
              </ul>
            </div>

            {/* Supported Devices */}
          <div className=" mb-8">
            <h4 className="text-lg font-bold mb-6 text-gray-900">Appareils compatibles</h4>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-semibold text-gray-700 border border-gray-200">
                <MonitorSmartphone />
                Ordinateur
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-semibold text-gray-700 border border-gray-200">
                <TabletSmartphone />
                Téléphone mobile
              </div>
            </div>
          </div>
            
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2025 QuickPop. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-red-600 transition">Mentions légales</a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}