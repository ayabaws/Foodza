import { Colors } from './colors';

export const Spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Component specific spacing
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Screen spacing
  screen: {
    horizontal: 20,
    vertical: 16,
    container: 24,
  },
  
  // Component spacing
  component: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  
  // Section spacing
  section: {
    sm: 20,
    md: 30,
    lg: 40,
    xl: 60,
  },
  
  // Card spacing
  card: {
    padding: 20,
    margin: 15,
    borderRadius: 15,
  },
  
  // Button spacing
  button: {
    padding: {
      sm: { vertical: 10, horizontal: 20 },
      md: { vertical: 12, horizontal: 24 },
      lg: { vertical: 16, horizontal: 32 },
    },
    margin: {
      horizontal: 15,
      vertical: 8,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 20,
    },
  },
  
  // Input spacing
  input: {
    padding: { vertical: 12, horizontal: 15 },
    margin: { vertical: 8, horizontal: 20 },
    borderRadius: 8,
  },
  
  // List spacing
  list: {
    item: {
      vertical: 15,
      horizontal: 20,
    },
    section: {
      vertical: 30,
    },
  },
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

export const Shadow = {
  xs: {
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  md: {
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  lg: {
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },
};
