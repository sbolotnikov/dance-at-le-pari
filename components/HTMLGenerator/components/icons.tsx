import React from 'react';
import { SocialPlatform } from '../types';

const Icon: React.FC<{ children: React.ReactNode; className?: string; fill?: string; strokeWidth?: string; }> = ({ children, className, fill = "none", strokeWidth = "1.5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const TextIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18.1H3" /></Icon>;
export const ImageIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Icon>;
export const ButtonIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><rect x="3" y="8" width="18" height="8" rx="2" /><path d="M8 12h8" /></Icon>;
export const DividerIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
export const SpacerIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M3 6h18M3 18h18" /></Icon>;
export const SocialIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></Icon>;
export const ColumnsIcon: React.FC<{className?:string, columns: number}> = ({className, columns}) => <Icon className={className}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" visibility={columns > 1 ? 'visible' : 'hidden'} /><line x1="8" y1="3" x2="8" y2="21" visibility={columns > 2 ? 'visible' : 'hidden'} /><line x1="16" y1="3" x2="16" y2="21" visibility={columns > 2 ? 'visible' : 'hidden'}/></Icon>;

export const DesktopIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></Icon>;
export const TabletIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></Icon>;
export const MobileIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></Icon>;
export const UndoIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M21 13v-2a4 4 0 0 0-4-4H8" /><polyline points="12 3 8 7 12 11" /></Icon>;
export const RedoIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M3 13v-2a4 4 0 0 1 4-4h9" /><polyline points="12 3 16 7 12 11" /></Icon>;
export const CodeIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>;
export const DownloadIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon>;
export const UploadIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>;
export const TrashIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></Icon>;
export const SparklesIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9L12 21l1.9-4.8 4.8-1.9-4.8-1.9L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></Icon>;
export const AlignLeftIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="17" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></Icon>;
export const AlignCenterIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="18" y1="14" x2="6" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></Icon>;
export const AlignRightIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="7" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></Icon>;
export const BoldIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></Icon>;
export const AlignTopIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M3 3h18v2H3zM8 7h8v10H8z"/></Icon>;
export const AlignMiddleIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M3 11h18v2H3zM8 7h8v10H8z"/></Icon>;
export const AlignBottomIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><path d="M3 19h18v2H3zM8 7h8v10H8z"/></Icon>;
export const SendIcon: React.FC<{className?:string}> = ({className}) => <Icon className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></Icon>;

// Social Media Icons
const FacebookIcon = () => <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />;
const TwitterIcon = () => <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />;
const InstagramIcon = () => <path d="M12 2C8.69 2 8.363 2.015 7.42 2.058C6.477 2.1 5.67 2.298 4.95 2.597C4.225 2.898 3.59 3.32 3.02 3.888C2.45 4.456 2.028 5.09 1.727 5.815C1.428 6.535 1.23 7.332 1.186 8.274C1.143 9.218 1.128 9.545 1.128 12C1.128 14.455 1.143 14.782 1.186 15.726C1.23 16.668 1.428 17.465 1.727 18.185C2.028 18.91 2.45 19.544 3.02 20.112C3.59 20.68 4.225 21.102 4.95 21.403C5.67 21.702 6.477 21.9 7.42 21.942C8.363 21.985 8.69 22 12 22C15.31 22 15.637 21.985 16.58 21.942C17.523 21.9 18.33 21.702 19.05 21.403C19.775 21.102 20.41 20.68 20.98 20.112C21.55 19.544 21.972 18.91 22.273 18.185C22.572 17.465 22.77 16.668 22.814 15.726C22.857 14.782 22.872 14.455 22.872 12C22.872 9.545 22.857 9.218 22.814 8.274C22.77 7.332 22.572 6.535 22.273 5.815C21.972 5.09 21.55 4.456 20.98 3.888C20.41 3.32 19.775 2.898 19.05 2.597C18.33 2.298 17.523 2.1 16.58 2.058C15.637 2.015 15.31 2 12 2ZM12 4.128C15.225 4.128 15.53 4.14 16.433 4.184C17.26 4.223 17.813 4.44 18.23 4.606C18.7 4.793 19.088 5.04 19.475 5.427C19.862 5.814 20.109 6.2 20.296 6.669C20.462 7.087 20.679 7.64 20.718 8.466C20.762 9.37 20.774 9.674 20.774 12C20.774 14.326 20.762 14.63 20.718 15.534C20.679 16.36 20.462 16.913 20.296 17.331C20.109 17.8 19.862 18.186 19.475 18.573C19.088 18.96 18.7 19.207 18.23 19.394C17.813 19.56 17.26 19.777 16.433 19.816C15.53 19.86 15.225 19.872 12 19.872C8.775 19.872 8.47 19.86 7.567 19.816C6.74 19.777 6.187 19.56 5.77 19.394C5.3 19.207 4.912 18.96 4.525 18.573C4.138 18.186 3.891 17.8 3.704 17.331C3.538 16.913 3.321 16.36 3.282 15.534C3.238 14.63 3.226 14.326 3.226 12C3.226 9.674 3.238 9.37 3.282 8.466C3.321 7.64 3.538 7.087 3.704 6.669C3.891 6.2 4.138 5.814 4.525 5.427C4.912 5.04 5.3 4.793 5.77 4.606C6.187 4.44 6.74 4.223 7.567 4.184C8.47 4.14 8.775 4.128 12 4.128ZM12 7.172A4.828 4.828 0 1 0 12 16.828A4.828 4.828 0 1 0 12 7.172ZM12 14.73A2.73 2.73 0 1 1 12 9.27A2.73 2.73 0 1 1 12 14.73ZM18.423 6.765A1.192 1.192 0 1 1 16.039 6.765A1.192 1.192 0 1 1 18.423 6.765Z" />;
const LinkedInIcon = () => (<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></>);
const YouTubeIcon = () => <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l6.5 3.27-6.5 3.27z" />;
const PinterestIcon = () => (<><circle cx="12" cy="12" r="10"></circle><path d="M9.5 7.5s-1 1.5-1 3c0 2 2 3 2 3s-1 2.5-1 4"></path><path d="M12 12s2.5-1.5 2.5-4c0-2.5-1.5-3-1.5-3"></path><path d="M14.5 12s-1.5 2-1.5 4.5c0 2.5 2.5 3.5 2.5 3.5"></path></>);
const WebsiteIcon = () => (<><circle stroke='white' strokeWidth={0.3} cx="12" cy="12" r="10"></circle><line stroke='white' strokeWidth={0.3} x1="2" y1="12" x2="22" y2="12"></line><path stroke='white' strokeWidth={0.3} d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></>);
const EmailIcon = () => (<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>);
const LinkIcon = () => (<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></>);


const iconMap: { [key in SocialPlatform]?: React.FC } = {
    Facebook: FacebookIcon,
    Twitter: TwitterIcon,
    Instagram: InstagramIcon,
    LinkedIn: LinkedInIcon,
    YouTube: YouTubeIcon,
    Pinterest: PinterestIcon,
    Website: WebsiteIcon,
    Email: EmailIcon,
};

export const SocialPlatformIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({ platform, className }) => {
    const IconComponent = iconMap[platform] || LinkIcon;
    return (
        <Icon className={className} fill="currentColor" strokeWidth="0">
            <IconComponent />
        </Icon>
    );
};