import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Shield, Lock, AlertCircle } from 'lucide-react';

export default function TermsConditions() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Acceptation des conditions",
      icon: <FileText className="w-5 h-5" />,
      content: `En accédant et en utilisant la plateforme QuickPop, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.

QuickPop se réserve le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur la plateforme. Il est de votre responsabilité de consulter régulièrement ces conditions.`
    },
    {
      title: "2. Description du service",
      icon: <FileText className="w-5 h-5" />,
      content: `QuickPop est une plateforme de formation destinée aux employés de Quick. Elle propose des vidéos de formation, des modules interactifs et des certifications pour maîtriser les procédures et bonnes pratiques de l'entreprise.

Les services incluent :
• Accès à une bibliothèque de vidéos de formation
• Suivi de progression personnalisé
• Certification des compétences acquises
• Évaluation des connaissances par quiz
• Accès aux documents et procédures officielles`
    },
    {
      title: "3. Compte utilisateur et accès",
      icon: <Lock className="w-5 h-5" />,
      content: `L'accès à QuickPop est réservé aux employés actifs de Quick. Chaque utilisateur dispose d'un compte personnel sécurisé.

Vous êtes responsable de :
• Maintenir la confidentialité de vos identifiants
• Toutes les activités effectuées sous votre compte
• Informer immédiatement Quick de toute utilisation non autorisée

Quick se réserve le droit de suspendre ou résilier tout compte en cas de violation des présentes conditions ou de cessation de votre relation d'emploi avec l'entreprise.`
    },
    {
      title: "4. Utilisation de la plateforme",
      icon: <Shield className="w-5 h-5" />,
      content: `Vous vous engagez à utiliser QuickPop uniquement à des fins professionnelles et de formation. Il est strictement interdit de :

• Partager votre compte avec des tiers
• Télécharger, copier ou distribuer le contenu de formation en dehors de la plateforme
• Utiliser la plateforme de manière à perturber son fonctionnement
• Tenter d'accéder à des zones restreintes ou de contourner les mesures de sécurité
• Publier ou transmettre du contenu inapproprié, illégal ou offensant

Le non-respect de ces règles peut entraîner la suspension de votre compte et des mesures disciplinaires.`
    },
    {
      title: "5. Propriété intellectuelle",
      icon: <FileText className="w-5 h-5" />,
      content: `Tous les contenus disponibles sur QuickPop, incluant mais non limité aux vidéos, textes, graphiques, logos, interfaces et logiciels, sont la propriété exclusive de Quick ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle.

Vous disposez d'une licence limitée, non exclusive et non transférable pour :
• Visionner les contenus de formation
• Télécharger les documents nécessaires à votre formation
• Utiliser les ressources dans le cadre de votre activité professionnelle chez Quick

Toute reproduction, modification ou distribution non autorisée du contenu est strictement interdite.`
    },
    {
      title: "6. Protection des données personnelles",
      icon: <Lock className="w-5 h-5" />,
      content: `Quick s'engage à protéger vos données personnelles conformément au RGPD et à la législation applicable.

Données collectées :
• Informations d'identification (nom, prénom, email, ID employé)
• Données de progression (modules complétés, scores, certifications)
• Données de connexion (date, heure, durée d'utilisation)

Ces données sont utilisées pour :
• Personnaliser votre expérience de formation
• Suivre votre progression et délivrer des certifications
• Améliorer la qualité de nos services
• Répondre aux obligations légales et réglementaires

Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez : privacy@quick.fr`
    },
    {
      title: "7. Certifications et évaluations",
      icon: <Shield className="w-5 h-5" />,
      content: `Les certifications délivrées par QuickPop attestent de votre maîtrise des procédures et compétences évaluées. Ces certifications :

• Sont valables pour une durée déterminée (généralement 12 mois)
• Peuvent être renouvelées par une nouvelle formation
• Sont liées à votre compte et non transférables
• Peuvent être requises pour certaines fonctions au sein de Quick

Quick se réserve le droit de :
• Modifier les critères d'obtention des certifications
• Révoquer une certification en cas de fraude ou de violation des conditions
• Exiger des recertifications périodiques

Les scores et résultats obtenus sont conservés dans votre dossier de formation et peuvent être consultés par votre hiérarchie.`
    },
    {
      title: "8. Limitation de responsabilité",
      icon: <AlertCircle className="w-5 h-5" />,
      content: `Quick s'efforce de maintenir QuickPop accessible et fonctionnel, mais ne garantit pas :

• La disponibilité ininterrompue de la plateforme
• L'absence d'erreurs ou de bugs
• La compatibilité avec tous les appareils et navigateurs

Quick ne pourra être tenu responsable de :
• Toute perte de données ou de progression
• Les dommages indirects résultant de l'utilisation de la plateforme
• Les interruptions de service pour maintenance ou mises à jour
• Les problèmes techniques liés à votre connexion internet

En cas de problème technique, veuillez contacter le support : support@quickpop.fr`
    },
    {
      title: "9. Modifications et résiliation",
      icon: <FileText className="w-5 h-5" />,
      content: `Quick se réserve le droit de :

• Modifier, suspendre ou interrompre tout ou partie de QuickPop à tout moment
• Mettre à jour le contenu des formations sans préavis
• Modifier ces conditions générales d'utilisation

Vous pouvez demander la désactivation de votre compte à tout moment, sous réserve de l'approbation de votre responsable.

En cas de cessation de votre relation d'emploi avec Quick, votre accès à QuickPop sera automatiquement révoqué.`
    },
    {
      title: "10. Loi applicable et juridiction",
      icon: <Shield className="w-5 h-5" />,
      content: `Les présentes conditions générales sont régies par le droit français. Tout litige relatif à l'interprétation ou à l'exécution de ces conditions sera soumis à la compétence exclusive des tribunaux français.

En cas de désaccord concernant l'utilisation de QuickPop, nous vous encourageons à contacter d'abord le service des ressources humaines ou le support technique pour trouver une solution amiable.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conditions Générales d'Utilisation</h1>
              <p className="text-sm text-gray-500 mt-1">QuickPop - Plateforme de Formation Quick</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Dernière mise à jour : 11 décembre 2024</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Introduction</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Bienvenue sur QuickPop, la plateforme de formation en ligne de Quick. Ces conditions générales d'utilisation définissent les règles d'accès et d'utilisation de la plateforme.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            En utilisant QuickPop, vous reconnaissez avoir lu, compris et accepté l'intégralité de ces conditions. Nous vous recommandons de les lire attentivement et de les consulter régulièrement car elles peuvent être mises à jour.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    {section.icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 text-left">{section.title}</h3>
                </div>
                {expandedSection === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {expandedSection === index && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-700 mb-4">
            Si vous avez des questions concernant ces conditions générales d'utilisation ou l'utilisation de QuickPop, n'hésitez pas à nous contacter.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Email support :</span>
              <a href="mailto:support@quickpop.fr" className="text-red-600 hover:underline">support@quickpop.fr</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Email RH :</span>
              <a href="mailto:rh@quick.fr" className="text-red-600 hover:underline">rh@quick.fr</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Protection des données :</span>
              <a href="mailto:privacy@quick.fr" className="text-red-600 hover:underline">privacy@quick.fr</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2024 Quick France. Tous droits réservés. QuickPop est une marque de Quick France SAS.
          </p>
        </div>
      </div>
    </div>
  );
}