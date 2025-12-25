import { useEffect, useState } from "react";
import { Mails, BriefcaseBusiness, RectangleEllipsis, User } from "lucide-react";
import { useAuth } from "../config/hooks/auth.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    document.title = "Connexion - QuickPop";
  }, []);

  const navigate = useNavigate();
  const { signIn, signUp, loading, user } = useAuth();

  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");
  const [loginCode, setLoginCode] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [lastCode, setLastCode] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    if (!user) return;
    const active = user.is_active === true || user.is_active === 1;
    navigate(active ? "/app" : "/wait");
  }, [user, navigate]);

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
      <div className="relative flex-1 flex overflow-hidden items-center justify-center p-8 lg:p-12">
        <div className="w-full  max-w-md bg-white rounded-2xl p-6 lg:p-8">

          {/* LOGO MOBILE */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4 overflow-hidden">
              <img src="/imgs/logo-mb.png" alt="logo mobile" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="lg:block hidden absolute top-6 -left-3 inline-flex items-center justify-center w-[100px] h-[153px] p-2 rounded-lg mb-4 overflow-hidden z-10">
              <img src="/imgs/logo.png" alt="logo" className="w-full h-full object-cover" />
            </div>  

          {mode === "login" ? (
            /* ------------------- FORM: LOGIN ------------------- */
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setInvalidPassword(false);
                setLastCode(loginCode);
                if (!loginCode || !loginPassword) {
                  setError("Code et mot de passe requis");
                  return;
                }
                try {
                  await signIn({ code: Number(loginCode), password: loginPassword });
                } catch (err) {
                  if (err?.error === "Compte inactif") {
                    navigate("/wait");
                    return;
                  }
                  const msg = err?.error || "Échec de connexion";
                  setError(msg);
                  setInvalidPassword(msg === "Mot de passe invalide");
                }
              }}
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
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
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
                  className={`w-full px-4 py-2 border ${invalidPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#d80022]`}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <RectangleEllipsis size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              {/* LIEN MOT DE PASSE OUBLIÉ */}
              

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#d80022] px-4 py-2 text-white hover:bg-[#6d0111] focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                disabled={loading}
              >
                Se connecter
              </button>
             

              {error && (
                <div role="alert" className="text-red-600 text-center text-sm">
                  {error}{lastCode ? ` · Code saisi: ${lastCode}` : ""}
                </div>
              )}

              <div className="text-center text-sm text-gray-500">
                <span>Vous n’avez pas encore de compte ? </span>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-medium underline underline-offset-2 transition hover:text-red-700"
                >
                  Créez-en un
                </button>
                <span className="mx-1">·</span>
                <a
                  href="/reset"
                  className="font-medium underline underline-offset-2 transition hover:text-red-700"
                >
                  Mot de passe oublié
                </a>
              </div>

            </form>
          ) : (
            /* ------------------- FORM: SIGNUP ------------------- */
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                if (!signupEmail || !signupName || !signupCode || !signupPassword) {
                  setError("Email, nom, code et mot de passe requis");
                  return;
                }
                try {
                  await signUp({
                    email: signupEmail,
                    fullname: signupName,
                    code: Number(signupCode),
                    password: signupPassword,
                  });
                  navigate("/wait");
                } catch (err) {
                  setError(err?.error || "Échec d'inscription");
                }
              }}
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
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
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
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
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
                  value={signupCode}
                  onChange={(e) => setSignupCode(e.target.value)}
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
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <RectangleEllipsis size={16} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#d80022] px-4 py-2 text-white hover:bg-[#6d0111] focus:outline-none focus:ring-2 focus:ring-[#d80022]"
                disabled={loading}
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
