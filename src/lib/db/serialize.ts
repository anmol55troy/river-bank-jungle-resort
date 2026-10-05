import mongoose from 'mongoose'

/**
 * Recursively converts MongoDB BSON documents/subdocuments/ObjectIds into
 * clean plain JavaScript objects matching the shape expected by React components
 * and Next.js serialization (e.g. converting _id to id string, Dates to ISO strings).
 */
export function serializeDoc<T = any>(doc: any): T {
  if (doc === null || doc === undefined) {
    return doc
  }

  // Handle mongoose document with toObject
  if (typeof doc.toObject === 'function') {
    doc = doc.toObject({ virtuals: true })
  }

  if (doc instanceof mongoose.Types.ObjectId) {
    return doc.toString() as unknown as T
  }

  if (doc instanceof Date) {
    return doc.toISOString() as unknown as T
  }

  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item)) as unknown as T
  }

  if (typeof doc === 'object') {
    // Leave Lexical rich text AST structures intact
    const result: Record<string, any> = {}

    for (const [key, value] of Object.entries(doc)) {
      if (key === '__v') continue

      if (key === '_id') {
        result.id = value instanceof mongoose.Types.ObjectId ? value.toString() : String(value)
      } else {
        result[key] = serializeDoc(value)
      }
    }

    if (result._id && !result.id) {
      result.id = result._id
      delete result._id
    }

    return result as T
  }

  return doc
}

export function serializeDocs<T = any>(docs: any[]): T[] {
  return docs.map((d) => serializeDoc<T>(d))
}
