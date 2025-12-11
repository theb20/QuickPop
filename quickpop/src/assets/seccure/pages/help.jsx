import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight, ChevronDown, Book, Download, Play, Shield, CreditCard, Settings, HelpCircle, MessageCircle, Mail, Phone, Menu, X, Home, Film, Tv, TrendingUp, Star, HardDrive, User, LogOut } from 'lucide-react'

export default function HelpPage() {
  const navigate = useNavigate()
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [sidebar, setSidebar] = useState(false)
  const [menu, setMenu] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'Tout', icon: Book },
    { id: 'account', name: 'Compte', icon: User },
    { id: 'downloads', name: 'Téléchargements', icon: Download },
    { id: 'streaming', name: 'Lecture', icon: Play },
    { id: 'billing', name: 'Facturation', icon: CreditCard },
    { id: 'technical', name: 'Technique', icon: Settings },
  ]

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'Comment créer un compte ?',
      answer: 'Pour créer un compte, cliquez sur "S\'inscrire" en haut à droite de la page d\'accueil. Remplissez le formulaire avec votre email et mot de passe. Vous recevrez un email de confirmation pour activer votre compte.'
    },
    {
      id: 2,
      category: 'account',
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe. Le lien est valide pendant 24 heures.'
    },
    {
      id: 3,
      category: 'downloads',
      question: 'Comment télécharger du contenu hors ligne ?',
      answer: 'Naviguez vers le film ou la série que vous souhaitez télécharger, puis cliquez sur l\'icône de téléchargement. Vous pouvez choisir la qualité (4K, 1080p, 720p) avant de lancer le téléchargement. Le contenu sera disponible dans votre section "Hors ligne".'
    },
    {
      id: 4,
      category: 'downloads',
      question: 'Combien de contenus puis-je télécharger ?',
      answer: 'Avec l\'abonnement Premium, vous pouvez télécharger jusqu\'à 100 titres simultanément. L\'espace de stockage dépend de votre appareil. Nous recommandons au moins 50 GB d\'espace libre pour une utilisation optimale.'
    },
    {
      id: 5,
      category: 'downloads',
      question: 'Combien de temps les téléchargements restent-ils disponibles ?',
      answer: 'Les téléchargements restent disponibles tant que votre abonnement est actif. Certains contenus peuvent avoir une date d\'expiration (généralement 30 jours après le téléchargement) en fonction des accords de licence.'
    },
    {
      id: 6,
      category: 'streaming',
      question: 'Quelle qualité de streaming est disponible ?',
      answer: 'Nous proposons du streaming en SD (480p), HD (720p/1080p) et 4K Ultra HD selon votre abonnement et votre connexion internet. La qualité s\'ajuste automatiquement en fonction de votre bande passante.'
    },
    {
      id: 7,
      category: 'streaming',
      question: 'Puis-je regarder sur plusieurs appareils en même temps ?',
      answer: 'L\'abonnement Standard permet 2 écrans simultanés, et l\'abonnement Premium permet jusqu\'à 4 écrans simultanés. Vous pouvez gérer vos appareils dans les paramètres de votre compte.'
    },
    {
      id: 8,
      category: 'billing',
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons les cartes de crédit (Visa, MasterCard, American Express), PayPal, et les cartes prépayées Quick Pop. Le paiement est automatiquement renouvelé chaque mois.'
    },
    {
      id: 9,
      category: 'billing',
      question: 'Comment annuler mon abonnement ?',
      answer: 'Vous pouvez annuler votre abonnement à tout moment dans Paramètres > Abonnement > Annuler. Vous conserverez l\'accès jusqu\'à la fin de votre période de facturation en cours. Aucun remboursement n\'est effectué pour la période déjà payée.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'Quelle est la vitesse internet recommandée ?',
      answer: 'Pour le streaming HD : minimum 5 Mbps. Pour le 4K : minimum 25 Mbps. Pour les téléchargements : une connexion stable de 10 Mbps ou plus est recommandée pour des téléchargements rapides.'
    },
    {
      id: 11,
      category: 'technical',
      question: 'L\'application ne fonctionne pas, que faire ?',
      answer: 'Essayez ces solutions : 1) Redémarrez l\'application, 2) Vérifiez votre connexion internet, 3) Mettez à jour l\'application vers la dernière version, 4) Videz le cache dans Paramètres > Stockage, 5) Réinstallez l\'application si le problème persiste.'
    },
    {
      id: 12,
      category: 'technical',
      question: 'Pourquoi la qualité vidéo est-elle mauvaise ?',
      answer: 'La qualité peut être affectée par : votre vitesse internet, la congestion du réseau, ou les paramètres de qualité. Vérifiez Paramètres > Lecture > Qualité et sélectionnez "Haute" ou "Automatique". Assurez-vous que votre connexion est stable.'
    },
  ]

  const q = searchQuery.toLowerCase()
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    if (!matchesCategory) return false
    if (!q.trim()) return true
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    )
  })

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }



  return (
    <div className=" ">
    
        {/* Header */}
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="px-4 lg:px-8 py-6 lg:py-8">
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setSidebar(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Centre d'aide</h1>
                <p className="text-gray-600 text-sm lg:text-base">Comment pouvons-nous vous aider aujourd'hui ?</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl w-full">
              <label htmlFor="help-search" className="sr-only">Rechercher dans l'aide</label>
              <div className="relative">
                <Search aria-hidden="true" className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="help-search"
                  type="text"
                  placeholder="Rechercher dans l'aide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setSearchQuery('') }}
                  aria-describedby="help-search-info"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-4 text-sm lg:text-base outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 transition-all text-gray-900"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div id="help-search-info" role="status" aria-live="polite" className="mt-2 text-xs text-gray-500">
                {searchQuery ? (
                  <span>
                    {filteredFaqs.length} résultat{filteredFaqs.length > 1 ? 's' : ''} pour "{searchQuery}"
                  </span>
                ) : (
                  <span>Tapez un mot-clé (ex: compte, téléchargement, sécurité)</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="overflow-y-auto">
          

          {/* FAQ Section */}
          <section className="px-4 lg:px-8 py-8 bg-gray-50">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
              {categories.map(cat => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
                  Aucun résultat pour "{searchQuery}". Essayez avec d'autres mots-clés.
                </div>
              )}
              {filteredFaqs.map(faq => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                        expandedFaq === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          
        </div>
      </div>
    
  )
}
