import { useEffect, useState } from "react";

export default function Login() {
  useEffect(() => {
    document.title = "Connexion - QuickPop";
  }, []);

  const [error, setError] = useState("");

  return (
    <div className="min-h-screen w-screen flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <video
          src="/videos/quick.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover absolute "
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        </div>
      </div>

      <div className="flex-1 flex items-center relative justify-center p-8 lg:p-12">
        <div className="lg:flex hidden img-logo absolute top-12 left-0 w-[130px] h-[130px]">
          <img src="/imgs/logo.png" alt="" />
        </div>
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4 overflow-hidden">
              <img src="/imgs/logo-mb.png" className="w-full h-full object-cover" alt="logo mobile" />
            </div>
          </div>

          <div className="mb-8 text-center text-gray-900 ">
            <h1 className="text-4xl font-semibold mb-2">Bienvenue</h1>
            <p className="text-gray-400">Connectez-vous / inscrivez-vous pour continuer</p>
          </div>

          <div className="flex flex-col gap-4 items-center justify-center w-full">
            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#d80022] px-4 py-2 text-white hover:bg-[#6d0111] focus:outline-none focus:ring-2 focus:ring-[#d80022]"
              onClick={() => setError("Connexion Google non configurée")}
            >
              Continuer avec Google
            </button>

            {error && <div className="text-red-500 bottom-0 text-center text-sm">{error}</div>}
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            En continuant, vous acceptez nos
            {" "}
            <a href="/privacy#section-11" className="underline hover:text-gray-300">Conditions d'utilisation</a>
            {" "}et notre{" "}
            <a href="/privacy#section-12" className="underline hover:text-gray-300">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </div>
  );
}
