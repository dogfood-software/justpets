import { config } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { cn } from "@web/ui/utils/cn";

// fix overriding tailwind
config.autoAddCss = false;

export function Icon({ className, ...props }: FontAwesomeIconProps) {
  return (
    <FontAwesomeIcon className={cn("rtl:rotate-y-180", className)} {...props} />
  );
}

export type {
  IconDefinition,
  IconProp,
} from "@fortawesome/fontawesome-svg-core";
