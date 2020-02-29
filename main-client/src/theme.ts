import { createMuiTheme } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

const values = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export default createMuiTheme({
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
