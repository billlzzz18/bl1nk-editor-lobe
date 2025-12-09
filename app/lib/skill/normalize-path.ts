/**
 * Normalize path for consistent cross-platform behavior
 * This handles both Unix and Windows path separators
 */
export function normalizePath(inputPath: string): string {
  let path = inputPath

  // Replace backslashes with forward slashes
  path = path.replace(/\\/g, "/")

  // Remove duplicate slashes
  path = path.replace(/\/+/g, "/")

  // Remove trailing slash (except for root)
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1)
  }

  // Handle drive letters on Windows (convert C: to C)
  if (path.length >= 2 && path[1] === ":" && path[2] === "/") {
    path = path.slice(0, 2) + path.slice(2)
  }

  return path
}

/**
 * Join path segments
 */
export function joinPath(...segments: string[]): string {
  return normalizePath(segments.join("/"))
}

/**
 * Get directory name from path
 */
export function dirname(path: string): string {
  const normalized = normalizePath(path)
  const lastSlash = normalized.lastIndexOf("/")
  
  if (lastSlash === -1) {
    return "."
  }
  
  if (lastSlash === 0) {
    return "/"
  }
  
  return normalized.slice(0, lastSlash)
}

/**
 * Get base name from path
 */
export function basename(path: string, ext?: string): string {
  const normalized = normalizePath(path)
  const lastSlash = normalized.lastIndexOf("/")
  let base = lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1)
  
  if (ext && base.endsWith(ext)) {
    base = base.slice(0, -ext.length)
  }
  
  return base
}

/**
 * Get extension from path
 */
export function extname(path: string): string {
  const base = basename(path)
  const lastDot = base.lastIndexOf(".")
  
  if (lastDot === -1 || lastDot === 0) {
    return ""
  }
  
  return base.slice(lastDot)
}

/**
 * Check if path is absolute
 */
export function isAbsolute(path: string): boolean {
  const normalized = normalizePath(path)
  
  // Unix absolute path
  if (normalized.startsWith("/")) {
    return true
  }
  
  // Windows absolute path
  if (normalized.length >= 2 && normalized[1] === ":") {
    return true
  }
  
  return false
}

/**
 * Resolve relative path to absolute
 */
export function resolve(from: string, to: string): string {
  if (isAbsolute(to)) {
    return normalizePath(to)
  }
  
  const fromDir = dirname(from)
  return normalizePath(joinPath(fromDir, to))
}
