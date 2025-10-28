import { ElementType, GlobalStyles, SocialPlatform } from './types';

export const COMPONENT_TYPES: { name: string; type: ElementType }[] = [
  { name: 'Text', type: 'text' },
  { name: 'Image', type: 'image' },
  { name: 'Button', type: 'button' },
  { name: 'Divider', type: 'divider' },
  { name: 'Spacer', type: 'spacer' },
  { name: 'Social', type: 'social' },
];

export const LAYOUT_TYPES: { name: string; columns: number; widths: string[] }[] = [
  { name: '1 Column', columns: 1, widths: ['100%'] },
  { name: '2 Columns (50/50)', columns: 2, widths: ['50%', '50%'] },
  { name: '2 Columns (33/67)', columns: 2, widths: ['33.33%', '66.67%'] },
  { name: '2 Columns (67/33)', columns: 2, widths: ['66.67%', '33.33%'] },
  { name: '3 Columns (33/33/33)', columns: 3, widths: ['33.33%', '33.33%', '33.33%'] },
  { name: '3 Columns (25/25/50)', columns: 3, widths: ['25%', '25%', '50%'] },
  { name: '3 Columns (50/25/25)', columns: 3, widths: ['50%', '25%', '25%'] },
  { name: '3 Columns (25/50/25)', columns: 3, widths: ['25%', '50%', '25%'] },
  { name: '4 Columns (25/25/25/25)', columns: 4, widths: ['25%', '25%', '25%', '25%'] },
  { name: '4 Columns (40/20/20/20)', columns: 4, widths: ['40%', '20%', '20%', '20%'] },
  { name: '4 Columns (20/20/20/40)', columns: 4, widths: ['20%', '20%', '20%', '40%'] },
];

export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  background: '#f1f5f9', // slate-100
  contentBackground: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  textColor: '#1e293b', // slate-800
  width: 600,
};

export const SOCIAL_PLATFORM_COLORS: { [key in SocialPlatform]: string } = {
  Facebook: '#1877F2',
  Twitter: '#1DA1F2',
  Instagram: '#E4405F',
  LinkedIn: '#0A66C2',
  YouTube: '#FF0000',
  Pinterest: '#E60023',
  Website: '#4A5568',
  Email: '#805AD5',
};

export const SOCIAL_ICON_URLS: { [key in SocialPlatform]: string } = {
  Facebook: 'https://www.leparidancenter.com/images/icons/facebook.png',
  Twitter: 'https://www.leparidancenter.com/images/icons/twitter.png',
  Instagram: 'https://www.leparidancenter.com/images/icons/instagram.png',
  LinkedIn: 'https://www.leparidancenter.com/images/icons/linkedin.png',
  YouTube: 'https://www.leparidancenter.com/images/icons/youtube.png',
  Pinterest: 'https://www.leparidancenter.com/images/icons/pinterest.png',
  Website: 'https://www.leparidancenter.com/icon-152x152.png',
  Email: 'https://www.leparidancenter.com/images/icons/mail.png',
};

export const GOOGLE_FONTS = [
  // Web Safe
  'Arial',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Courier New',
  // Sans-Serif
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Raleway',
  'Poppins',
  'Nunito Sans',
  'Inter',
  'Work Sans',
  // Serif
  'Merriweather',
  'Playfair Display',
  'Lora',
  'PT Serif',
  // Display
  'Oswald',
  'Pacifico',
  'Lobster',
  'Anton',
  'Bebas Neue',
  // Monospace
  'Inconsolata',
  'Source Code Pro',
  'Fira Code'
];