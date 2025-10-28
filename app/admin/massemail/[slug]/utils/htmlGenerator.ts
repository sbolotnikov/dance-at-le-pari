import type { CSSProperties } from 'react';
import { EmailRow, GlobalStyles, Element, SocialPlatform } from '../types';
import { GOOGLE_FONTS, SOCIAL_ICON_URLS } from '../constants';

// Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
const toInlineStyle = (style: CSSProperties): string => {
  return Object.entries(style)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
};

const getGoogleFontLinks = (emailData: EmailRow[], globalStyles: GlobalStyles): string => {
    const webSafeFonts = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'];
    const fontFamilies = new Set<string>();

    // Add global font family
    fontFamilies.add(globalStyles.fontFamily.split(',')[0].trim());

    // Add element-specific font families
    (emailData || []).forEach(row => {
        (row.columns || []).forEach(col => {
            (col.elements || []).forEach(element => {
                if (element.style && element.style.fontFamily) {
                    fontFamilies.add((element.style.fontFamily as string).split(',')[0].trim());
                }
            });
        });
    });
    
    const fontLinks = Array.from(fontFamilies)
        .filter(font => GOOGLE_FONTS.includes(font) && !webSafeFonts.includes(font))
        .map(font => {
            const fontQuery = font.replace(/\s/g, '+');
            // Include 400 (normal) and 700 (bold) weights
            return `<link href="https://fonts.googleapis.com/css2?family=${fontQuery}:wght@400;700&display=swap" rel="stylesheet" type="text/css">`;
        });
    
    return fontLinks.join('\n  ');
}

const renderElement = (element: Element): string => {
  // The parent <td> handles vertical alignment. We remove it from the element's
  // inline style to prevent conflicts.
  const { verticalAlign, ...elementStyle } = element.style;

  switch (element.type) {
    case 'text':
      // Text alignment is part of its own style, so no special wrapper needed.
      // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
      return `<p style="${toInlineStyle(elementStyle as CSSProperties)}">${element.content.text || ''}</p>`;
    case 'image': {
      // For block-level alignment, we use a wrapper table.
      const align = (elementStyle.textAlign || 'center') as 'left' | 'center' | 'right';
      
      // Padding for images should be on the container TD, not the IMG tag itself,
      // for better email client compatibility.
      const { textAlign, padding, ...imageOnlyStyles } = elementStyle;
      
      const inlineTdStyles = padding ? toInlineStyle({ padding } as CSSProperties) : '';
      const inlineImageStyles = toInlineStyle({ maxWidth: '100%', height: 'auto', display: 'block', ...imageOnlyStyles } as CSSProperties);
      
      const imageTag = `<img src="${element.content.src || ''}" alt="${element.content.alt || ''}" style="${inlineImageStyles}" />`;

      return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td align="${align}" style="${inlineTdStyles}">${imageTag}</td></tr></table>`;
    }
    case 'button': {
      const align = (elementStyle.textAlign || 'center') as 'left' | 'center' | 'right';
      const { textAlign, ...buttonStyles } = elementStyle;
      // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
      const inlineButtonStyles = toInlineStyle(buttonStyles as CSSProperties);
      const buttonItself = `<a href="${element.content.href || '#'}" target="_blank" style="text-decoration: none;"><table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center" style="${inlineButtonStyles}"><span style="color: ${buttonStyles.color || '#FFFFFF'}; text-decoration: none;">${element.content.text || ''}</span></td></tr></table></a>`;
      return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td align="${align}">${buttonItself}</td></tr></table>`;
    }
    case 'divider':
      // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
      return `<div style="${toInlineStyle(elementStyle as CSSProperties)}"></div>`;
    case 'spacer':
      // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
      return `<div style="${toInlineStyle(elementStyle as CSSProperties)}"></div>`;
    case 'social': {
      const align = (elementStyle.textAlign || 'center') as 'left' | 'center' | 'right';
      const { textAlign, ...containerStyles } = elementStyle;
      // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
      const inlineContainerStyles = toInlineStyle(containerStyles as CSSProperties);

      const linksHtml = (element.content.links || []).map(link => {
        const iconUrl = SOCIAL_ICON_URLS[link.platform];
        if (!iconUrl) return ''; // Gracefully handle if an icon is missing for a platform

        const image = `<img src="${iconUrl}" width="32" height="32" alt="${link.platform}" style="display: block; border: 0;" />`;

        return `<td style="padding: 0 5px;"><a href="${link.href || '#'}" target="_blank" style="text-decoration: none;">${image}</a></td>`;
      }).join('');
      
      const innerTable = `<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr>${linksHtml}</tr></tbody></table>`;
      return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td align="${align}" style="${inlineContainerStyles}">${innerTable}</td></tr></table>`;
    }
    default:
      return '';
  }
};

export const generateHtml = (emailData: EmailRow[], globalStyles: GlobalStyles): string => {
  const googleFontLinks = getGoogleFontLinks(emailData, globalStyles);

  const bodyContent = (emailData || []).map(row => {
    // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
    const rowStyle = toInlineStyle(row.style as CSSProperties);
    const columns = (row.columns || []).map(col => {
      // Find an element with verticalAlign to determine the column's valign attribute.
      // This is the most robust way to handle vertical alignment in emails.
      const elementWithVA = (col.elements || []).find(el => el.style.verticalAlign);
      const valign = elementWithVA ? elementWithVA.style.verticalAlign : 'top';
      
      // Fix: Use CSSProperties type from React to resolve "Cannot find namespace 'React'" error.
      const colStyle = toInlineStyle({ ...col.style } as CSSProperties); // Removed hardcoded verticalAlign
      const elementsHtml = (col.elements || []).map(renderElement).join('\n');
      return `<td style="${colStyle}" valign="${valign}">${elementsHtml}</td>`;
    }).join('\n');
    return `<tr style="${rowStyle}"><td align="center" style="padding: 0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;"><tbody><tr>${columns}</tr></tbody></table></td></tr>`;
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Email</title>
  ${googleFontLinks}
  <style>
    body { margin: 0; padding: 0; }
    table { border-collapse: collapse; }
    img { display: block; }
    @media screen and (max-width: ${globalStyles.width}px) {
      .container { width: 100% !important; }
      .col { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="background: ${globalStyles.background}; margin: 0; padding: 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background: ${globalStyles.background};">
    <tr>
      <td align="center">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="${globalStyles.width}">
        <tr>
        <td align="center" valign="top" width="${globalStyles.width}">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${globalStyles.width}px;" class="container">
          <tbody style="background: ${globalStyles.contentBackground}; color: ${globalStyles.textColor}; font-family: ${globalStyles.fontFamily}; font-size: ${globalStyles.fontSize};">
            ${bodyContent}
          </tbody>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};