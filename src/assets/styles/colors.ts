// TODO: write documentation for colors and palette in own markdown file and add links from here

export const fontFamily = {
  manrope: 'Manrope',
};

export const palette = {
  // Background
  primary: '#0047B3',
  pink: '#DF4058',

  // Text
  textPrimary: '#000000',
  textInverse: '#FFFFFF',
  textInverse100: '#FFFFFF96',
  textInverse200: '#B5B5B5',
  textInverse300: '#717171',
  textInverse400: '#252525',
  textInverse500: '#4D4D4D',

  neutral100: '#FFFFFF',
  neutral200: '#F4F2F1',
  neutral300: '#D7CEC9',
  neutral400: '#B6ACA6',
  neutral500: '#978F8A',
  neutral600: '#564E4A',
  neutral700: '#3C3836',
  neutral800: '#191015',
  neutral900: '#000000',

  gray: '#D9D9D9',

  neutral: '#F5F5F5',
} as const;

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,

  text: palette.neutral800,
  /**
   * A helper for making something see-thru.
   */
  transparent: 'rgba(0, 0, 0, 0)',
  /**
   * The default text color in many components.
   */
};
