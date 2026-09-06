import { AppShell } from '@/components/app-shell'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { FinancialOverview } from '@/components/dashboard/financial-overview'
import { RegistrarCard } from '@/components/dashboard/registrar-card'
import { ProgressCard } from '@/components/dashboard/progress-card'
import { TimeTracker } from '@/components/dashboard/time-tracker'
import { OnboardingCard } from '@/components/dashboard/onboarding-card'
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks'
import { RevenueTrend } from '@/components/dashboard/revenue-trend'
import { LandDistribution } from '@/components/dashboard/land-distribution'
import { CalendarStrip } from '@/components/dashboard/calendar-strip'
import { StatisticsChart } from '@/components/dashboard/statistics-chart'
import { PendingFiles } from '@/components/dashboard/pending-files'
import { StaffActivity } from '@/components/dashboard/staff-activity'
import { TotalPlotsCard } from '@/components/dashboard/total-plots-card'
import { RecentApplications } from '@/components/dashboard/recent-applications'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <KpiCards />

        <FinancialOverview />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RegistrarCard />
          <div className="flex flex-col gap-6">
            <ProgressCard />
            <TimeTracker />
          </div>
          <div className="flex flex-col gap-6">
            <OnboardingCard />
            <UpcomingTasks />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueTrend />
          <LandDistribution />
        </div>

        <CalendarStrip />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StatisticsChart />
          </div>
          <div className="flex flex-col gap-6">
            <PendingFiles />
            <StaffActivity />
            <TotalPlotsCard />
          </div>
        </div>

        <RecentApplications />
      </div>
    </AppShell>
  )
}
