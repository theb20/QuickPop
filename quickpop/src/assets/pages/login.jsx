import { useEffect, useState } from "react";
import { Mails, BriefcaseBusiness, RectangleEllipsis, User } from "lucide-react";

export default function Login() {
  useEffect(() => {
    document.title = "Connexion - QuickPop";
  }, []);

  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen w-screen flex">
      {/* SECTION VIDÉO */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <video
          src="/videos/quick.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover absolute"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full"></div>
      </div>

      {/* SECTION FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 lg:p-8">

          {/* LOGO MOBILE */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4 overflow-hidden">
              <img src="/imgs/logo-mb.png" alt="logo mobile" className="w-full h-full object-cover" />
            </div>
          </div>

          {mode === "login" ? (
            /* ------------------- FORM: LOGIN ------------------- */
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Formulaire de connexion"
            >
              <div className="mb-2 text-center text-gray-900">
                <h1 className="text-3xl font-semibold mb-1">Connexion</h1>
                <p className="text-gray-500">Entrez vos identifiants pour continuer</p>
              </div>

              <div className="relative">
                <input
                  id="login-code"
                  name="code"
                  type="number"
                  placeholder="Code de fonction"
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                />
                <BriefcaseBusiness size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                />
                <RectangleEllipsis size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#d80022] px-4 py-2 text-white hover:bg-[#6d0111] focus:outline-none focus:ring-2 focus:ring-[#d80022]"
              >
                Se connecter
              </button>

              {error && <div role="alert" className="text-red-500 text-center text-sm">{error}</div>}

              <div className="text-center text-sm text-gray-500">
                Pas de compte ? {" "}
                <button type="button" className="underline hover:text-gray-700" onClick={() => setMode("signup")}>
                  Inscrivez-vous
                </button>
              </div>
            </form>
          ) : (
            /* ------------------- FORM: SIGNUP ------------------- */
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Formulaire d'inscription"
            >
              <div className="mb-2 text-center text-gray-900">
                <h1 className="text-3xl font-semibold mb-1">Inscription</h1>
                <p className="text-gray-500">Créez votre compte pour commencer</p>
              </div>

              <div className="relative">
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Entrez votre adresse e-mail"
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                />
                <Mails size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  autoComplete="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                />
                <User size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  id="signup-code"
                  name="code"
                  type="number"
                  placeholder="Entrez votre code de fonction"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                />
                <BriefcaseBusiness size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Créez un mot de passe"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                />
                <RectangleEllipsis size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#d80022] px-4 py-2 text-white hover:bg-[#6d0111] focus:outline-none focus:ring-2 focus:ring-[#d80022]"
              >
                Créer un compte
              </button>

              {error && <div role="alert" className="text-red-500 text-center text-sm">{error}</div>}

              <div className="text-center text-sm text-gray-500">
                Déjà un compte ? {" "}
                <button type="button" className="underline hover:text-gray-700" onClick={() => setMode("login")}>
                  Connectez-vous
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-gray-400">
            En continuant, vous acceptez nos{" "}
            <a href="/privacy#section-11" className="underline hover:text-gray-300">Conditions d'utilisation</a>{" "}
            et notre{" "}
            <a href="/privacy#section-12" className="underline hover:text-gray-300">Politique de confidentialité</a>
          </div>

        </div>
      </div>
    </div>
  );
}
