import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en', 'zh', 'tw'] as const
export type SupportedLanguage = (typeof locales)[number]

export const languageMap: Record<SupportedLanguage, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  tw: 'zh-TW'
}

export const routing = defineRouting({
  locales,
  defaultLocale: 'en' as SupportedLanguage,
  localePrefix: 'as-needed'
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
