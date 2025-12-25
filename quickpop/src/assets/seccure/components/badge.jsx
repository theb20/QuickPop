export default function Badge() {
  return (
    <div className="absolute -top-[14px] left-0 right-0 flex justify-center z-10 pointer-events-none">
      <div className="relative w-[50px] h-[50px]">
        {/* Bordure animée avec dégradé qui glisse */}
        <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 3s linear infinite' }}>
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff0080" />
              <stop offset="25%" stopColor="#ff6b00" />
              <stop offset="50%" stopColor="#ffd900" />
              <stop offset="75%" stopColor="#7928ca" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r="23"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="3"
            strokeDasharray="10 5"
          />
        </svg>
        <div className="absolute inset-[3px] flex items-center justify-center">
          <img
            src="/imgs/cap.png"
            alt="badge de grade"
            className="w-[44px] h-[44px] object-cover rounded-full"
          />
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}