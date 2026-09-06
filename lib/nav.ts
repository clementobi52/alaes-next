import {
  Home,
  Users,
  FolderOpen,
  Archive,
  Compass,
  ListChecks,
  Info,
  Database,
  Stamp,
  Search,
  LandPlot,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  children?: string[]
}

/**
 * ALAES module tree, transcribed from the enterprise-system spec document.
 * Top-level modules map to sidebar sections; children render as sub-links.
 */
export const NAV: NavItem[] = [
  { label: 'Dashboard', icon: Home },
  {
    label: 'Customer Relationship Management',
    icon: Users,
    children: [
      'Person',
      'Individual',
      'Group',
      'Multiple Owners',
      'Corporate',
      'Customer Manager',
      'Appointment',
      'Appointment Calendar',
    ],
  },
  {
    label: 'DMS',
    icon: FolderOpen,
    children: [
      'Indexing',
      'File Indexing Assistant',
      'File History View',
      'SerialNo Grouping',
      'Print Files Label',
      'Print Sign In & Out Sheet',
      'Blind Scanning',
      'Scanning',
      'Upload Indexed Files',
      'Upload Unindexed Files',
      'Document Page Types',
      'PageTyping',
      'PT Quality Control',
      'DMS Update',
      'Activity Monitoring',
    ],
  },
  {
    label: 'Digital File Archive',
    icon: Archive,
    children: ['File Digital Library – Doc-WARE', 'DMS Update'],
  },
  {
    label: 'File Tracking (Web & Mobile)',
    icon: Compass,
    children: [
      'File Tracker Dashboard',
      'File Tracker (Archive)',
      'Quick Search',
      'Log a File',
    ],
  },
  {
    label: 'Programmes',
    icon: ListChecks,
    children: [
      'Allocation',
      'Resettlement / Compensation',
      'Recertification',
      'Conversion / Regularization',
      'Land Property Enumeration',
      'Data Repository',
      'Migrate Data',
    ],
  },
  {
    label: 'Information Products (RofO / CofO)',
    icon: Info,
    children: [
      'Letter of Grant / RofO',
      'Site Plan / Parcel Plan',
      'Certificate of Occupancy',
    ],
  },
  {
    label: 'ALAES REV-M',
    icon: Database,
    children: [
      'Automated Billing',
      'Legacy Billing',
      'Generate Receipt',
      'Land Use Charge (LUC)',
      'Transaction Token Control',
    ],
  },
  {
    label: 'Deeds',
    icon: Stamp,
    children: [
      'PRA',
      'AI PRA (File Transactions)',
      'Deeds Registration',
      'Instrument Capture (New Records)',
      'Instrument Registration',
      'Encumbrance Management',
      'Parcel / Title Management',
      'Activity Monitoring',
    ],
  },
  {
    label: 'Legal Search',
    icon: Search,
    children: [
      'Property Records',
      'On-Premise Legal Search',
      'Legal Search Reports',
      'Online Legal Search',
      'PHS Portal Admin',
      'Feedback & Complaints',
    ],
  },
  {
    label: 'Land',
    icon: LandPlot,
    children: [
      'Allocation List',
      'Generate New FileNo (MLSFileNo)',
      'New Applications (Existing OP)',
      'Capture / Manage an Existing File',
      'File Decommissioning',
      'Letter of Grant (RofO)',
      'Re-grant Files',
      'File History',
      'File Search',
      'Digital Archive',
      'Parcel / Title Management',
      'LAAS Portal',
    ],
  },
  {
    label: 'Sectional Titling',
    icon: Layers,
    children: [
      'Overview',
      'Commission New ST FileNo',
      'Applications',
      'Field Data Integration',
      'Bills & Payments',
      'Approvals (Other Departments)',
      'Director’s Approval',
      'Final Conveyance',
      'Digital Archive',
      'e-Registry',
      'Survey',
      'Reports',
    ],
  },
  {
    label: 'System Admin',
    icon: ShieldCheck,
    children: [
      'Activity Logs',
      'Activity Monitoring',
      'User Account',
      'Departments',
      'User Roles',
      'Digital Signature Control',
      'System Settings',
      'Folder Watcher',
    ],
  },
]
