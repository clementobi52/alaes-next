'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  HERO_SLIDES,
  NAIRA,
  PORTAL_FEATURES,
  PORTAL_STATS,
  TOKEN_PACKAGES,
} from '@/lib/phs-portal-data'
import { usePortal } from '@/components/phs/phs-store'
import { PublicFooter, PublicHeader } from '@/components/phs/phs-chrome'

const ACCENT_RING: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
}

function HeroSlider({ onGetStarted }: { onGetStarted: () => void }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])
  const slide = HERO_SLIDES[index]
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.accent} transition-[background] duration-700`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col items-start justify-center px-4 py-20 sm:px-6 lg:px-8">
        <span className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/25">
          Abia State Government
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          {slide.title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg text-white/85">{slide.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#packages"
            className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View Packages
          </a>
        </div>
        <div className="mt-10 flex items-center gap-3">
          <button type="button" aria-label="Previous slide" onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
          <button type="button" aria-label="Next slide" onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)} className="rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export function PhsLanding() {
  const { setView } = usePortal()
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <HeroSlider onGetStarted={() => setView('register')} />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {PORTAL_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-emerald-700 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance">Everything institutions need to run land searches</h2>
          <p className="mt-3 text-slate-600 text-pretty">
            A secure, government-backed platform built for banks, law firms, and corporate teams.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PORTAL_FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="packages" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-balance">Simple, transparent token packages</h2>
            <p className="mt-3 text-slate-600 text-pretty">Each search costs one token. Buy once, use anytime — no recurring fees.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOKEN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${pkg.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    POPULAR
                  </span>
                )}
                <span className={`flex h-16 w-16 items-center justify-center rounded-full ${ACCENT_RING[pkg.accent]}`}>
                  <pkg.icon className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-2xl font-bold">{pkg.name}</h3>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">{NAIRA.format(pkg.price)}</p>
                <p className="mt-1 text-sm text-slate-500">{pkg.tokens.toLocaleString()} Tokens</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{pkg.tokens.toLocaleString()} legal searches</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />Printable search reports</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />Team access &amp; roles</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition-colors ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-700 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-balance">Ready to run your first legal search?</h2>
          <p className="mt-3 text-emerald-100 text-pretty">Register your institution today and get 100 free tokens to explore the platform.</p>
          <button
            type="button"
            onClick={() => setView('register')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-800 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Register Your Institution <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
