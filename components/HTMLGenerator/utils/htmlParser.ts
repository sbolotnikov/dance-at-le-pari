import { EmailRow, Element as EmailElement, GlobalStyles, Style, SocialPlatform, SUPPORTED_SOCIAL_PLATFORMS } from '../types';
import { DEFAULT_GLOBAL_STYLES } from '../constants';

// Helper to create a style object, filtering out empty values
const createStyleObject = (el: HTMLElement, props: (keyof CSSStyleDeclaration)[]): Style => {
    const style: Style = {};
    props.forEach(prop => {
        const value = el.style[prop as any];
        if (value) {
            style[prop.toString()] = value;
        }
    });
    return style;
};

// A simplified parser. A production version would need to be more robust.
export const parseHtml = (html: string): { rows: EmailRow[], styles: GlobalStyles } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const rows: EmailRow[] = [];
    const styles: GlobalStyles = { ...DEFAULT_GLOBAL_STYLES };

    // Try to find global styles
    const body = doc.body;
    // Prioritize backgroundImage for gradients as browsers often split the 'background' shorthand.
    const bodyBgImage = body.style.backgroundImage;
    if (bodyBgImage && bodyBgImage.includes('gradient')) {
        styles.background = bodyBgImage;
    } else {
        styles.background = body.style.background || body.style.backgroundColor || DEFAULT_GLOBAL_STYLES.background;
    }
    
    const container = doc.querySelector('.container') as HTMLElement;
    if (container) {
        const tbody = container.querySelector('tbody');
        if (tbody) {
            const contentBgImage = tbody.style.backgroundImage;
            if (contentBgImage && contentBgImage.includes('gradient')) {
                 styles.contentBackground = contentBgImage;
            } else {
                styles.contentBackground = tbody.style.background || tbody.style.backgroundColor || DEFAULT_GLOBAL_STYLES.contentBackground;
            }
            styles.fontFamily = tbody.style.fontFamily || DEFAULT_GLOBAL_STYLES.fontFamily;
            styles.textColor = tbody.style.color || DEFAULT_GLOBAL_STYLES.textColor;
        }
        styles.width = parseInt(container.style.maxWidth || '600', 10);
    }


    // This query targets the top-level rows of the main content table.
    const topLevelRows = container?.querySelectorAll<HTMLTableRowElement>(':scope > tbody > tr');

    topLevelRows?.forEach((tr, rowIndex) => {
        const row: EmailRow = {
            id: `row-import-${rowIndex}-${Date.now()}`,
            columns: [],
            style: {}, // Simplified for now
        };

        // This is the robust fix: The query now specifically targets the layout columns.
        // The structure generated is `tr > td > table > tbody > tr > td(column)`.
        // This avoids accidentally selecting `<td>` elements from within components like buttons.
        const columns = tr.querySelectorAll<HTMLTableCellElement>(':scope > td > table > tbody > tr > td');
        
        if(columns.length === 0) return; // Skip if no clear columns found

        columns.forEach((td, colIndex) => {
            const valign = td.getAttribute('valign'); // Get valign from the column cell
            const elements: EmailElement[] = [];
            td.childNodes.forEach((node, elIndex) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement;
                    let parsedElement: EmailElement | null = null;
                    
                    let alignment: string | null = null;
                    // Alignment for block elements is stored in a wrapper table's td.
                    if (el.tagName === 'TABLE') {
                        const alignTd = el.querySelector<HTMLTableCellElement>('td[align]');
                        if (alignTd) {
                            alignment = alignTd.getAttribute('align');
                        }
                    }
                    
                    // Specific check for Social elements, which contain nested tables.
                    const innerSocialTable = el.querySelector('table table');
                    if (el.tagName === 'TABLE' && innerSocialTable && innerSocialTable.querySelector('img[src*="signature-social-icons"]')) {
                        const links: { platform: SocialPlatform; href: string }[] = [];
                        innerSocialTable.querySelectorAll('a').forEach(a => {
                            const img = a.querySelector('img');
                            if (img) {
                                const platform = img.getAttribute('alt') as SocialPlatform;
                                const href = a.getAttribute('href') || '#';
                                if (platform && SUPPORTED_SOCIAL_PLATFORMS.includes(platform)) {
                                    links.push({ platform, href });
                                }
                            }
                        });

                        if (links.length > 0) {
                            const wrapperTd = el.querySelector<HTMLTableCellElement>('td[align]');
                            parsedElement = {
                                id: `el-import-${elIndex}-${Date.now()}`,
                                type: 'social',
                                content: { links },
                                style: { 
                                    padding: wrapperTd?.style.padding || '',
                                    textAlign: alignment || 'center'
                                }
                            };
                        }

                    } else if (el.tagName === 'P') {
                        const textStyle = createStyleObject(el, ['color', 'fontSize', 'padding', 'textAlign', 'fontWeight', 'fontFamily']);
                        parsedElement = { id: `el-import-${elIndex}-${Date.now()}`, type: 'text', content: { text: el.innerHTML || '' }, style: textStyle };
                    } else if (el.tagName === 'TABLE' && el.querySelector('img')) { // Image (wrapped in alignment table)
                        const img = el.querySelector('img')!;
                        parsedElement = { id: `el-import-${elIndex}-${Date.now()}`, type: 'image', content: { src: img.getAttribute('src') || '', alt: img.getAttribute('alt') || '' }, style: { padding: img.style.padding } };
                        if(alignment && parsedElement) {
                            parsedElement.style.textAlign = alignment;
                        }
                    } else if (el.tagName === 'TABLE' && el.querySelector('a > table')) { // Button (wrapped in alignment table)
                         const a = el.querySelector('a')!;
                        const buttonText = a.textContent || '';
                        const buttonTd = a.querySelector<HTMLTableCellElement>('td');
                        const buttonSpan = a.querySelector<HTMLSpanElement>('span');
                        parsedElement = {
                            id: `el-import-${elIndex}-${Date.now()}`,
                            type: 'button',
                            content: { href: a.getAttribute('href') || '#', text: buttonText },
                            style: {
                                backgroundColor: buttonTd?.style.backgroundColor || '',
                                color: buttonSpan?.style.color || '',
                                padding: buttonTd?.style.padding || '',
                                borderRadius: buttonTd?.style.borderRadius || ''
                            }
                        };
                        if (parsedElement && alignment) {
                            parsedElement.style.textAlign = alignment;
                        }
                    } else if (el.tagName === 'DIV' && (el.style.borderTop || el.style.height)) {
                        if (el.style.borderTop) {
                             parsedElement = { id: `el-import-${elIndex}-${Date.now()}`, type: 'divider', content: {}, style: { borderTop: el.style.borderTop, padding: el.style.padding } };
                        } else {
                            parsedElement = { id: `el-import-${elIndex}-${Date.now()}`, type: 'spacer', content: {}, style: { height: el.style.height } };
                        }
                        if (parsedElement && alignment) {
                            parsedElement.style.textAlign = alignment;
                        }
                    }

                    if (parsedElement) {
                        // Apply the column's valign to ALL elements within it
                        if (valign) {
                            parsedElement.style.verticalAlign = valign;
                        }
                        elements.push(parsedElement);
                    }
                }
            });
            
            row.columns.push({
                id: `col-import-${colIndex}-${Date.now()}`,
                elements: elements,
                style: { width: td.style.width || '100%' }
            });
        });

        if (row.columns.length > 0) {
            rows.push(row);
        }
    });

    return { rows, styles };
};