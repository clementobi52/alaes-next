'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, LogIn } from 'lucide-react'

const slides = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-O5jLIM4ShGWw0Fz1LxTPHKZnYW48UB.jpeg', alt: 'Ministry of Land and Physical Planning office entrance', title: 'A smarter future for land administration', copy: 'Trusted digital services for people, professionals and institutions across Abia State.' },
  { src: '/landing/land-office-1.png', alt: 'Modern land ministry office exterior', title: 'Land services, connected', copy: 'Bring applications, records and approvals into one transparent workspace.' },
  { src: '/landing/land-office-2.png', alt: 'Land registry records office', title: 'Records you can rely on', copy: 'Protect the history of land with secure, searchable and auditable records.' },
  { src: '/landing/land-office-3.png', alt: 'Land surveyors reviewing a site plan', title: 'Decisions grounded in evidence', copy: 'Coordinate survey, valuation and planning teams with shared information.' },
  { src: '/landing/land-office-4.png', alt: 'Planned Nigerian city neighborhood', title: 'Building Abia together', copy: 'Support clear ownership, responsible development and better public service.' },
]

export default function SignInLandingPage() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500)
    return () => window.clearInterval(timer)
  }, [])

  const slide = slides[active]

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {slides.map((item, index) => (
        <Image key={item.src} src={item.src} alt={item.alt} fill priority={index === 0} sizes="100vw" className={`object-cover transition-opacity duration-1000 ${index === active ? 'opacity-100' : 'opacity-0'}`} unoptimized={item.src.startsWith('http')} />
      ))}
      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-transparent to-slate-950/70" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <Link href="/sign-in" aria-label="ALAES home" className="flex items-center gap-3"><Image src="/images/alaes-logo.png" alt="ALAES" width={164} height={48} className="h-10 w-auto object-contain drop-shadow-lg" priority /></Link>
        <Link href="/sign-in/login" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"><LogIn className="size-4" /> Login</Link>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-96px)] items-end px-6 pb-20 sm:px-10 lg:px-16 lg:pb-24">
        <div className="max-w-2xl"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-white/80">Abia Land Administration Enterprise System</p><h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">{slide.title}</h1><p className="mt-5 max-w-xl text-pretty text-base leading-7 text-white/85 sm:text-lg">{slide.copy}</p><Link href="/sign-in/login" className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">Enter the platform <ArrowRight className="size-4" /></Link></div>
      </section>

      <div className="absolute bottom-7 right-6 z-10 flex items-center gap-3 sm:right-10 lg:right-16"><button type="button" aria-label="Previous slide" onClick={() => setActive((active - 1 + slides.length) % slides.length)} className="rounded-full border border-white/40 bg-black/20 p-2 backdrop-blur hover:bg-white/20"><ChevronLeft className="size-4" /></button><div className="flex gap-2" aria-label="Slide navigation">{slides.map((item, index) => <button key={item.src} type="button" aria-label={`Go to slide ${index + 1}`} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${index === active ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />)}</div><button type="button" aria-label="Next slide" onClick={() => setActive((active + 1) % slides.length)} className="rounded-full border border-white/40 bg-black/20 p-2 backdrop-blur hover:bg-white/20"><ChevronRight className="size-4" /></button></div>
      <p className="absolute bottom-7 left-6 z-10 text-xs text-white/70 sm:left-10 lg:left-16">Official digital services platform · Abia State</p>
    </main>
  )
}
