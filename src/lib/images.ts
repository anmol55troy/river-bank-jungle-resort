/**
 * Placeholder imagery, served locally from /public/placeholders.
 *
 * Nature, wildlife and culture shots are real Chitwan photographs from
 * Wikimedia Commons (CC-licensed); interiors are Unsplash stock — see
 * scripts/download-placeholders source URLs in the repo history. The resort
 * replaces all of these through the CMS: every consumer resolves a media
 * relation first and only falls back to these when the collection has
 * no image yet.
 */
const local = (key: string) => `/placeholders/${key}.jpg`

export const PLACEHOLDER = {
  // — Chitwan / Rapti (Wikimedia Commons) —
  hero: local('hero'),
  river: local('river'),
  jungle: local('jungle'),
  rhino: local('rhino'),
  elephant: local('elephant'),
  bird: local('bird'),
  canoe: local('canoe'),
  crocodile: local('crocodile'),
  culture: local('culture'),
  village: local('village'),
  sunset: local('sunset'),
  about: local('about'),
  sustainability: local('sustainability'),

  // — Interiors & resort life (Unsplash) —
  jeep: local('jeep'),
  room: local('room'),
  roomAlt: local('roomAlt'),
  villa: local('villa'),
  dining: local('dining'),
  diningAlt: local('diningAlt'),
  bar: local('bar'),
  alfresco: local('alfresco'),
  pool: local('pool'),
  resort: local('resort'),
  terrace: local('terrace'),
  events: local('events'),
  yoga: local('yoga'),
} as const

export const placeholderImage = (url: string, alt: string) => ({ url, alt, width: 1600, height: 1067 })
