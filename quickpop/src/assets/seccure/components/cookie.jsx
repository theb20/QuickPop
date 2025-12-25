import { Shield, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getConsent() {
  try {
    if (typeof window === 'undefined') return false
    const ls = localStorage.getItem('qp:cookie-consent')
    if (ls) {
      const parsed = JSON.parse(ls)
      return !!parsed?.value
    }
    return document.cookie.includes('qp_consent=1')
  } catch {
    return false
  }
}

function setConsent() {
  try {
    localStorage.setItem('qp:cookie-consent', JSON.stringify({ value: true, ts: Date.now() }))
    document.cookie = 'qp_consent=1; max-age=31536000; path=/; SameSite=Lax'
  } catch {}
}

export default function Cookie() {
  const [isVisible, setIsVisible] = useState(() => !getConsent())
  const navigate = useNavigate()
  
  useEffect(() => {
    // Double-check on mount in case of SSR hydration or storage change
    if (getConsent()) setIsVisible(false)
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-4 sm:p-6 z-50">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl w-full max-w-5xl animate-slide-up rounded-none sm:rounded-lg" role="dialog" aria-modal="true" aria-labelledby="cookie-policy-title">
        
        {/* MAIN CONTENT */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8 p-6 sm:p-8">
          
          {/* ICON + TEXT */}
          <div className="flex gap-4 sm:gap-6 flex-1 items-start w-full">
            
            {/* ICON */}
            <div className="mt-1 hidden xs:block">
              <div className="bg-zinc-800 p-3 rounded-sm">
                <Shield className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
              </div>
            </div>

            {/* TEXT */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 id="cookie-policy-title" className="text-white font-semibold text-base sm:text-lg mb-2 tracking-tight">
                  Politique de confidentialité
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Nous utilisons des cookies essentiels pour garantir le bon fonctionnement de notre plateforme,
                  analyser le trafic et personnaliser votre expérience. Vos données sont traitées conformément
                  au RGPD et ne sont jamais vendues à des tiers.
                </p>
              </div>
              
              {/* LINKS */}
              <div className="flex flex-wrap gap-3 text-xs">
                <button onClick={() => navigate('/terms')} className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4">
                  Termes et conditions
                </button>


              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-3">
            <button 
              onClick={() => { setConsent(); setIsVisible(false) }}
              className="bg-white text-zinc-900 w-full sm:w-auto px-6 sm:px-8 py-3 text-sm font-medium hover:bg-zinc-100 transition-all duration-150 relative overflow-hidden group rounded-sm sm:rounded-md"
            >
              <span className="relative z-10">Accepter</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-zinc-300 hover:text-white px-4 py-3 text-sm font-medium transition-all duration-150 rounded-sm sm:rounded-md border border-zinc-700"
            >
              Refuser
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* FOOTER */}
        <div className="px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] sm:text-xs text-zinc-600">
          
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <span>© 2025 QuickPop</span>
            <span className="hidden sm:inline w-1 h-1 bg-zinc-700 rounded-full" />
            <span className="hidden sm:inline">Tous droits réservés</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-700">Conforme</span>
            <span className="bg-zinc-800 px-2 py-0.5 rounded-sm text-zinc-500 font-mono">RGPD</span>
          </div>
        </div>
      </div>

      
    </div>
  )
}
