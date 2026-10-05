/**
 * Add the extra journal posts to an existing database (skips ones already
 * present). Run with: pnpm seed:blogs
 */
import { seedExtraBlogs } from './extra-blogs'

const run = async () => {
  await seedExtraBlogs()
  console.log('Extra blogs done.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Adding blogs failed:', err)
  process.exit(1)
})
