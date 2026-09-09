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

/**
 * A navigation node is either a leaf link (no children) or a collapsible
 * group. `children` may itself contain nested groups, so the tree supports
 * arbitrary depth and the sidebar renders it recursively.
 */
export type NavNode = {
  label: string
  /** When set, the leaf navigates to this route instead of only highlighting. */
  href?: string
  children?: NavNode[]
}

export type NavModule = NavNode & {
  icon: LucideIcon
}

/** Convenience: build leaf nodes from plain strings. */
const leaves = (...labels: string[]): NavNode[] =>
  labels.map((label) => ({ label }))

/**
 * ALAES module tree, transcribed from the authoritative sidebar IA.
 * Top-level modules carry an icon; every level below is nested.
 */
export const NAV: NavModule[] = [
  { label: 'Dashboard', icon: Home, href: '/' },

  {
    label: 'Customer Relationship Management',
    icon: Users,
    children: [
      { label: 'Person', children: leaves('Individual', 'Group', 'Multiple Owners') },
      { label: 'Corporate' },
      {
        label: 'Customer Manager',
        children: leaves('Appointment', 'Appointment Calendar'),
      },
    ],
  },

  {
    label: 'DMS',
    icon: FolderOpen,
    children: [
      {
        label: 'Indexing',
        children: [
          { label: 'File Indexing Assistant' },
          { label: 'File History View' },
          {
            label: 'File SerialNo Grouping',
            children: leaves('SerialNo Grouping', 'Print Files Label'),
          },
        ],
      },
      { label: 'Print Sign In & Out Sheet' },
      { label: 'Blind Scanning' },
      {
        label: 'Scanning',
        children: leaves('Upload Indexed Files', 'Upload Unindexed Files'),
      },
      { label: 'Document Page Types', children: leaves('PageTyping') },
      { label: 'PT Quality Control' },
      { label: 'DMS Update', children: leaves('Scan More', 'More Pages') },
      { label: 'Activity Monitoring' },
    ],
  },

  {
    label: 'Digital File Archive',
    icon: Archive,
    children: [
      { label: 'File Digital Library - Doc-WARE' },
      { label: 'DMS Update', children: leaves('Scan More', 'Type More') },
    ],
  },

  {
    label: 'File Tracking (Web & Mobile)',
    icon: Compass,
    children: [
      { label: 'File Tracker Dashboard', href: '/file-tracking' },
      { label: 'Track File', href: '/file-tracking?view=track' },
      { label: 'Quick Search', href: '/file-tracking?view=search' },
      { label: 'Log a File', href: '/file-tracking?view=log' },
      { label: 'Mobile Sync & Activity Logs', href: '/file-tracking?view=activity' },
    ],
  },

  {
    label: 'Programmes',
    icon: ListChecks,
    children: [
      { label: 'Allocation', children: leaves('Governors List', 'Commissioners List') },
      {
        label: 'Resettlement/Compensation',
        children: leaves('Governors List', 'Commissioners List'),
      },
      { label: 'Recertification' },
      { label: 'Conversion/Regularization' },
      {
        label: 'First Registration (SLTR)',
        children: leaves(
          'SLTR Form & Field Data',
          'Planning Recommendation',
          'SLTR Memo',
          'Certificates',
        ),
      },
      {
        label: 'Valuation for Compensation',
        children: leaves(
          'Monetary Compensation',
          'Field Data Capture (Web & Mobile App)',
        ),
      },
      {
        label: 'Land Property Enumeration',
        children: leaves('Data Repository', 'Migrate Data'),
      },
    ],
  },

  {
    label: 'Information Products (RofO)',
    icon: Info,
    children: leaves(
      'Letter of Grant/RofO',
      'Occupancy Permit (OP)',
      'Site Plan/Parcel Plan',
      'Certificate of Occupancy',
    ),
  },

  {
    label: 'ALAES REV-M',
    icon: Database,
    children: [
      { label: 'Billing', children: leaves('Automated Billing', 'Legacy Billing') },
      { label: 'Generate Receipt' },
      { label: 'Land Use Charge (LUC)' },
      { label: 'Transaction Token Control' },
    ],
  },

  {
    label: 'Deeds',
    icon: Stamp,
    children: [
      {
        label: 'PRA',
        children: leaves(
          'PRA & PIC User Output Tracking',
          'Property Records Assistant (Legacy Records)',
          'AI PRA (File Transactions)',
        ),
      },
      {
        label: 'Deeds Registration',
        children: leaves(
          'Instrument Capture (New Records)',
          'Instrument Registration (New Registration)',
          'Instrument Registration Reports',
        ),
      },
      {
        label: 'Encumbrance Management',
        children: leaves('Caveat', 'Mortgage', 'Surrender & Release', 'Lien'),
      },
      {
        label: 'Parcel/Title Management',
        children: [
          { label: 'Change of Purpose' },
          {
            label: 'Parcel Update - New',
            children: leaves(
              'Plot Subdivision',
              'Plot Merger',
              'Plot Extension',
              'Plot Separation',
            ),
          },
          { label: 'Parcel Update - Legacy' },
          { label: 'Title Status Update' },
        ],
      },
      { label: 'Activity Monitoring' },
    ],
  },

  {
    label: 'Legal Search',
    icon: Search,
    children: [
      { label: 'Property Records', href: '/legal-search/property-records' },
      {
        label: 'On-Premise Legal Search',
        children: [
          { label: 'Official (for filing purpose)', href: '/legal-search/official' },
          { label: 'On-Premise', href: '/legal-search/on-premise' },
          { label: 'Legal Search Reports' },
        ],
      },
      { label: 'Transaction Token Control' },
      {
        label: 'Online Legal Search',
        children: leaves(
          'Online',
          'Online Legal Search Admin',
          'Feedback & Complaints',
        ),
      },
      {
        label: 'PHS Portal Admin',
        children: [
          { label: 'Onboarding Requests', href: '/phs-admin/onboarding-requests' },
          { label: 'Pending Invoice', href: '/phs-admin/pending-invoice' },
          { label: 'Subscriptions', href: '/phs-admin/subscriptions' },
          { label: 'Usage and Revenue', href: '/phs-admin/usage-revenue' },
          { label: 'Packages', href: '/phs-admin/packages' },
          { label: 'Token Top-up', children: [{ label: 'Wallets', href: '/phs-admin/wallets' }] },
          { label: 'Legal Department', href: '/phs-admin/legal-department' },
          { label: 'Feedback & Complaints', href: '/phs-admin/feedback' },
        ],
      },
    ],
  },

  {
    label: 'Land',
    icon: LandPlot,
    children: [
      {
        label: 'Land',
        children: [
          { label: 'Allocation List' },
          { label: 'Generate New FileNo (MLSFileNo)', href: '/land/generate-new-fileno' },
          { label: 'New Applications (Existing OP)', href: '/land/applications/existing-op' },
          { label: 'Bill' },
          { label: 'Capture/Manage an Existing File' },
          { label: 'File Decommissioning' },
        ],
      },
      {
        label: 'Letter of Grant (RofO)',
        children: leaves('Land Recommendation', 'RofO', 'Re-grant Files'),
      },
      {
        label: 'File History',
        children: [
          { label: 'History View' },
          { label: 'Related Files' },
          { label: 'File Search', children: leaves('Scans') },
        ],
      },
      { label: 'Problem Files' },
      {
        label: 'Digital Archive',
        children: leaves(
          'File Tracker Dashboard',
          'File Tracker (Archive)',
          'Quick Search',
          'Log a File',
          'File Digital Library – Doc-WARE',
          'DMS Update',
        ),
      },
      {
        label: 'Parcel/Title Management',
        children: [
          { label: 'Change of Purpose' },
          { label: 'Loss of Document' },
          { label: 'Temporary File' },
          {
            label: 'Parcel Update - New',
            children: leaves(
              'Plot Subdivision',
              'Plot Merger',
              'Plot Extension',
              'Plot Separation',
              'Parcel Update - Legacy',
            ),
          },
          { label: 'Title Status Update' },
        ],
      },
      { label: 'EDMS Update' },
      { label: 'LAAS Portal', children: leaves('Applications', 'Applicants') },
    ],
  },

  {
    label: 'Sectional Titling',
    icon: Layers,
    children: [
      { label: 'Overview', href: '/sectional-titling' },
      { label: 'ST FileNo Management', href: '/sectional-titling/file-management' },
      { label: 'Commission New ST FileNo' },
      {
        label: 'Applications',
        children: [
          {
            label: 'Primary Applications',
            href: '/sectional-titling/applications/primary',
          },
          {
            label: 'Unit Applications',
            children: [
              {
                label: 'Parented Units',
                href: '/sectional-titling/applications/parented',
              },
              {
                label: 'Standalone Units',
                href: '/sectional-titling/applications/standalone',
              },
            ],
          },
        ],
      },
      { label: 'Field Data Integration' },
      {
        label: 'Bills & Payments',
        children: leaves('Bills', 'Payments', 'Payments Report'),
      },
      {
        label: 'Approvals (Other Departments)',
        children: leaves(
          'ST Deeds Registration View',
          'Planning Recommendation',
          'Other Departments',
        ),
      },
      { label: "Director's Approval" },
      {
        label: 'ST Memo',
        children: leaves('Primary', 'Unit (Scheme)', 'Unit (Non-Scheme)'),
      },
      { label: 'Final Conveyance' },
      { label: 'Certificate', children: leaves('RofO', 'CofO') },
      {
        label: 'Digital Archive',
        children: [
          { label: 'File Tracker Dashboard' },
          { label: 'File Tracker (Archive)' },
          { label: 'Quick Search' },
          { label: 'Log a File' },
          { label: 'File Digital Library – Doc-WARE' },
          {
            label: 'e-Registry',
            children: leaves('Files', 'Print File Label'),
          },
          { label: 'DMS Update' },
        ],
      },
      { label: 'Survey', children: leaves('Attribution') },
      { label: 'GIS', children: leaves('Attribution') },
      { label: 'Sectional Titling BaseMap' },
      { label: 'Reports' },
    ],
  },

  {
    label: 'System Admin',
    icon: ShieldCheck,
    children: [
      { label: 'Activity Logs', href: '/system-admin/activity-logs' },
      { label: 'Activity Monitoring', href: '/system-admin/activity-monitoring' },
      { label: 'User Account', href: '/system-admin/user-accounts' },
      { label: 'Departments', href: '/system-admin/departments' },
      { label: 'User Roles', href: '/system-admin/user-roles' },
      {
        label: 'Digital Signature Control',
        href: '/system-admin/digital-signature-control',
      },
      { label: 'System Settings', href: '/system-admin/system-settings' },
      { label: 'Database Connection', href: '/system-admin/database' },
      { label: 'Folder Watcher', href: '/system-admin/folder-watcher' },
    ],
  },
]

/**
 * Walk the tree and return the full label-path chain (leaf-first) whose leaf
 * `href` matches `pathname`. Used by the sidebar to auto-expand ancestors and
 * highlight the active route.
 */
export function findActiveChain(pathname: string): string[] {
  const chain: string[] = []
  const walk = (nodes: NavNode[], parentPath: string): boolean => {
    for (const node of nodes) {
      const path = parentPath ? `${parentPath}/${node.label}` : node.label
      if (node.href && node.href === pathname) {
        chain.push(path)
        return true
      }
      if (node.children && walk(node.children, path)) {
        chain.push(path)
        return true
      }
    }
    return false
  }
  walk(NAV, '')
  return chain
}
