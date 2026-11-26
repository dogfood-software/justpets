import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine class names into the final form for the browser to consume efficiently, including optional and dynamic classes.
 * Use {@link cnAria} for React-Aria or HeroUI components that support functions for class names based on component state.
 * @example
 * ```tsx
 * const className = cn("bg-red-500", "text-white", "p-4", "rounded-md", {
 *   "bg-blue-500": isBlue,
 *   "bg-green-500": isGreen,
 * }, isHidden && "hidden");
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Same as {@link cn}, but for React-Aria or HeroUI components that support functions for class names based on component state
 *
 * @example
 * ```tsx
 * import { Button } from "@web/ui"
 * <Button className={cnAria(({ isLoading }) => isLoading && "opacity-50"), "bg-blue-500", isWhite && "text-white"}>
 * ```
 */
export function cnAria<T>(...inputs: (ClassValue | ((props: T) => ClassValue))[]) {
  return (props: T) => cn(...inputs.map((c) => (typeof c === 'function' ? c(props) : c)))
}
