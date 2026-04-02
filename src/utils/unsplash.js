const SOURCE_BASE = 'https://source.unsplash.com'

export function workerPhoto() {
  // Keep women-only: tag includes both "woman" and "working".
  return `${SOURCE_BASE}/400x400/?indian,woman,working`
}

export function categoryPhoto(categoryId) {
  // Women-only activity images.
  const map = {
    dance: `${SOURCE_BASE}/400x300/?dance,india,woman`,
    makeup: `${SOURCE_BASE}/400x300/?makeup,beauty,woman`,
    stitching: `${SOURCE_BASE}/400x300/?stitching,tailor,woman`,
    cooking: `${SOURCE_BASE}/400x300/?cooking,indian,woman`,
    painting: `${SOURCE_BASE}/400x300/?painting,art,woman`,
    tuition: `${SOURCE_BASE}/400x300/?teaching,tutor,woman,india`,
    cleaning: `${SOURCE_BASE}/400x300/?cleaning,house,india,woman`,
    pickle: `${SOURCE_BASE}/400x300/?pickle,food,woman,india`,
  }
  return map[categoryId] || `${SOURCE_BASE}/400x300/?india,skills,woman`
}

export function learnThumbnail(thumbnailId) {
  const map = {
    'hair-makeup': `${SOURCE_BASE}/400x200/?hairsalon,woman`,
    stitching: `${SOURCE_BASE}/400x200/?sewing,woman`,
    art: `${SOURCE_BASE}/400x200/?craft,art,woman`,
    pickle: `${SOURCE_BASE}/400x200/?pickle,food,woman`,
  }
  return map[thumbnailId] || `${SOURCE_BASE}/400x200/?women,craft`
}

export function storePhoto() {
  // Stores can be any; keep it visually consistent.
  return `${SOURCE_BASE}/400x300/?boutique,store,india`
}

