

declare module "@emotion/react" {
  export interface Theme {
    color(color: string): string;
    colors: {
      // purple: string;
      // blue: string;
      // teal: string;
      // green: string;
      // olive: string;
      // yellow: string;
      // orange: string;
      // red: string;
      // violet: string;
      primary: string;
      secondary: string;
      darkTransparent: string;
      bg: string;
      bgTab: string;
      bgSidePanel: string;
      divider: string;
      textPrimary: string;
      textSecondary: string;
      treeTitlePrimary: string;
      treeTitleSecondary: string;
      treeBgPrimary: string;
      treeBgSecondary: string;
    };
    fonts: {
      base: string;
      baseItalic: string;
      baseBold: string;
      baseBoldItalic: string;
    };
    font: string;
    iconEventsBar: typeof iconEventsBarTheme;
    valueDistribution: typeof valueDistributionTheme;
    eventsCard: typeof eventsCardTheme;
    valuePopup: typeof valuePopupTheme;
    filterLabel: typeof filterLabelTheme;
    useBackgroundImage: boolean;
  }
}
