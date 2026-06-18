import { useState } from 'react';

const ProductImage = ({ category, type, name, size = 80, imgUrl }) => {
  const [imageError, setImageError] = useState(false);
  const lowercaseName = name.toLowerCase();

  // Helper to get matching illustration SVG
  const renderIllustration = () => {
    // 1. Whey Protein Tub
    if (lowercaseName.includes('protein')) {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="proteinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          {/* Tub Body */}
          <rect x="25" y="25" width="50" height="60" rx="6" fill="url(#proteinGrad)" />
          {/* Tub Neck & Lid */}
          <rect x="32" y="15" width="36" height="10" rx="3" fill="#334155" />
          <rect x="30" y="10" width="40" height="6" rx="2" fill="url(#accentGrad)" />
          {/* Label */}
          <rect x="28" y="38" width="44" height="34" rx="2" fill="url(#accentGrad)" opacity="0.9" />
          {/* Label details */}
          <text x="50" y="52" fill="white" fontSize="9" fontWeight="800" textAnchor="middle">WHEY</text>
          <text x="50" y="62" fill="white" fontSize="6" fontWeight="600" textAnchor="middle">PROTEIN</text>
          {/* Shading line */}
          <line x1="70" y1="25" x2="70" y2="85" stroke="white" strokeWidth="2" opacity="0.1" />
        </svg>
      );
    }

    // 2. Cough Syrup Bottle
    if (lowercaseName.includes('syrup')) {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {/* Bottle body */}
          <path d="M35,35 C35,28 38,28 38,25 L38,18 L62,18 L62,25 C62,28 65,28 65,35 L65,80 C65,85 60,88 55,88 L45,88 C40,88 35,85 35,80 Z" fill="url(#bottleGrad)" />
          {/* Cap */}
          <rect x="42" y="10" width="16" height="8" rx="2" fill="#d1d5db" />
          <line x1="45" y1="14" x2="55" y2="14" stroke="#9ca3af" strokeWidth="1" />
          {/* Label */}
          <rect x="38" y="42" width="24" height="32" rx="2" fill="white" />
          {/* Cross sign on label */}
          <rect x="48" y="55" width="4" height="10" fill="url(#liquidGrad)" rx="1" />
          <rect x="45" y="58" width="10" height="4" fill="url(#liquidGrad)" rx="1" />
          {/* Liquid glow reflection */}
          <path d="M37,45 Q45,40 50,45 Q55,50 63,45" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
        </svg>
      );
    }

    // 3. Aloe Vera Squeeze Tube
    if (lowercaseName.includes('gel') || lowercaseName.includes('aloe')) {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="gelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Tube body */}
          <path d="M35,12 L65,12 L60,70 L54,70 L54,78 L46,78 L46,70 L40,70 Z" fill="url(#gelGrad)" />
          {/* Tube seal top */}
          <rect x="33" y="8" width="34" height="5" rx="1" fill="#047857" />
          {/* Cap */}
          <rect x="45" y="78" width="10" height="8" rx="2" fill="#1f2937" />
          {/* Label detailing */}
          <path d="M48,30 Q50,25 52,30 Q54,35 50,45 Q46,35 48,30" fill="white" opacity="0.8" />
          <text x="50" y="58" fill="white" fontSize="7" fontWeight="700" textAnchor="middle">ALOE</text>
        </svg>
      );
    }

    // 4. Medicated Shampoo or Face Cleanser Pump Bottle
    if (lowercaseName.includes('shampoo') || lowercaseName.includes('cleanser')) {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="shampooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          {/* Bottle body */}
          <path d="M34,40 C34,30 38,28 42,28 L58,28 C62,28 66,30 66,40 L66,80 C66,85 62,88 57,88 L43,88 C38,88 34,85 34,80 Z" fill="url(#shampooGrad)" />
          {/* Pump mechanism */}
          <rect x="47" y="20" width="6" height="8" fill="#64748b" />
          <path d="M42,20 L58,20 L58,16 C58,16 52,14 48,16 L40,14 L40,18 Z" fill="#475569" />
          {/* Label */}
          <rect x="38" y="45" width="24" height="28" rx="2" fill="white" opacity="0.9" />
          <circle cx="50" cy="58" r="6" fill="#0ea5e9" opacity="0.8" />
          <path d="M47,58 Q50,52 53,58" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }

    // 5. Baby Wipes Packet
    if (lowercaseName.includes('wipes')) {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="wipesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef2f2" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>
          {/* Packet flat bag */}
          <rect x="15" y="30" width="70" height="42" rx="8" fill="url(#wipesGrad)" stroke="#f87171" strokeWidth="1" />
          {/* Sealed edges */}
          <line x1="15" y1="30" x2="15" y2="72" stroke="#ef4444" strokeWidth="3" />
          <line x1="85" y1="30" x2="85" y2="72" stroke="#ef4444" strokeWidth="3" />
          {/* Plastic opening lid */}
          <rect x="35" y="40" width="30" height="18" rx="4" fill="white" stroke="#f87171" strokeWidth="1.5" />
          <circle cx="50" cy="49" r="3" fill="#f87171" />
          {/* Wipes logo */}
          <text x="50" y="66" fill="#b91c1c" fontSize="6" fontWeight="700" textAnchor="middle">BABY WIPES</text>
        </svg>
      );
    }

    // 6. Vitamin/Calcium Capsule Bottles
    if (category === 'wellness') {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="vitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Bottle body */}
          <path d="M35,35 C35,30 38,28 38,25 L38,20 L62,20 L62,25 C62,30 65,30 65,35 L65,78 C65,83 61,86 56,86 L44,86 C39,86 35,83 35,78 Z" fill="url(#vitGrad)" />
          {/* White Cap */}
          <rect x="40" y="12" width="20" height="8" rx="2" fill="white" stroke="#d97706" strokeWidth="1" />
          {/* Label */}
          <rect x="38" y="42" width="24" height="30" rx="2" fill="white" />
          <circle cx="50" cy="54" r="5" fill="#f59e0b" />
          {/* Plus sign */}
          <text x="50" y="66" fill="#b45309" fontSize="6" fontWeight="700" textAnchor="middle">GOLD</text>
        </svg>
      );
    }

    // 7. Prescription Capsule Strip (Rx Items)
    if (type === 'Rx') {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="blisterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="capGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          {/* Blister Card Background */}
          <rect x="22" y="15" width="56" height="70" rx="6" fill="url(#blisterGrad)" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Pocket 1 & Capsule 1 */}
          <rect x="30" y="23" width="14" height="22" rx="7" fill="white" opacity="0.6" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="33" y="26" width="8" height="8" rx="4" fill="url(#capGrad1)" />
          <rect x="33" y="34" width="8" height="8" rx="4" fill="white" />

          {/* Pocket 2 & Capsule 2 */}
          <rect x="56" y="23" width="14" height="22" rx="7" fill="white" opacity="0.6" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="59" y="26" width="8" height="8" rx="4" fill="url(#capGrad1)" />
          <rect x="59" y="34" width="8" height="8" rx="4" fill="white" />

          {/* Pocket 3 & Capsule 3 */}
          <rect x="30" y="55" width="14" height="22" rx="7" fill="white" opacity="0.6" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="33" y="58" width="8" height="8" rx="4" fill="url(#capGrad1)" />
          <rect x="33" y="66" width="8" height="8" rx="4" fill="white" />

          {/* Pocket 4 & Capsule 4 */}
          <rect x="56" y="55" width="14" height="22" rx="7" fill="white" opacity="0.6" stroke="#94a3b8" strokeWidth="0.5" />
          <rect x="59" y="58" width="8" height="8" rx="4" fill="url(#capGrad1)" />
          <rect x="59" y="66" width="8" height="8" rx="4" fill="white" />
          
          {/* Red RX Label corner */}
          <path d="M22,15 L34,15 L22,27 Z" fill="#ef4444" />
        </svg>
      );
    }

    // 8. General OTC Tablet Blister (e.g., Paracetamol, Cetirizine, Ibuprofen)
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id="blisterOtcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* Blister Card Background */}
        <rect x="20" y="20" width="60" height="60" rx="8" fill="url(#blisterOtcGrad)" stroke="#94a3b8" strokeWidth="1" />
        
        {/* Pill 1 */}
        <circle cx="35" cy="35" r="9" fill="white" opacity="0.7" stroke="#94a3b8" strokeWidth="0.5" />
        <circle cx="35" cy="35" r="6" fill="url(#pillGrad)" />
        <line x1="30" y1="35" x2="40" y2="35" stroke="white" strokeWidth="0.5" />

        {/* Pill 2 */}
        <circle cx="65" cy="35" r="9" fill="white" opacity="0.7" stroke="#94a3b8" strokeWidth="0.5" />
        <circle cx="65" cy="35" r="6" fill="url(#pillGrad)" />
        <line x1="60" y1="35" x2="70" y2="35" stroke="white" strokeWidth="0.5" />

        {/* Pill 3 */}
        <circle cx="35" cy="65" r="9" fill="white" opacity="0.7" stroke="#94a3b8" strokeWidth="0.5" />
        <circle cx="35" cy="65" r="6" fill="url(#pillGrad)" />
        <line x1="30" y1="65" x2="40" y2="65" stroke="white" strokeWidth="0.5" />

        {/* Pill 4 */}
        <circle cx="65" cy="65" r="9" fill="white" opacity="0.7" stroke="#94a3b8" strokeWidth="0.5" />
        <circle cx="65" cy="65" r="6" fill="url(#pillGrad)" />
        <line x1="60" y1="65" x2="70" y2="65" stroke="white" strokeWidth="0.5" />
      </svg>
    );
  };

  if (imgUrl && !imageError) {
    return (
      <img 
        src={imgUrl} 
        alt={name} 
        onError={() => setImageError(true)} 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          objectFit: 'cover',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'block'
        }}
        className="product-image"
      />
    );
  }

  return (
    <div 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-surface-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        padding: '8px',
        boxSizing: 'border-box'
      }}
      className="product-image-container"
    >
      {renderIllustration()}
    </div>
  );
};

export default ProductImage;
