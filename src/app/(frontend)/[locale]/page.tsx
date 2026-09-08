import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

import { BookingWidget } from '@/components/BookingWidget'
import { GoldExternal, TextExternal, TextLink } from '@/components/Buttons'
import { Card } from '@/components/Card'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'
import { PalmMotif, SalBranchMotif } from '@/components/Motifs'
import { RiverRule } from '@/components/RiverRule'
import { SectionHeading } from '@/components/SectionHeading'
import { StaggerGroup, StaggerItem, FadeUp } from '@/components/motion'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { CertificateCarousel } from '@/components/CertificateCarousel'
import { ArrowRight } from '@/components/icons'
import { Link } from '@/i18n/navigation'
import { DEFAULTS } from '@/lib/constants'
import {
  getDiningVenues,
  getExperiences,
  getRooms,
  getSiteSettings,
  getTestimonials,
} from '@/lib/data'
import { PLACEHOLDER } from '@/lib/images'
import { reviewsSchema } from '@/lib/jsonld'
import { resolveMedia } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'River Bank Jungle Resort | Luxury Resort in Chitwan, Nepal',
  description:
    'A riverside luxury resort in Patihani, Chitwan, on the banks of the Rapti River beside Chitwan National Park. Jeep safaris, canoe rides, fine dining and villas with plunge pools.',
  path: '/',
  isHome: true,
})

/** Fallback thumbnails for the excursion list, used until the CMS has an image. */
const EXPERIENCE_FALLBACKS = [
  PLACEHOLDER.canoe,
  PLACEHOLDER.jungle,
  PLACEHOLDER.bird,
  PLACEHOLDER.crocodile,
  PLACEHOLDER.culture,
  PLACEHOLDER.village,
  PLACEHOLDER.sunset,
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [rooms, experiences, dining, testimonials, settings] = await Promise.all([
    getRooms(),
    getExperiences(),
    getDiningVenues(),
    getTestimonials(),
    getSiteSettings().catch(() => null),
  ])

  const bookingUrl = settings?.bookingUrl ?? DEFAULTS.bookingUrl
  const virtualTourUrl = settings?.virtualTourUrl ?? DEFAULTS.virtualTourUrl

  const [featured, ...restExperiences] = experiences

  return (
    <>
      <JsonLd data={reviewsSchema(testimonials)} />

      <Hero
        video={{
          url: '/hero/river-bank-hero.mp4',
          poster: '/hero/river-bank-hero-poster.webp',
          title: 'River Bank Jungle Resort beside the Rapti River',
        }}
        slides={[
          {
            url: '/hero/slider1.webp',
            alt: 'Evening falls over River Bank Jungle Resort — the main lodge and pool at dusk',
          },
          {
            url: '/hero/slider3.webp',
            alt: 'The swimming pool at blue hour, palms reflected in still water',
          },
          {
            url: '/hero/slider2.webp',
            alt: 'Twin villa wings glowing at dusk across the resort lawns',
          },
          {
            url: '/hero/riverside.webp',
            alt: 'Guests at breakfast on the terrace above the Rapti River',
          },
          {
            url: '/hero/slider6.webp',
            alt: 'Deluxe twin room with carved timber ceiling and Tibetan tiger rug',
          },
          {
            url: '/hero/riverbank.webp',
            alt: 'The resort at night from above, beside the dark ribbon of the Rapti',
          },
        ]}
        label="Patihani · Chitwan National Park · Nepal"
        title={
          <>
            Where the Rapti <em>slows</em>,<br />
            the jungle begins
          </>
        }
        subtitle="A riverside lodge on the quiet side of Chitwan — safari mornings, slow afternoons, dinner under the Terai sky."
      >
        <BookingWidget bookingUrl={bookingUrl} />
        <TextExternal href={virtualTourUrl} light>
          Walk Through in 360°
        </TextExternal>
      </Hero>

      <section className="grain relative z-20 -mt-1 border-y border-sage-dark/30 bg-ivory shadow-[0_12px_30px_-24px_rgba(32,55,45,0.6)]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-[1.25fr_1fr_1fr] md:items-center md:gap-8 md:py-7">
          <div>
            <p className="kicker mb-2">Plan your stay</p>
            <h2 className="display text-2xl sm:text-3xl">Your time by the Rapti starts here.</h2>
          </div>
          <p className="text-sm leading-7 text-espresso/65">
            Check our best available rates, choose your room and let us arrange the river, safari and airport pickup.
          </p>
          <GoldExternal href={bookingUrl} className="w-full md:w-auto">Check availability</GoldExternal>
        </div>
      </section>

      <section aria-label="Awards and guest review certificates" className="grain relative overflow-hidden border-y border-sage/40 bg-cream py-16 sm:py-20">
        {/* Left top botanical leaf accent framing the section header without encroaching on carousel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-6 -top-4 z-10 hidden h-56 w-48 sm:h-64 sm:w-56 md:h-72 md:w-64 lg:w-72 md:block opacity-75"
          style={{
            backgroundImage: "url('/textures/leaves.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'left top',
            maskImage: 'radial-gradient(ellipse at 10% 10%, black 35%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 10% 10%, black 35%, transparent 72%)',
            filter: 'drop-shadow(3px 8px 20px rgba(26,46,36,0.22))',
          }}
        />

        {/* Right top botanical leaf accent framing the section header without encroaching on carousel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-4 z-10 hidden h-56 w-48 sm:h-64 sm:w-56 md:h-72 md:w-64 lg:w-72 md:block opacity-75"
          style={{
            backgroundImage: "url('/textures/leaves.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'right top',
            maskImage: 'radial-gradient(ellipse at 90% 10%, black 35%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 90% 10%, black 35%, transparent 72%)',
            filter: 'drop-shadow(-3px 8px 20px rgba(26,46,36,0.22))',
          }}
        />

        <div className="relative z-20 mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6">
          <p className="kicker mb-2">Verified Guest Recognition</p>
          <h2 className="display text-[clamp(1.9rem,3.8vw,3rem)]">
            Awarded by the world&rsquo;s <em className="italic">most trusted</em> travel platforms
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-espresso/70 sm:text-sm">
            Official 2026 guest review certificates celebrating exceptional hospitality, riverside comfort and unforgettable Chitwan safaris.
          </p>
          <RiverRule className="mx-auto mt-6" />
        </div>

        <div className="relative z-20">
          <CertificateCarousel />
        </div>
      </section>

      {/* The property — asymmetric editorial spread */}
      <section className="grain relative overflow-hidden bg-ivory py-24 md:py-32">
        <SalBranchMotif className="absolute -top-6 right-0 hidden h-44 text-gold opacity-[0.14] lg:block" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
          <FadeUp className="lg:col-span-5 lg:pr-6">
            <p className="kicker mb-4">The Property</p>
            <h2 className="display text-[clamp(2rem,4.2vw,3.4rem)]">
              A riverside address in Nepal&rsquo;s <em className="italic">first</em> national park
            </h2>
            <RiverRule className="mt-6" />
            <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-espresso/70">
              <p>
                River Bank sits in Patihani, on the stretch of the Rapti most visitors never see. The lawns
                end at the water; the water ends at the sal forest of Chitwan National Park. Mornings begin
                with mist and the call of peafowl, and end beside a fire with the jungle at your back.
              </p>
              <p>
                Twenty-two air-conditioned rooms, suites and villas face the river and the grasslands beyond.
                Every stay is built around the park — jeeps at first light, dugout canoes drifting past
                basking gharials, Tharu villages a short walk from the gate.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <TextLink href="/about">Our Story</TextLink>
              <TextLink href="/experiences">Days in the Park</TextLink>
            </div>
          </FadeUp>

          <div className="relative lg:col-span-7">
            <FadeUp delay={0.1} className="relative aspect-[4/5] overflow-hidden lg:ml-14">
              <Image
                src="/hero/slider3.webp"
                alt="The resort pool at blue hour, palms reflected in still water"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="img-grade object-cover"
              />
            </FadeUp>
            <FadeUp
              delay={0.25}
              className="relative -mt-20 w-3/5 border-8 border-ivory lg:absolute lg:-bottom-14 lg:left-0 lg:mt-0 lg:w-[46%]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={PLACEHOLDER.rhino}
                  alt="Greater one-horned rhinoceros grazing near the riverbank"
                  fill
                  sizes="(max-width: 1024px) 60vw, 25vw"
                  className="img-grade object-cover"
                />
              </div>
              <p className="mt-3 font-serif text-[15px] italic text-espresso/60">
                The neighbours: nearly 700 one-horned rhinos live across the water.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-cream py-24 md:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="The River Bank Experience"
            title={<>Stay close to nature. <em className="italic">Choose your rhythm.</em></>}
            intro="A quiet stay becomes a richer one here: settle into a private villa, share a meal with the river beside you, then follow the park wherever it leads."
          />
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                label: 'Stay',
                title: 'Rooms & private villas',
                href: '/rooms',
                image: resolveMedia(rooms[0]?.gallery?.[0]?.image, 'card') ?? {
                  url: PLACEHOLDER.villa,
                  alt: 'Private villa at River Bank Jungle Resort',
                  width: 1600,
                  height: 1067,
                },
                copy: 'Air-conditioned rooms and plunge-pool villas shaped around slow mornings and jungle light.',
              },
              {
                label: 'Dine',
                title: 'The table by the river',
                href: '/dining',
                image: resolveMedia(dining[0]?.image, 'card') ?? {
                  url: PLACEHOLDER.dining,
                  alt: 'Dining by the river at River Bank Jungle Resort',
                  width: 1600,
                  height: 1067,
                },
                copy: 'Nepali, Indian, Japanese and Continental flavours served indoors, outdoors and beside the water.',
              },
              {
                label: 'Experience',
                title: 'The park beyond the gate',
                href: '/experiences',
                image: resolveMedia(featured?.image, 'card') ?? {
                  url: PLACEHOLDER.jeep,
                  alt: 'Jungle safari experience near River Bank Jungle Resort',
                  width: 1600,
                  height: 1067,
                },
                copy: 'Jeep safaris, canoe rides, birding and Tharu culture, guided by people who know this landscape intimately.',
              },
            ].map((tile) => (
              <Link key={tile.label} href={tile.href} className="group block">
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden bg-forest">
                    <Image
                      src={tile.image.url}
                      alt={tile.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="img-grade object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/80 to-transparent px-5 pb-5 pt-20">
                      <p className="kicker-light mb-2">{tile.label}</p>
                      <h3 className="font-serif text-3xl font-light text-ivory">{tile.title}</h3>
                    </div>
                  </div>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-espresso/65">{tile.copy}</p>
                  <span className="link-line mt-4">Discover {tile.label}</span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      {rooms.length > 0 && (
        <section className="grain relative overflow-hidden bg-cream py-24 md:py-32">
          <PalmMotif className="absolute -bottom-10 -left-8 hidden h-72 text-gold opacity-[0.12] lg:block" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              label="Stay"
              title={
                <>
                  Twenty-two rooms, <em className="italic">one</em> river
                </>
              }
              intro="Marble floors, balconies over the water, walk-in showers and villas with private plunge pools — every key faces the jungle."
              aside={
                <div className="mt-5">
                  <TextLink href="/rooms">All Rooms &amp; Rates</TextLink>
                </div>
              }
            />
            <StaggerGroup className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {rooms.slice(0, 3).map((room, i) => (
                <StaggerItem key={room.id} className={i === 1 ? 'lg:translate-y-10' : ''}>
                  <Card
                    image={
                      resolveMedia(room.gallery?.[0]?.image, 'card') ?? {
                        url: [PLACEHOLDER.room, PLACEHOLDER.roomAlt, PLACEHOLDER.villa][i % 3],
                        alt: room.title,
                        width: 1600,
                        height: 1067,
                      }
                    }
                    title={room.title}
                    description={room.shortDescription}
                    href={`/rooms/${room.slug}`}
                    meta={
                      room.priceFrom?.amount
                        ? `From ${room.priceFrom.currency ?? 'USD'} ${room.priceFrom.amount} / night`
                        : undefined
                    }
                  />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* Experiences — one feature plate + an index of the rest */}
      {experiences.length > 0 && featured && (
        <section className="grain relative overflow-hidden bg-ivory py-24 md:py-32">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              label="The Park"
              title={
                <>
                  Days on the water, in the grass, <em className="italic">on foot</em>
                </>
              }
              intro="Every excursion is led by naturalists who grew up on this stretch of the Rapti — most learned the river before they learned to drive."
            />
            <div className="grid gap-12 lg:grid-cols-12">
              <FadeUp className="lg:col-span-6">
                <Link href="/experiences" className="group block" aria-label={featured.title}>
                  <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/3] lg:aspect-[3/4]">
                    <Image
                      src={resolveMedia(featured.image, 'hero')?.url ?? PLACEHOLDER.jeep}
                      alt={resolveMedia(featured.image, 'hero')?.alt ?? featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="img-grade object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-5">
                    {featured.duration && (
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.26em] text-clay">
                        {featured.duration}
                      </p>
                    )}
                    <h3 className="display text-3xl">
                      <span className="title-underline pb-0.5">{featured.title}</span>
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-[1.7] text-espresso/65">
                      {featured.shortDescription}
                    </p>
                  </div>
                </Link>
              </FadeUp>

              <FadeUp delay={0.15} className="lg:col-span-6">
                <ul className="border-t border-espresso/10">
                  {restExperiences.slice(0, 7).map((exp, index) => {
                    const thumb = resolveMedia(exp.image, 'thumbnail')
                    return (
                      <li key={exp.id}>
                        <Link
                          href="/experiences"
                          className="grain group relative flex items-center gap-4 border-b border-espresso/10 py-4 transition-colors duration-200 hover:bg-cream/60 sm:gap-5 sm:px-3"
                        >
                          <span className="absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 bg-sage-dark transition-transform duration-200 group-hover:scale-y-100" />

                          <span className="w-6 shrink-0 self-start pt-1 text-xs font-semibold tabular-nums tracking-[0.12em] text-sage-dark">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <div className="grain relative h-16 w-16 shrink-0 overflow-hidden bg-cream sm:h-[4.5rem] sm:w-[4.5rem]">
                            <Image
                              src={
                                thumb?.url ??
                                EXPERIENCE_FALLBACKS[index % EXPERIENCE_FALLBACKS.length]
                              }
                              alt=""
                              fill
                              sizes="72px"
                              className="img-grade object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-serif text-lg font-light leading-snug text-espresso transition-colors group-hover:text-sage-dark sm:text-xl">
                              {exp.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-espresso/60">
                              {exp.shortDescription}
                            </p>
                            {exp.duration && (
                              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.13em] text-espresso/45 sm:hidden">
                                {exp.duration}
                              </p>
                            )}
                          </div>

                          <div className="hidden shrink-0 items-center gap-3 sm:flex">
                            {exp.duration && (
                              <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.13em] text-espresso/45">
                                {exp.duration}
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-sage-dark opacity-35 transition-opacity duration-200 group-hover:opacity-100" />
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-8">
                  <TextLink href="/experiences">Every Excursion</TextLink>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      )}

      {/* Dining band */}
      {dining.length > 0 && (
        <section className="grain grain-dark relative overflow-hidden bg-espresso py-24 text-ivory md:py-32">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              label="The Table"
              title={
                <>
                  Four tables <em className="italic">by the river</em>
                </>
              }
              intro="Nepali, Indian, Japanese and Continental kitchens — served in the restaurant, on the lawn, or on the bank with your feet near the water."
              dark
              aside={
                <div className="mt-5">
                  <TextLink href="/dining" light>
                    Dining &amp; Bar
                  </TextLink>
                </div>
              }
            />
            <StaggerGroup className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {dining.map((venue, i) => (
                <StaggerItem key={venue.id}>
                  <Card
                    dark
                    image={
                      resolveMedia(venue.image, 'card') ?? {
                        url: [PLACEHOLDER.dining, PLACEHOLDER.alfresco, PLACEHOLDER.river, PLACEHOLDER.bar][i % 4],
                        alt: venue.title,
                        width: 1600,
                        height: 1067,
                      }
                    }
                    title={venue.title}
                    description={venue.shortDescription}
                    href={`/dining/${venue.slug}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* Guest book */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden bg-espresso py-24 md:py-32">
          <Image
            src={PLACEHOLDER.sunset}
            alt=""
            fill
            sizes="100vw"
            className="img-grade object-cover opacity-15"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading label="Guest Book" title="In their words" dark align="center" />
            <FadeUp>
              <TestimonialCarousel
                items={testimonials.map((t) => ({
                  id: t.id,
                  quote: t.quote,
                  guestName: t.guestName,
                  country: t.country,
                  source: t.source,
                  rating: t.rating ?? 5,
                  sourceUrl: t.sourceUrl,
                }))}
              />
            </FadeUp>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-espresso py-28 text-center md:py-36">
        <Image
          src={PLACEHOLDER.terrace}
          alt=""
          fill
          sizes="100vw"
          className="img-grade object-cover opacity-20"
          aria-hidden="true"
        />
        <FadeUp className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="kicker-light mb-5">Reservations</p>
          <h2 className="display !text-ivory text-[clamp(2.2rem,5vw,4rem)]">
            The river is an <em className="italic text-gold">early riser</em>
          </h2>
          <RiverRule className="mx-auto mt-7" />
          <p className="mx-auto mt-7 max-w-xl text-[15px] leading-[1.85] text-ivory/70">
            So is the safari jeep. Book direct for the best rate and we&rsquo;ll have the permits, the
            airport pickup and the first pot of tea arranged before you arrive.
          </p>
          <div className="mt-11 flex flex-col items-center justify-center gap-7 sm:flex-row sm:gap-10">
            <GoldExternal href={bookingUrl}>Book Now</GoldExternal>
            <TextLink href="/contact" light>
              Talk to Us
            </TextLink>
          </div>
        </FadeUp>
      </section>
    </>
  )
}
