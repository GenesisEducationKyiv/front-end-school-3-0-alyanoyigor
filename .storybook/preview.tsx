import React from 'react';

import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../src/shared/styles/theme';

export const decorators = [
  (Story: React.ComponentType) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
