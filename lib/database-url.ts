const SSL_MODE_ALIASES = new Set(["prefer", "require", "verify-ca"])

export function normalizeDatabaseUrl(connectionString?: string | null) {
  if (!connectionString) {
    return connectionString ?? undefined
  }

  const trimmedConnectionString = connectionString.trim()

  try {
    const parsedUrl = new URL(trimmedConnectionString)
    const sslMode = parsedUrl.searchParams.get("sslmode")

    if (sslMode && SSL_MODE_ALIASES.has(sslMode)) {
      parsedUrl.searchParams.set("sslmode", "verify-full")
      return parsedUrl.toString()
    }
  } catch {
    return trimmedConnectionString
  }

  return trimmedConnectionString
}
