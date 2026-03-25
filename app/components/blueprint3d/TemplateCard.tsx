'use client'

import { TemplateOption } from "@/lib/blueprint-templates"
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface TemplateCardProps {
  template: TemplateOption
  onClick: (template: TemplateOption) => void
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const t = useTranslations('BluePrint.Component.FloorPlanDesign.TemplateSelector')

  return (
    <button
      onClick={() => onClick(template)}
      className="group relative w-full overflow-hidden rounded-lg border-2 border-border bg-card transition-all hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {/* Preview Image */}
      <div className="relative aspect-[1/1] w-full overflow-hidden bg-muted">
        <Image
          src={template.preview}
          fill
          alt={t(`templates.${template.id}.name`)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-left">
        <p className="text-lg font-semibold text-card-foreground group-hover:text-primary tracking-wider">
          {t(`templates.${template.id}.name`)}
        </p>
        <span className="mt-1 text-sm text-muted-foreground">
          {t(`templates.${template.id}.description`)}
        </span>
      </div>
    </button>
  )
}
