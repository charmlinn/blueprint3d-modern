import { getRequestConfig } from 'next-intl/server'
import { routing, SupportedLanguage } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as SupportedLanguage)) {
    locale = routing.defaultLocale
  }

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale: locale as string,
    messages,
    onError: () => null
  }
})
