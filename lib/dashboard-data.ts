import {
  FolderKanban,
  UserCheck,
  MapPin,
  Stamp,
  type LucideIcon,
} from 'lucide-react'

export const NAIRA = 'NGN '

export type Kpi = {
  label: string
  value: string
  delta: string
  trend: 'up' | 'flat'
  icon: LucideIcon
  tone: 'green' | 'teal' | 'blue' | 'pink'
  progress: number
}

export const KPIS: Kpi[] = [
  {
    label: 'Indexed Files',
    value: '4,297',
    delta: '+12%',
    trend: 'up',
    icon: FolderKanban,
    tone: 'green',
    progress: 72,
  },
  {
    label: 'Recertified Customers',
    value: '0',
    delta: '0%',
    trend: 'flat',
    icon: UserCheck,
    tone: 'teal',
    progress: 4,
  },
  {
    label: 'Registered Plots',
    value: '107',
    delta: '+8%',
    trend: 'up',
    icon: MapPin,
    tone: 'blue',
    progress: 34,
  },
  {
    label: 'Registered Instruments',
    value: '0',
    delta: '0%',
    trend: 'flat',
    icon: Stamp,
    tone: 'pink',
    progress: 3,
  },
]

export type FinanceItem = {
  kind: 'bill' | 'payment'
  title: string
  amount: string
  detail: string
}

export const FINANCE: FinanceItem[] = [
  { kind: 'bill', title: 'Bills (March 2017)', amount: `${NAIRA}0.00`, detail: '0 bills' },
  { kind: 'payment', title: 'Payments (March 2017)', amount: `${NAIRA}0.00`, detail: '0 payments' },
  { kind: 'bill', title: 'Bills (April 2017)', amount: `${NAIRA}530,000`, detail: '106 bills' },
  { kind: 'payment', title: 'Payments (April 2017)', amount: `${NAIRA}0.00`, detail: '0 payments' },
  { kind: 'bill', title: 'Bills (May 2017)', amount: `${NAIRA}5,000`, detail: '1 bill' },
  { kind: 'payment', title: 'Payments (May 2017)', amount: `${NAIRA}0.00`, detail: '0 payments' },
]

export type Staff = {
  name: string
  status: string
  activity: string
  state: 'active' | 'away'
  color: string
}

export const STAFF: Staff[] = [
  { name: 'Adaeze Okoro', status: 'Active', activity: 'Processing files', state: 'active', color: 'bg-chart-1 text-primary-foreground' },
  { name: 'Emeka Uche', status: 'Away', activity: 'Lunch break', state: 'away', color: 'bg-chart-2 text-primary-foreground' },
  { name: 'Uche Okonkwo', status: 'Active', activity: 'Site inspection', state: 'active', color: 'bg-chart-4 text-primary-foreground' },
  { name: 'Ada Amaka', status: 'Active', activity: 'Reviewing docs', state: 'active', color: 'bg-chart-3 text-primary-foreground' },
]

export type Application = {
  type: string
  fileNo: string
  status: 'Approved' | 'Pending' | 'Processing'
  when: string
  applicant: string
  initials: string
  location: string
  sqm: string
  price: string
  progress: number
}

export const APPLICATIONS: Application[] = [
  {
    type: 'Plot Allocation',
    fileNo: 'LABA/157',
    status: 'Approved',
    when: '2h ago',
    applicant: 'Chukwuemeka Obi',
    initials: 'CO',
    location: 'Zone A, Block 14, Plot 7',
    sqm: '500 sqm',
    price: `${NAIRA}45,000`,
    progress: 100,
  },
  {
    type: 'Recertification',
    fileNo: 'LABA/142',
    status: 'Pending',
    when: '5h ago',
    applicant: 'Ngozi Adaeze',
    initials: 'NA',
    location: 'Zone B, Block 8, Plot 23',
    sqm: '750 sqm',
    price: `${NAIRA}120,000`,
    progress: 55,
  },
  {
    type: 'Instrument Registration',
    fileNo: 'LABA/138',
    status: 'Processing',
    when: '1d ago',
    applicant: 'Chukwueze John',
    initials: 'CJ',
    location: 'Zone C, Block 3, Plot 12',
    sqm: '1,200 sqm',
    price: `${NAIRA}85,000`,
    progress: 40,
  },
]

export const PENDING_FILES = [
  { fileNo: 'LABA/189', task: 'Plot Survey - Zone D', age: '2d', tone: 'text-chart-4' },
  { fileNo: 'LABA/176', task: 'RofO Generation', age: '5d', tone: 'text-chart-2' },
  { fileNo: 'LABA/171', task: 'Recertification Review', age: '6d', tone: 'text-chart-3' },
  { fileNo: 'LABA/168', task: 'Instrument Capture', age: '8d', tone: 'text-chart-5' },
  { fileNo: 'LABA/160', task: 'Legal Search', age: '9d', tone: 'text-chart-1' },
]

export const TASKS = [
  { title: 'Interview', time: 'Sep 15, 08:30', done: true },
  { title: 'Team Meeting', time: 'Sep 15, 10:30', done: true },
  { title: 'Project Update', time: 'Sep 15, 15:00', done: true },
  { title: 'Discuss Q3 Goals', time: 'Sep 15, 16:45', done: false },
  { title: 'HR Policy Review', time: 'Sep 15, 18:30', done: false },
]

export const LAND_DISTRIBUTION = [
  { name: 'Residential', value: 65, color: 'var(--chart-1)' },
  { name: 'Commercial', value: 20, color: 'var(--chart-2)' },
  { name: 'Industrial', value: 10, color: 'var(--chart-3)' },
  { name: 'Other', value: 5, color: 'var(--muted-foreground)' },
]

export const REVENUE_TREND = [
  { month: 'Jan', value: 32 },
  { month: 'Feb', value: 24 },
  { month: 'Mar', value: 45 },
  { month: 'Apr', value: 68 },
  { month: 'May', value: 20 },
  { month: 'Jun', value: 62 },
]

// Statistics area chart — hourly registry activity vs. target trend line.
export const STATS_HOURLY = [
  { hour: '7 am', value: 8, trend: 6 },
  { hour: '8 am', value: 14, trend: 10 },
  { hour: '9 am', value: 40, trend: 18 },
  { hour: '10 am', value: 22, trend: 30 },
  { hour: '11 am', value: 15, trend: 42 },
  { hour: '12 am', value: 20, trend: 52 },
  { hour: '1 pm', value: 30, trend: 60 },
  { hour: '2 pm', value: 48, trend: 68 },
  { hour: '3 pm', value: 40, trend: 74 },
  { hour: '4 pm', value: 55, trend: 80 },
  { hour: '5 pm', value: 32, trend: 84 },
  { hour: '6 pm', value: 26, trend: 86 },
  { hour: '7 pm', value: 38, trend: 87 },
  { hour: '8 pm', value: 30, trend: 84 },
  { hour: '9 pm', value: 18, trend: 78 },
  { hour: '10 pm', value: 12, trend: 68 },
]

export const WORK_WEEK = [
  { day: 'S', value: 2 },
  { day: 'M', value: 3 },
  { day: 'T', value: 2.4 },
  { day: 'W', value: 5.38 },
  { day: 'T', value: 1.2 },
  { day: 'F', value: 1.6 },
  { day: 'S', value: 1 },
]

export const ONBOARDING = [
  { label: '30%', value: 30 },
  { label: '25%', value: 25 },
  { label: '0%', value: 6 },
  { label: 'Task', value: 62 },
]
