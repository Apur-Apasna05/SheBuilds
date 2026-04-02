export function readStorageString(key, fallback = '') {
  try {
    const v = window.localStorage.getItem(key)
    return v === null ? fallback : v
  } catch {
    return fallback
  }
}

export function readStorageBoolean(key, fallback = false) {
  try {
    const v = window.localStorage.getItem(key)
    if (v === null) return fallback
    return v === 'true' || v === 'on' || v === '1'
  } catch {
    return fallback
  }
}

export function writeStorageString(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function writeStorageBoolean(key, value) {
  writeStorageString(key, value ? 'true' : 'false')
}

