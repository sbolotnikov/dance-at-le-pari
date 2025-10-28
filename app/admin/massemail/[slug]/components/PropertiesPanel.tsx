import React, { useState, useEffect } from 'react';
import { Element, GlobalStyles, SUPPORTED_SOCIAL_PLATFORMS, SocialPlatform } from '../types';
// import { generateText } from '../services/geminiService';
import { SparklesIcon, TrashIcon, BoldIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignTopIcon, AlignMiddleIcon, AlignBottomIcon } from './icons';
import BackgroundPicker from './BackgroundPicker';
import FontSelector from './FontSelector';

interface PropertiesPanelProps {
  selectedElement: Element | null;
  onUpdate: (element: Element) => void;
  globalStyles: GlobalStyles;
  onGlobalStylesUpdate: (styles: GlobalStyles) => void;
}

const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="border-b border-slate-200 py-4">
        <h4 className="text-sm font-semibold text-slate-600 mb-3">{title}</h4>
        <div className="space-y-2">{children}</div>
    </div>
);

const PropertyInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-slate-500">{label}</label>
        {children}
    </div>
);

const TextInput: React.FC<{ value: string; onChange: (val: string) => void; className?: string }> = ({ value, onChange, className = "w-1/2" }) => (
     <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${className} p-1 border border-slate-300 rounded-md text-sm`} />
);

const ColorInput: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => (
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-6 p-0 border-none rounded" />
);

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdate, globalStyles, onGlobalStylesUpdate }) => {
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [localElement, setLocalElement] = useState<Element | null>(null);

    useEffect(() => {
        setLocalElement(selectedElement);
    }, [selectedElement]);

    const handleUpdate = (prop: string, value: any, target: 'style' | 'content') => {
        if (!localElement) return;
        const updatedElement = {
            ...localElement,
            [target]: {
                ...localElement[target],
                [prop]: value
            }
        };
        setLocalElement(updatedElement);
        onUpdate(updatedElement);
    };
    
    const handleGlobalUpdate = (prop: keyof GlobalStyles, value: any) => {
        onGlobalStylesUpdate({ ...globalStyles, [prop]: value });
    }

    // const handleAIGenerate = async () => {
    //     if (!aiPrompt || !localElement) return;
    //     setIsGenerating(true);
    //     const newText = await generateText(aiPrompt);
    //     handleUpdate('text', newText, 'content');
    //     setIsGenerating(false);
    // };

    const handleSocialLinksUpdate = (newLinks: { platform: SocialPlatform; href: string }[]) => {
        if (!localElement) return;
        const updatedElement = {
            ...localElement,
            content: {
                ...localElement.content,
                links: newLinks
            }
        };
        setLocalElement(updatedElement);
        onUpdate(updatedElement);
    };
    
    const handleLinkUpdate = (index: number, field: 'platform' | 'href', value: string) => {
        if (!localElement || !localElement.content.links) return;
        
        // FIX: By explicitly typing the return value of the map callback, we ensure
        // TypeScript doesn't widen the 'platform' property to a generic 'string'.
        const newLinks = localElement.content.links.map((link, i): { platform: SocialPlatform; href: string } => {
            if (i !== index) return link;

            if (field === 'platform') {
                return { ...link, platform: value as SocialPlatform };
            }
            return { ...link, href: value };
        });

        handleSocialLinksUpdate(newLinks);
    };
    
    const handleRemoveLink = (index: number) => {
        if (!localElement || !localElement.content.links) return;
        const newLinks = localElement.content.links.filter((_, i) => i !== index);
        handleSocialLinksUpdate(newLinks);
    };
    
    const handleAddLink = () => {
        if (!localElement) return;
        // FIX: Cast 'Website' to SocialPlatform to prevent TypeScript from widening the type to a generic 'string', which would cause a type error.
        const newLinks = [...(localElement.content.links || []), { platform: 'Website' as SocialPlatform, href: '#' }];
        handleSocialLinksUpdate(newLinks);
    };
    
    const renderElementProperties = () => {
        if (!localElement) return null;
        
        const { type, content, style } = localElement;

        const VerticalAlignControls = () => (
             <PropertyInput label="Vertical Align">
                <div className="flex items-center gap-1 border border-slate-300 rounded-md p-0.5">
                    {(['top', 'middle', 'bottom'] as const).map(align => (
                        <button
                            key={align}
                            onClick={() => handleUpdate('verticalAlign', align, 'style')}
                            className={`p-1.5 rounded transition-colors ${style.verticalAlign === align ? 'bg-indigo-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-100'}`}
                            title={`Align ${align}`}
                        >
                            {align === 'top' && <AlignTopIcon className="w-4 h-4" />}
                            {align === 'middle' && <AlignMiddleIcon className="w-4 h-4" />}
                            {align === 'bottom' && <AlignBottomIcon className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </PropertyInput>
        );

        return (
            <>
                { (type === 'text' || type === 'button') && (
                    <Section title="Content">
                         <textarea
                            value={content.text}
                            onChange={(e) => handleUpdate('text', e.target.value, 'content')}
                            className="w-full p-2 border border-slate-300 rounded-md text-sm"
                            rows={4}
                        />
                         { type === 'text' && (
                            <div className="space-y-2 pt-2 border-t border-slate-200 mt-2">
                                <p className="text-sm font-medium text-slate-600">Generate with AI</p>
                                <input type="text" placeholder="e.g., a welcome message" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" />
                                {/* <button onClick={handleAIGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                                    <SparklesIcon className="w-4 h-4" />
                                    {isGenerating ? 'Generating...' : 'Generate Text'}
                                </button> */}
                            </div>
                        )}
                        { type === 'button' && (
                            <PropertyInput label="URL (href)"><TextInput value={content.href || ''} onChange={(val) => handleUpdate('href', val, 'content')} /></PropertyInput>
                        )}
                    </Section>
                )}
                 { type === 'image' && (
                    <Section title="Image Settings">
                        <PropertyInput label="Source (URL)"><TextInput value={content.src || ''} onChange={(val) => handleUpdate('src', val, 'content')} /></PropertyInput>
                        <PropertyInput label="Alt Text"><TextInput value={content.alt || ''} onChange={(val) => handleUpdate('alt', val, 'content')} /></PropertyInput>
                        <PropertyInput label="Horizontal Align">
                            <div className="flex items-center gap-1 border border-slate-300 rounded-md p-0.5">
                                {(['left', 'center', 'right'] as const).map(align => (
                                    <button
                                        key={align}
                                        onClick={() => handleUpdate('textAlign', align, 'style')}
                                        className={`p-1.5 rounded transition-colors ${style.textAlign === align ? 'bg-indigo-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-100'}`}
                                        title={`Align ${align}`}
                                    >
                                        {align === 'left' && <AlignLeftIcon className="w-4 h-4" />}
                                        {align === 'center' && <AlignCenterIcon className="w-4 h-4" />}
                                        {align === 'right' && <AlignRightIcon className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </PropertyInput>
                    </Section>
                )}
                 { type === 'social' && (
                    <Section title="Social Links">
                        {(localElement.content.links || []).map((link, index) => (
                            <div key={index} className="p-2 border border-slate-200 rounded-md space-y-2">
                                <div className="flex items-center justify-between">
                                     <select
                                        value={link.platform}
                                        onChange={(e) => handleLinkUpdate(index, 'platform', e.target.value)}
                                        className="flex-grow mr-2 p-1 border border-slate-300 rounded-md text-sm"
                                    >
                                        {SUPPORTED_SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <button onClick={() => handleRemoveLink(index)} className="text-red-500 hover:text-red-700 p-1">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="URL"
                                    value={link.href}
                                    onChange={(e) => handleLinkUpdate(index, 'href', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded-md text-sm"
                                />
                            </div>
                        ))}
                        <button 
                            onClick={handleAddLink}
                            className="w-full mt-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                        >
                            + Add Link
                        </button>
                    </Section>
                )}
                
                { type === 'text' && (
                    <Section title="Typography">
                        <PropertyInput label="Font Family">
                            <FontSelector
                                value={(style.fontFamily as string) || globalStyles.fontFamily}
                                onChange={(font) => handleUpdate('fontFamily', font, 'style')}
                            />
                        </PropertyInput>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-500">Font Style</label>
                            <div className="flex items-center gap-2">
                                <TextInput 
                                    value={style.fontSize as string || '16px'} 
                                    onChange={(val) => handleUpdate('fontSize', val, 'style')} 
                                    className="w-[70px]"
                                />
                                <ColorInput value={style.color as string || '#000000'} onChange={(val) => handleUpdate('color', val, 'style')} />
                                <button 
                                    onClick={() => handleUpdate('fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold', 'style')}
                                    className={`p-1.5 border rounded-md transition-colors ${style.fontWeight === 'bold' ? 'bg-indigo-100 border-brand-primary text-brand-primary' : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}
                                    title="Bold"
                                >
                                    <BoldIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                         <PropertyInput label="Alignment">
                            <div className="flex items-center gap-1 border border-slate-300 rounded-md p-0.5">
                                {(['left', 'center', 'right'] as const).map(align => (
                                    <button
                                        key={align}
                                        onClick={() => handleUpdate('textAlign', align, 'style')}
                                        className={`p-1.5 rounded transition-colors ${style.textAlign === align ? 'bg-indigo-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-100'}`}
                                        title={`Align ${align}`}
                                    >
                                        {align === 'left' && <AlignLeftIcon className="w-4 h-4" />}
                                        {align === 'center' && <AlignCenterIcon className="w-4 h-4" />}
                                        {align === 'right' && <AlignRightIcon className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </PropertyInput>
                    </Section>
                )}

                { (type === 'button' || type === 'social') && (
                    <Section title={type === 'button' ? "Button Style" : "Alignment"}>
                         { type === 'button' && 
                            <>
                                <PropertyInput label="Background"><ColorInput value={style.backgroundColor as string || '#4F46E5'} onChange={(val) => handleUpdate('backgroundColor', val, 'style')} /></PropertyInput>
                                <PropertyInput label="Text Color"><ColorInput value={style.color as string || '#FFFFFF'} onChange={(val) => handleUpdate('color', val, 'style')} /></PropertyInput>
                                <PropertyInput label="Border Radius"><TextInput value={style.borderRadius as string || '4px'} onChange={(val) => handleUpdate('borderRadius', val, 'style')} /></PropertyInput>
                            </>
                         }
                         <PropertyInput label="Alignment">
                            <div className="flex items-center gap-1 border border-slate-300 rounded-md p-0.5">
                                {(['left', 'center', 'right'] as const).map(align => (
                                    <button
                                        key={align}
                                        onClick={() => handleUpdate('textAlign', align, 'style')}
                                        className={`p-1.5 rounded transition-colors ${style.textAlign === align ? 'bg-indigo-100 text-brand-primary' : 'text-slate-500 hover:bg-slate-100'}`}
                                        title={`Align ${align}`}
                                    >
                                        {align === 'left' && <AlignLeftIcon className="w-4 h-4" />}
                                        {align === 'center' && <AlignCenterIcon className="w-4 h-4" />}
                                        {align === 'right' && <AlignRightIcon className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </PropertyInput>
                    </Section>
                )}

                 { (type === 'text' || type === 'image' || type === 'button' || type === 'social') && (
                    <Section title="Spacing">
                        <PropertyInput label="Padding"><TextInput value={style.padding as string || '10px'} onChange={(val) => handleUpdate('padding', val, 'style')} /></PropertyInput>
                        <VerticalAlignControls />
                    </Section>
                 )}
                 { type === 'divider' && (
                    <Section title="Styling">
                          <PropertyInput label="Border"><TextInput value={style.borderTop as string || '1px solid #cccccc'} onChange={(val) => handleUpdate('borderTop', val, 'style')} /></PropertyInput>
                    </Section>
                 )}
                  { type === 'spacer' && (
                    <Section title="Styling">
                          <PropertyInput label="Height"><TextInput value={style.height as string || '20px'} onChange={(val) => handleUpdate('height', val, 'style')} /></PropertyInput>
                    </Section>
                 )}
            </>
        );
    };

    const renderGlobalProperties = () => {
        return (
            <Section title="Global Styles">
                <div className='space-y-2'>
                    <label className="text-sm text-slate-500 block mb-2">Email Background</label>
                    <BackgroundPicker 
                        value={globalStyles.background} 
                        onChange={val => handleGlobalUpdate('background', val)} 
                    />
                </div>
                <div className='space-y-2 mt-4'>
                    <label className="text-sm text-slate-500 block mb-2">Content Background</label>
                    <BackgroundPicker 
                        value={globalStyles.contentBackground} 
                        onChange={val => handleGlobalUpdate('contentBackground', val)}
                    />
                </div>
                <PropertyInput label="Content Width"><input type="number" value={globalStyles.width} onChange={e => handleGlobalUpdate('width', parseInt(e.target.value))} className="w-1/2 p-1 border border-slate-300 rounded-md text-sm" /></PropertyInput>
                <PropertyInput label="Default Font">
                    <FontSelector 
                        value={globalStyles.fontFamily} 
                        onChange={font => handleGlobalUpdate('fontFamily', font)} 
                    />
                </PropertyInput>
            </Section>
        );
    }

    return (
        <aside className="w-80 bg-white p-4 border-l border-slate-200 overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{selectedElement ? `${selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties` : 'Email Properties'}</h3>
            {localElement ? renderElementProperties() : renderGlobalProperties()}
        </aside>
    );
};

export default PropertiesPanel;