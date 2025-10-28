
export type ElementType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'social' | 'menu';
export type LayoutType = 'layout';
export type DraggableType = ElementType | LayoutType;
export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export const SUPPORTED_SOCIAL_PLATFORMS = [
    'Facebook', 
    'Twitter', 
    'Instagram', 
    'LinkedIn', 
    'YouTube', 
    'Pinterest',
    'Website',
    'Email',
] as const;

export type SocialPlatform = typeof SUPPORTED_SOCIAL_PLATFORMS[number];

export interface Style {
  [key: string]: string | number;
}

export interface Element {
  id: string;
  type: ElementType;
  content: {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
    items?: { text: string; href: string }[]; // for menu
    links?: { platform: SocialPlatform; href: string }[]; // for social
  };
  style: Style;
}

export interface EmailColumn {
  id: string;
  elements: Element[];
  style: Style;
}

export interface EmailRow {
  id:string;
  columns: EmailColumn[];
  style: Style;
}

export interface GlobalStyles {
  background: string;
  contentBackground: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  width: number;
}

export interface DroppedItem {
    type: DraggableType;
    columns?: number;
    widths?: string[];
}