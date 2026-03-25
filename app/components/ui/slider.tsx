'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { Loader2 } from 'lucide-react'

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    hiddenThumb?: boolean
    loading?: boolean
    trackClassName?: string
    thumbClassName?: string
    rangeClassName?: string
  }
>(
  (
    {
      className,
      hiddenThumb = false,
      loading = false,
      trackClassName,
      thumbClassName,
      rangeClassName,
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative cursor-pointer flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20',
          trackClassName
        )}
      >
        <SliderPrimitive.Range className={cn('absolute h-full bg-primary', rangeClassName)} />
      </SliderPrimitive.Track>
      {!hiddenThumb && (
        <SliderPrimitive.Thumb
          className={cn(
            'block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            loading && 'border-transparent',
            thumbClassName
          )}
        >
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="h-5 w-5 animate-spin stroke-3 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </SliderPrimitive.Thumb>
      )}
    </SliderPrimitive.Root>
  )
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
