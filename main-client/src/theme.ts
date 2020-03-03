import { createMuiTheme } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { colors } from '@material-ui/core';

const values = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export default createMuiTheme({
  palette: {
    primary: colors.amber,
    secondary: colors.brown,
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    up: (key): string => `@media (min-width:${values[key as Breakpoint]}px)`,
  },
  overrides: {
    MuiButton: {
      root: {
        fontWeight: 'bold',
        backgroundColor: 'red',
        margin: '10px',
        '&:hover': {
          backgroundColor: 'green',
        },
      },
    },
  },
});
