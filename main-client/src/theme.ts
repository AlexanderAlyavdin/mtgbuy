import { createMuiTheme } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

const values = Object.freeze({
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
});

export default createMuiTheme({
  palette: {
    primary: {
      light: '#be9c91',
      main: '#8d6e63',
      dark: '#5f4339',
    },
    secondary: {
      light: '#8e8e8e',
      main: '#616161',
      dark: '#373737',
    },
  },
  breakpoints: {
    keys: Object.keys(values) as Array<keyof typeof values>,
    up: (key): string => `@media (min-width:${values[key as Breakpoint]}px)`,
  },
});
