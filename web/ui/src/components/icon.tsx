import { config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { cn } from '@web/ui/utils/cn'

// fix overriding tailwind
config.autoAddCss = false

export function Icon({
  className,
  invertRTL = true,
  ...props
}: FontAwesomeIconProps & { invertRTL?: boolean }) {
  return <FontAwesomeIcon className={cn(invertRTL && 'rtl:rotate-y-180', className)} {...props} />
}

export type { IconDefinition, IconProp } from '@fortawesome/fontawesome-svg-core'
