// Design system — Bar Golf Club
// Palette tirée de l'univers vidéo : rouge pub profond, bois miel, vert scorecard, crème, accent néon rose.

export const colors = {
  pubRed: '#7A1E2B',
  pubRedDeep: '#55121D',
  flagRed: '#E0352B',
  honey: '#C8893A',
  honeyLight: '#E2B373',
  woodDark: '#8A5A24',
  scoreGreen: '#1F6B45',
  scoreGreenDeep: '#134A30',
  scoreGreenLight: '#2E8A5B',
  cream: '#F6EEDC',
  creamDark: '#E9DCC0',
  paper: '#FBF6EA',
  neonPink: '#FF4FA3',
  neonPinkGlow: 'rgba(255, 79, 163, 0.45)',
  ink: '#1A1410',
  inkSoft: '#4A3F36',
  inkMuted: '#7D6F63',
  line: 'rgba(26, 20, 16, 0.12)',
  white: '#FFFFFF',
  successGreen: '#2E8A5B',
  warning: '#D9822B',
  danger: '#C8322B',
} as const;

export const fonts = {
  regular: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

// Échelle typographique arrondie et grasse, gros chiffres, peu de texte.
export const type = {
  display: { fontFamily: fonts.black, fontSize: 56, lineHeight: 60, letterSpacing: -1.5 },
  h1: { fontFamily: fonts.black, fontSize: 32, lineHeight: 36, letterSpacing: -0.8 },
  h2: { fontFamily: fonts.extraBold, fontSize: 24, lineHeight: 28, letterSpacing: -0.4 },
  h3: { fontFamily: fonts.extraBold, fontSize: 18, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 18 },
  smallBold: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, textTransform: 'uppercase' as const },
  number: { fontFamily: fonts.black, fontSize: 44, lineHeight: 48, letterSpacing: -1 },
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 10, md: 16, lg: 22, xl: 30, pill: 999 } as const;

// Cible tactile minimale : 44 pt (iOS) / 48 dp (Android). On prend 48 partout.
export const touch = { min: 48, cta: 60 } as const;

export const shadow = {
  card: {
    shadowColor: '#1A1410',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  neon: {
    shadowColor: '#FF4FA3',
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
} as const;

export const PHONE_WIDTH = 402;
export const PHONE_HEIGHT = 874;
