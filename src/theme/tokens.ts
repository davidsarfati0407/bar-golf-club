// Design system « clubhouse de nuit » — Bar Golf Club
// Base vert fairway profond, surfaces ivoire type carte de score, encre presque noire.
// Un seul accent néon : or champagne. Réservé aux moments de fête (logo, victoire, carte à partager).

export const colors = {
  fairway: '#0E3B2E',
  fairwayDeep: '#092A21',
  fairwayLight: '#15503E',
  fairwayLine: 'rgba(247, 242, 231, 0.16)',
  ivory: '#F7F2E7',
  ivoryDark: '#EBE3D2',
  ivoryDeep: '#DED3BC',
  ink: '#1A2420',
  inkSoft: '#3E4A45',
  inkMuted: '#5F6B66',
  line: 'rgba(26, 36, 32, 0.14)',
  gold: '#E8C36A',
  goldDeep: '#C9A24A',
  goldGlow: 'rgba(232, 195, 106, 0.55)',
  flag: '#D63A2F',
  success: '#2F8F5B',
  warning: '#C98A2B',
  danger: '#B8382E',
  water: '#3F7FBF',
  white: '#FFFFFF',
  // Couleurs d'équipe : lisibles sur ivoire et sur vert nuit.
  teamRed: '#D63A2F',
  teamGold: '#E8C36A',
  teamBlue: '#4C8FD1',
  teamRose: '#E06C9F',
} as const;

export const fonts = {
  serif: 'PlayfairDisplay_700Bold',
  serifBlack: 'PlayfairDisplay_900Black',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemi: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
} as const;

const tabular = { fontVariant: ['tabular-nums'] as const };

export const type = {
  display: { fontFamily: fonts.serifBlack, fontSize: 44, lineHeight: 50, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  h2: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 28 },
  h3: { fontFamily: fonts.uiBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.ui, fontSize: 16, lineHeight: 23 },
  bodyBold: { fontFamily: fonts.uiSemi, fontSize: 16, lineHeight: 23 },
  small: { fontFamily: fonts.ui, fontSize: 14, lineHeight: 19 },
  smallBold: { fontFamily: fonts.uiSemi, fontSize: 14, lineHeight: 19 },
  caption: { fontFamily: fonts.uiSemi, fontSize: 11, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  number: { fontFamily: fonts.uiBold, fontSize: 36, lineHeight: 40, ...tabular },
  numberSmall: { fontFamily: fonts.uiBold, fontSize: 20, lineHeight: 24, ...tabular },
  numberCell: { fontFamily: fonts.uiSemi, fontSize: 13, lineHeight: 16, ...tabular },
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;
export const touch = { min: 48, cta: 56 } as const;
export const motion = { fast: 150, base: 200, slow: 250, neon: 900 } as const;

export const shadow = {
  card: { shadowColor: '#1A2420', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  neon: { shadowColor: '#E8C36A', shadowOpacity: 0.9, shadowRadius: 22, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
} as const;

export const PHONE_WIDTH = 390;
