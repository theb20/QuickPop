import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/hooks/auth.js";

export default function Wait() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  return (
    <div className="relative flex items-center justify-center bg-[url('/imgs/wall_cat.jpg')] bg-cover h-[100vh] before:content-[''] before:absolute before:inset-0 before:bg-black/50 overflow-hidden">

      {/* Logo */}
      <div className="logo absolute top-20 left-0 ms-20 w-[100px] z-10 animate-fade-in">
        <img src="/imgs/logo.png" alt="logo" className="w-full h-full inline-block" />
      </div>

      {/* Text + Loader */}
      <div className="absolute left-0 ms-20 mt-20 z-10 w-[600px] animate-slide-up">
        <h1 className="text-white text-5xl font-bold animate-text-reveal">
          Un responsable prendra en charge votre demande.
        </h1>
        <p className="text-white text-2xl font-normal mt-5 animate-text-reveal" style={{ animationDelay: '120ms' }}>
          Une fois votre demande traitée, vous recevrez une notification par e-mail. {''}
           <a
             onClick={async () => { await signOut(); navigate('/login'); }}
             className="text-red-600 p-0 cursor-pointer"
           >
             Retourner à la page de connexion
           </a>
        </p>

        {/* Loader */}
        <div className="mt-10 h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
