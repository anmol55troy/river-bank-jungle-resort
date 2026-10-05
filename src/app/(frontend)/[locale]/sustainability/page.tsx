import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'

import { GoldLink } from '@/components/Buttons'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/SectionHeading'
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/motion'
import { PLACEHOLDER } from '@/lib/images'
import { breadcrumbSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Sustainability',
  description:
    'How River Bank Jungle Resort protects the Rapti riverbank and supports the Patihani community — local hiring, plastic reduction, solar heating and responsible safaris.',
  path: '/sustainability',
})

const pillars = [
  {
    title: 'Environmental Responsibility',
    body: 'We protect the riverbank, preserve natural habitat and make thoughtful choices that help the ecosystem around Chitwan thrive.',
    image: '/sustainability/plant-9.png',
  },
  {
    title: 'Corporate Social Responsibility',
    body: 'Our team and local partners are part of the same community. We believe responsible hospitality should create a better place for everyone.',
    image: '/sustainability/plant-8.png',
  },
  {
    title: 'Organic Farm',
    body: 'Our organic gardens supply fresh ingredients for chef-crafted meals, with natural growing methods and seasonal planting enriching the soil.',
    image: '/sustainability/riverbank.png',
  },
  {
    title: 'Rainwater Harvest',
    body: 'Rainwater harvesting helps us use the monsoon generously and responsibly, reducing pressure on local water resources throughout the year.',
    image: '/sustainability/earth.png',
  },
]

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const settings = await getSiteSettings().catch(() => null)
return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Sustainability', path: '/sustainability' },
        ])}
      />
      <Hero
        size="banner"
        image={resolveMedia(settings?.sustainabilityBanner, 'hero') ?? { url: PLACEHOLDER.sustainability, alt: 'Morning light over the river and grassland' }}
        label="Responsible Travel"
        title="Sustainability"
        subtitle="The park gives us everything. This is how we give back."
      />

      <section className="grain bg-ivory py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Commitment to a greener tomorrow"
            title={<>It is not something we do. <em className="italic">It is who we are.</em></>}
            intro="At River Bank, environmental responsibility begins with our organic farm and extends through waste reduction, rainwater harvesting and wildlife conservation."
          />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <FadeUp className="grain relative aspect-[4/3] overflow-hidden bg-cream lg:col-span-7">
              <Image
                src="/sustainability/ecosystem.png"
                alt="River Bank Jungle Resort's sustainability ecosystem"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-5 sm:p-10"
              />
            </FadeUp>
            <FadeUp delay={0.1} className="lg:col-span-5">
              <p className="text-[15px] leading-[1.9] text-espresso/70">
                Explore our gardens, where herbs naturally protect our crops and seasonal rotations enrich the soil. We reduce waste through recycling, composting and biodegradable amenities, while working with local conservation partners to preserve the habitat that makes Chitwan extraordinary.
              </p>
              <div className="mt-8 relative h-28 w-56">
                <Image src="/sustainability/pillars.png" alt="Four sustainability pillars" fill sizes="224px" className="object-contain object-left" />
              </div>
            </FadeUp>
          </div>

          <StaggerGroup className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full border-t border-espresso/15 pt-5">
                  <div className="relative mb-5 h-24 w-28">
                    <Image src={item.image} alt="" fill sizes="112px" className="object-contain object-left" />
                  </div>
                  <h3 className="font-serif text-2xl text-espresso">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-espresso/68">{item.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <FadeUp className="mt-14 text-center">
            <GoldLink href="/experiences">Experience the Park Responsibly</GoldLink>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
