import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/hooks/auth.js";

export default function Wait() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  return (
    <div className="relative flex flex-col items-start justify-center min-h-screen w-full bg-[url('/imgs/wall_cat.jpg')] bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-black/60 overflow-hidden px-6 md:px-20">

      {/* Logo */}
      <div className="relative z-10 w-20 md:w-28 mb-12 animate-fade-in">
        <img src="/imgs/logo.png" alt="logo" className="w-full h-auto drop-shadow-lg" />
      </div>

      {/* Text + Loader */}
      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-text-reveal">
          Un responsable prendra en charge votre demande.
        </h1>
        
        <div className="mt-6 md:mt-8 space-y-6 animate-text-reveal" style={{ animationDelay: '120ms' }}>
          <p className="text-gray-200 text-lg md:text-2xl font-normal leading-relaxed">
            Une fois votre demande traitée, vous recevrez une notification par e-mail.
          </p>
          
          <button
            onClick={async () => { 
              try {
                await signOut(); 
              } catch (error) {
                console.error("Sign out failed", error);
              } finally {
                navigate('/login'); 
              }
            }}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-medium text-base md:text-lg transition-colors cursor-pointer group"
          >
            <span>Se connecter avec un autre compte</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Loader */}
        <div className="mt-10 md:mt-12">
          <div className="h-10 w-10 md:h-12 md:w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
