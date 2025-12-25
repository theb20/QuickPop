import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const styles = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200"
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200"
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200"
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200"
  }
};

export default function Notification({
  type = "info",
  title,
  message,
  date,
  onClose
}) {
  const config = styles[type] || styles.info;
  const Icon = config.icon;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    
    // Si c'est aujourd'hui, afficher l'heure, sinon la date complète
    const now = new Date();
    const isToday = d.getDate() === now.getDate() && 
                    d.getMonth() === now.getMonth() && 
                    d.getFullYear() === now.getFullYear();
    
    if (isToday) {
        return `Aujourd'hui à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return d.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  return (
    <div className={`
        flex 
        items-start 
        justify-center 
        w-full
        gap-3 
        px-4 
        py-3 
        rounded-lg 
        min-w-[300px]
        border 
        ${config.bg} 
        ${config.text} 
        ${config.border} 
        shadow-sm`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />

      <div className="flex-1">
        {title && <p className="font-medium leading-tight">{title}</p>}
        {message && <p className="text-sm opacity-80">{message}</p>}
        {date && <p className="text-xs opacity-60 mt-1 font-medium">{formatDate(date)}</p>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="opacity-50 hover:opacity-100 transition mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
