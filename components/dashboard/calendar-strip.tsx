const DAYS = [
  { name: 'Mon', date: 22 },
  { name: 'Tue', date: 23 },
  { name: 'Wed', date: 24 },
  { name: 'Thu', date: 25 },
  { name: 'Fri', date: 26 },
  { name: 'Sat', date: 27 },
  { name: 'Sun', date: 28 },
]

export function CalendarStrip() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="text-sm text-muted-foreground">August</span>
        <h2 className="text-xl font-bold">September 2024</h2>
        <span className="text-sm text-muted-foreground">October</span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {DAYS.map((d) => (
          <div key={d.date}>
            <p className="text-xs text-muted-foreground">{d.name}</p>
            <p className="mt-1 text-2xl font-semibold">{d.date}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-chart-1 to-chart-1/80 px-5 py-4 text-primary-foreground">
        <span className="font-semibold">Weekly Team Sync</span>
        <div className="flex -space-x-2">
          {['AO', 'EU', 'AA'].map((i) => (
            <span
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-chart-1 bg-primary-foreground/90 text-xs font-semibold text-chart-1"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
