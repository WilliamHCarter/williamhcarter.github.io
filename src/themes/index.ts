export interface ThemeConfig {
  id: string;
  label: string;
  path: string;
}

export const themes: ThemeConfig[] = [
  { id: "modern", label: "Modern", path: "/" },
  // { id: "terminal", label: "Terminal", path: "/terminal" },
];

export const defaultTheme = "modern";
