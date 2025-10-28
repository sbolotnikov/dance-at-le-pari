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
  Facebook: 'https://camo.githubusercontent.com/f76a9ecfb7384395d9fdeca88dec33c9ad36ad67d32e2156f493e310a622864c/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f66616365626f6f6b2e737667',
  Twitter: 'https://camo.githubusercontent.com/ab326066830e689c6ee9d64141aa935764d78b0ecd01e93eb90f00a729359f49/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f747769747465722e737667',
  Instagram: 'https://camo.githubusercontent.com/da1a9ba067cba3e9fed4978aca58ffc6e3abe151c74f722324bda199a97b27cf/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f696e7374616772616d2e737667',
  LinkedIn: 'https://camo.githubusercontent.com/e9592fd6ea20b888ed3c7621d8c7257835af4f2e7232e92f5db4e9e2e4e91380/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f6c696e6b6564696e2e737667',
  YouTube: 'https://camo.githubusercontent.com/ce941b1ba54f5e7b42f93d7812a530fd272a26c919f3c27119f66f938e4e238b/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f796f75747562652e737667',
  Pinterest: 'https://camo.githubusercontent.com/e9128fdba1dea870c75e9eadc8570db30cef72ee057be33c7c611ddb1bbd9980/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f70696e7465726573742e737667',
  Website: 'https://www.leparidancenter.com/icon-152x152.png',
  Email: 'https://camo.githubusercontent.com/103e288a5e9194c4cbbaf416dd7652c1fa89a4b15e11b75a6bc3c8a136c22fcd/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f656d61696c2e737667',
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