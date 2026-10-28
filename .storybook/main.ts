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
  // Storybook only exposes variables listed here. Stories never call the API, but
  // src/lib/config.ts needs an address to load in a static build.
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
  }),
}

export default config
