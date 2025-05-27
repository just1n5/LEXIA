// Utility function para combinar clases CSS (similar a clsx)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
