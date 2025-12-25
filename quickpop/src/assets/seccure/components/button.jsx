import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HardDriveDownload, X, Share, MoreVertical, PlusSquare } from 'lucide-react';

const Tooltip = ({ onClick }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform] = useState(() => {
    if (typeof navigator === 'undefined') return 'other';
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
    if (/Android/.test(ua)) return 'android';
    if (/Macintosh/.test(ua)) return 'mac';
    return 'other';
  });

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else if (onClick) {
      onClick();
    } else {
      setShowInstructions(true);
    }
  };

  // if (!isInstallable && !onClick) return null;

  return (
    
    <>
      {showInstructions && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Installer l'Application
            </h3>
            
            <div className="space-y-4">
              {platform === 'ios' ? (
                <>
                  <p className="text-gray-600 text-center mb-4">
                    Pour installer QuickPop sur votre iPhone/iPad :
                  </p>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Share className="text-blue-600" size={20} />
                    </div>
                    <span className="text-sm text-gray-700">1. Appuyez sur le bouton <strong>Partager</strong></span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <PlusSquare className="text-gray-600" size={20} />
                    </div>
                    <span className="text-sm text-gray-700">2. Sélectionnez <strong>Sur l'écran d'accueil</strong></span>
                  </div>
                </>
              ) : platform === 'mac' ? (
                <>
                  <p className="text-gray-600 text-center mb-4">
                    Pour installer QuickPop sur votre Mac :
                  </p>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <HardDriveDownload className="text-gray-600" size={20} />
                    </div>
                    <span className="text-sm text-gray-700">1. Cliquez sur l'icône dans la barre d'adresse</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MoreVertical className="text-blue-600" size={20} />
                    </div>
                    <span className="text-sm text-gray-700">2. Ou via le menu : <strong>Installer l'app</strong></span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-center mb-4">
                    Pour installer QuickPop sur votre {platform === 'android' ? 'Android' : 'appareil'} :
                  </p>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <MoreVertical className="text-gray-600" size={20} />
                    </div>
                    <span className="text-sm text-gray-700">1. Appuyez sur le menu du navigateur</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <HardDriveDownload className="text-blue-600" size={20} />
                    </div>
                    <span className="text-sm text-gray-700">2. Sélectionnez <strong>Installer l'application</strong></span>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 right-6 z-[100]">
          <StyledWrapper>
          <button onClick={handleClick} className="faq-button shadow-xl">
              <HardDriveDownload />
              <span className="tooltip text-sm">
                {isInstallable ? "Installer l'App" : "l'Application"}
              </span>
          </button>
          </StyledWrapper>
      </div>
    </>
  );
}

const StyledWrapper = styled.div`
  .faq-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background-color: #ffe53b;
    background-image: linear-gradient(147deg, #ff3b3bff 0%, #ff2525 74%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.151);
    position: relative;
  }
  .faq-button svg {
    height: 1.5em;
    fill: white;
  }
  .faq-button:hover svg {
    animation: jello-vertical 0.7s both;
  }
  @keyframes jello-vertical {
    0% {
      transform: scale3d(1, 1, 1);
    }
    30% {
      transform: scale3d(0.75, 1.25, 1);
    }
    40% {
      transform: scale3d(1.25, 0.75, 1);
    }
    50% {
      transform: scale3d(0.85, 1.15, 1);
    }
    65% {
      transform: scale3d(1.05, 0.95, 1);
    }
    75% {
      transform: scale3d(0.95, 1.05, 1);
    }
    100% {
      transform: scale3d(1, 1, 1);
    }
  }

  .tooltip {
    position: absolute;
    opacity: 0;
    background-color: #ffe53b;
    background-image: linear-gradient(147deg, #ff3b3bff 0%, #ff2525 74%);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-duration: 0.2s;
    pointer-events: none;
    letter-spacing: 0.5px;
  }

  .tooltip::before {
    position: absolute;
    content: "";
    width: 10px;
    height: 10px;
    background-color: #ff2525;
    background-size: 1000%;
    background-position: center;
    transform: rotate(45deg);
    bottom: -15%;
    transition-duration: 0.3s;
  }

  .faq-button:hover .tooltip {
    top: -40px;
    opacity: 1;
    transition-duration: 0.3s;
  }`;

export default Tooltip;
