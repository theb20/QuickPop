import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Check, ArrowRight, Cpu, Zap } from 'lucide-react';

export default function CertificationSuccess({ title, onClose, onGoToProfile }) {
  const [step, setStep] = useState('analyzing');

  useEffect(() => {
    const timer1 = setTimeout(() => setStep('verified'), 2000);
    const timer2 = setTimeout(() => setStep('revealed'), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-20 blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            className="flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative w-32 h-32 mb-8">
              <motion.div
                className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-red-500 border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 border-4 border-t-transparent border-r-amber-500 border-b-transparent border-l-amber-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-mono text-red-500 font-bold mb-2">
              ANALYSE EN COURS...
            </motion.h2>
            <motion.p className="text-gray-400 font-mono text-sm" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
              Vérification de la complétion du module
            </motion.p>
          </motion.div>
        )}

        {step === 'verified' && (
          <motion.div
            key="verified"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)] mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1, type: 'spring' }}
            >
              <Check className="w-12 h-12 text-black stroke-[3]" />
            </motion.div>
            <h2 className="text-3xl font-black text-white tracking-wider">SUCCÈS</h2>
          </motion.div>
        )}

        {step === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="relative w-full max-w-2xl mx-auto p-6 flex flex-col items-center"
          >
            {/* Holographic Card */}
            <div className="relative group cursor-default">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-tilt"></div>
              <div className="relative px-8 py-10 bg-black ring-1 ring-gray-900/5 rounded-2xl flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 1.5 }}
                  className="mb-6 relative"
                >
                  <div className="absolute inset-0 bg-amber-500 blur-[60px] opacity-40 animate-pulse"></div>
                  <Award className="w-24 h-24 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute -inset-4 border border-dashed border-amber-500/30 rounded-full" />
                </motion.div>

                <div className="text-center">
                  <h3 className="text-amber-500 font-bold tracking-widest text-sm mb-2 uppercase">Certification Officielle</h3>
                  <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">{title}</h1>
                  <p className="text-gray-400 max-w-md mx-auto mb-8">
                    Vous avez démontré une maîtrise exceptionnelle de ce module. Cette certification a été ajoutée à votre profil professionnel.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button onClick={onGoToProfile} className="flex-1 flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all transform hover:scale-105">
                    <Zap size={20} />
                    Voir mes badges
                  </button>
                  <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                    Continuer
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
