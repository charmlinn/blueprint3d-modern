import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing, SupportedLanguage } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as SupportedLanguage)) {
    notFound()
  }

  setRequestLocale(locale as SupportedLanguage)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          classNames: {
            toast: 'bg-card text-foreground border border-border rounded-lg shadow-lg',
            success: '!bg-card !border-primary !text-primary',
            error: '!bg-card !border-destructive !text-destructive'
          }
        }}
      />
    </NextIntlClientProvider>
  )
}
