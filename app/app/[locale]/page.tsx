import { setRequestLocale } from 'next-intl/server'
import { Blueprint3DApp } from '@/components/blueprint3d/Blueprint3DApp'
import type { SupportedLanguage } from '@/i18n/routing'

interface HomePageProps {
  params: Promise<{ locale: SupportedLanguage }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <Blueprint3DApp config={{ isLanguageOption: true }} />
    </div>
  )
}
