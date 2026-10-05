import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Run on all paths except admin/API, uploaded media, Next internals and static files
  matcher: ['/((?!api|admin|media|_next|_vercel|.*\\..*).*)'],
}
