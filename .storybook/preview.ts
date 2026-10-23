import { createElement } from 'react'
import type { Preview } from '@storybook/react'
import { fontMono, fontSans } from '../src/app/fonts'
import type { UserProfileResponse } from '../src/types/auth'
import { MockAuthProvider } from './MockAuthProvider'
import { adminUser } from './fixtures'
import '../src/styles/global.css'

// Expose --font-mono and --font-sans the same way the root layout does
if (typeof document !== 'undefined') {
  document.documentElement.classList.add(fontMono.variable, fontSans.variable)
}

interface AuthParameters {
  user?: UserProfileResponse | null
}

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/admin/users' },
    },
    backgrounds: {
      default: 'ivory',
      values: [
        { name: 'ivory', value: 'var(--color-ivory)' },
        { name: 'white', value: 'var(--color-white)' },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i } },
  },
  // Every story gets an AuthProvider. Override the user with parameters.auth.user.
  decorators: [
    (Story, context) => {
      const auth = (context.parameters.auth ?? {}) as AuthParameters
      const user = auth.user === undefined ? adminUser : auth.user
      return createElement(MockAuthProvider, { user }, createElement(Story))
    },
  ],
}

export default preview
