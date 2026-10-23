import type { StorybookConfig } from '@storybook/nextjs'

// webpack is pinned in package.json to the version Next bundles (5.98.0). A newer
// standalone webpack breaks the preview build with "Cannot read properties of
// undefined (reading 'tap')" because its DefinePlugin runs inside Next's compiler.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
}

export default config
