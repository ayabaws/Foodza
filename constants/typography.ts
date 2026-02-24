export const Typography = {
  // Font families
  families: {
    primary: 'System',
    secondary: 'System',
    monospace: 'Courier New',
  },
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Font weights
  weights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
  
  // Text styles
  styles: {
    // Heading styles
    h1: {
      fontSize: 36,
      fontWeight: 'bold' as const,
      lineHeight: 44,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 30,
      fontWeight: 'bold' as const,
      lineHeight: 38,
      letterSpacing: -0.025,
    },
    h3: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: 'semibold' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: 'semibold' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: 'semibold' as const,
      lineHeight: 22,
      letterSpacing: 0,
    },
    
    // Body text styles
    body1: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    body3: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
      letterSpacing: 0,
    },
    
    // Caption styles
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
      letterSpacing: 0.025,
    },
    overline: {
      fontSize: 10,
      fontWeight: 'medium' as const,
      lineHeight: 16,
      letterSpacing: 0.1,
      textTransform: 'uppercase' as const,
    },
    
    // Button text styles
    button: {
      fontSize: 16,
      fontWeight: 'semibold' as const,
      lineHeight: 24,
      letterSpacing: 0.025,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: 'semibold' as const,
      lineHeight: 20,
      letterSpacing: 0.025,
    },
    
    // Input styles
    input: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    label: {
      fontSize: 14,
      fontWeight: 'medium' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    
    // Navigation styles
    tab: {
      fontSize: 12,
      fontWeight: 'medium' as const,
      lineHeight: 16,
      letterSpacing: 0.025,
    },
    nav: {
      fontSize: 14,
      fontWeight: 'medium' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
  },
};

export const createTextStyle = (baseStyle: any, overrides?: any) => ({
  ...baseStyle,
  ...overrides,
});
