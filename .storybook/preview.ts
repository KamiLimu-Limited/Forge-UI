import { createElement } from 'react'
import type { Preview } from '@storybook/react'
import { fontMono, fontSans } from '../src/app/fonts'
import type { UserProfileResponse } from '../src/types/auth'
import { ActiveViewProvider } from '../src/hooks/useActiveView'
import { ToastProvider } from '../src/hooks/useToast'
import { MockActiveCohortProvider, type ActiveCohortParameters } from './MockActiveCohortProvider'
import { MockAuthProvider } from './MockAuthProvider'
import { adminUser, sampleCohort } from './fixtures'
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
    // Theme tokens, so the canvas turns dark with the device setting like the app does
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page', value: 'var(--color-background)' },
        { name: 'surface', value: 'var(--color-surface)' },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i } },
  },
  // Every story gets auth, an active cohort, the dashboard's active view and toasts. Override with
  // parameters.auth.user and parameters.activeCohort.
  decorators: [
    (Story, context) => {
      const auth = (context.parameters.auth ?? {}) as AuthParameters
      const user = auth.user === undefined ? adminUser : auth.user
      const cohort = (context.parameters.activeCohort ?? {
        cohorts: [sampleCohort],
        cohortId: sampleCohort.id,
      }) as ActiveCohortParameters
      return createElement(
        MockAuthProvider,
        { user },
        createElement(
          MockActiveCohortProvider,
          cohort,
          createElement(
            ActiveViewProvider,
            null,
            createElement(ToastProvider, null, createElement(Story))
          )
        )
      )
    },
  ],
}

export default preview
