import crypto from 'crypto'

/**
 * Hash password using Node.js built-in scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

/**
 * Verify password against scrypt hash
 */
export async function verifyScryptPassword(password: string, combinedHash: string): Promise<boolean> {
  const [salt, key] = combinedHash.split(':')
  if (!salt || !key) return false

  return new Promise((resolve) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false)
      try {
        const keyBuffer = Buffer.from(key, 'hex')
        resolve(crypto.timingSafeEqual(derivedKey, keyBuffer))
      } catch {
        resolve(false)
      }
    })
  })
}

/**
 * Verify legacy Payload PBKDF2 hash (25,000 iterations, sha256, 512 bytes)
 */
export function verifyLegacyPayloadPassword(password: string, salt: string, hash: string): boolean {
  try {
    const derived = crypto.pbkdf2Sync(password, salt, 25000, 512, 'sha256').toString('hex')
    const derivedBuf = Buffer.from(derived, 'hex')
    const hashBuf = Buffer.from(hash, 'hex')
    if (derivedBuf.length !== hashBuf.length) return false
    return crypto.timingSafeEqual(derivedBuf, hashBuf)
  } catch {
    return false
  }
}

/**
 * Unified password verification supporting both new scrypt and legacy Payload hashes
 */
export async function verifyPassword(
  password: string,
  user: { passwordHash?: string | null; hash?: string | null; salt?: string | null }
): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  if (user.passwordHash) {
    const valid = await verifyScryptPassword(password, user.passwordHash)
    return { valid, needsUpgrade: false }
  }

  if (user.hash && user.salt) {
    const valid = verifyLegacyPayloadPassword(password, user.salt, user.hash)
    return { valid, needsUpgrade: valid }
  }

  return { valid: false, needsUpgrade: false }
}
