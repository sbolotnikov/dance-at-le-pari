export interface IScreenSettings {
   darkMode: boolean;
  }
  export type ScreenSettingsContextType = {
    darkMode: boolean;
    changeTheme: (a:boolean) => void;
  };