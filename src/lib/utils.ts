import { API } from "@/config/api"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | undefined | null) {
  if (!path) return ""
  const trimmedPath = path.trim()
  if (trimmedPath.startsWith("http")) return trimmedPath
  
  // Ensure the path doesn't start with / if the base ends with /
  const cleanPath = trimmedPath.startsWith("/") ? trimmedPath.substring(1) : trimmedPath
  const baseUrl = API.ASSETS_URL?.endsWith("/") ? API.ASSETS_URL : `${API.ASSETS_URL}/`
  
  return `${baseUrl}${cleanPath}`
}
