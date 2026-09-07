import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'
import { LEGAL_SEARCH_RECORDS } from '@/lib/legal-search-data'

export const runtime = 'nodejs'

const TABLES = {
  transaction: 'Stage_PropertyTransaction',
  history: 'Stage_PropertyTransactionHistory',
  type: 'Stage_PropertyTransactionType',
} as const

type ColumnMap = Record<string, string | undefined>

function identifier(value: string) {
  return `[${value.replace(/]/g, ']]')}]`
}

async function getColumns(table: string) {
  const result = await query<{ name: string }>(
    `SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = @table ORDER BY ORDINAL_POSITION`,
    { table },
  )
  return result.recordset.map((column) => column.name)
}

function mapColumns(columns: string[]): ColumnMap {
  const normalized = new Map(columns.map((column) => [column.toLowerCase().replace(/[^a-z0-9]/g, ''), column]))
  const find = (...names: string[]) => names.map((name) => normalized.get(name.toLowerCase().replace(/[^a-z0-9]/g, ''))).find(Boolean)
  return {
    id: find('Id', 'TransactionId', 'PropertyTransactionId'),
    propertyId: find('PropertyId', 'PropertyID', 'Property_Id'),
    fileNo: find('ParentFileNumber', 'FileNumber', 'FileNo', 'KANGISFileNo', 'NewKANGISFileNo', 'RootRegistrationNumber'),
    property: find('ScheduleName', 'Property', 'PropertyName', 'Description', 'Subject'),
    owner: find('GranteeName', 'GrantorName', 'Owner', 'OwnerName', 'ApplicantName', 'ProprietorName'),
    location: find('ScheduleName', 'LayoutName', 'Location', 'Address', 'PropertyAddress', 'District'),
    lga: find('LgaOrCityID', 'LGA', 'LocalGovernmentArea'),
    plot: find('PlotNumber', 'PlotNo'),
    plan: find('RootRegistrationNumber', 'PlanNumber', 'PlanNo'),
    status: find('IsApproved', 'Status', 'TransactionStatus'),
    typeId: find('PropertyTransferTypeID', 'PropertyTransactionTypeId', 'TransactionTypeId', 'TypeId'),
    type: find('TransactionType', 'Type', 'Name'),
    created: find('DateCreated', 'CreatedDate', 'CreatedAt', 'TransactionDate', 'TransactionDateTime'),
    size: find('PlotSize', 'Size', 'PropertySize', 'Area'),
    caveat: find('Caveat', 'HasCaveat'),
    particulars: find('ParentRegistrationNumber', 'RegistrationParticulars', 'Particulars', 'Instrument'),
  }
}

function selectExpression(map: ColumnMap, key: string, alias: string, tableAlias?: string) {
  const column = map[key]
  return column ? `${tableAlias ? `${tableAlias}.` : ''}${identifier(column)} AS ${identifier(alias)}` : `NULL AS ${identifier(alias)}`
}

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: true, source: 'demo', records: LEGAL_SEARCH_RECORDS })
  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim() ?? ''
  const [transactionColumns, historyColumns, typeColumns] = await Promise.all(Object.values(TABLES).map(getColumns))
  const propertyIdColumn = transactionColumns.find((column) => column.toLowerCase() === 'propertyid') ?? transactionColumns.find((column) => column.toLowerCase() === 'property_id')
  const transactionMap = mapColumns(transactionColumns)
  const historyMap = mapColumns(historyColumns)
  const typeName = typeColumns.find((column) => column.toLowerCase() === 'transactiontype')
  const historyId = historyColumns.find((column) => column.toLowerCase() === 'propertytransactionhistoryid')
  const typeId = typeColumns.find((column) => column.toLowerCase() === 'propertytransactiontypeid')
  const searchable = [transactionMap.fileNo, transactionMap.property, transactionMap.owner, transactionMap.location, transactionMap.lga, transactionMap.plot, transactionMap.plan].filter(Boolean) as string[]
  const transactionWhere = search && searchable.length ? `WHERE ${searchable.map((column) => `TRY_CONVERT(nvarchar(500), p.${identifier(column)}) LIKE @search`).join(' OR ')}` : ''
  const order = historyMap.created ? `ORDER BY h.${identifier(historyMap.created)} DESC` : historyMap.id ? `ORDER BY h.${identifier(historyMap.id)} DESC` : ''
  const typeJoin = historyMap.typeId && typeId ? `LEFT JOIN dbo.${identifier(TABLES.type)} t ON h.${identifier(historyMap.typeId)} = t.${identifier(typeId)}` : ''
  const typeSelect = typeName ? `t.${identifier(typeName)} AS [type]` : 'NULL AS [type]'
  const result = await query(`SELECT TOP (200)
    ${propertyIdColumn ? `p.${identifier(propertyIdColumn)}` : 'NULL'} AS [propertyId],
    ${historyId ? `h.${identifier(historyId)}` : 'NULL'} AS [id],
    ${selectExpression(transactionMap, 'fileNo', 'fileNo', 'p')},
    ${selectExpression(transactionMap, 'property', 'property', 'p')},
    ${selectExpression(transactionMap, 'owner', 'owner', 'p')},
    ${selectExpression(transactionMap, 'location', 'location', 'p')},
    ${selectExpression(transactionMap, 'lga', 'lga', 'p')},
    ${selectExpression(transactionMap, 'plot', 'plot', 'p')},
    ${selectExpression(transactionMap, 'plan', 'plan', 'p')},
    ${selectExpression(transactionMap, 'status', 'status', 'p')},
    ${typeSelect},
    ${selectExpression(transactionMap, 'created', 'created', 'p')},
    ${selectExpression(transactionMap, 'size', 'size', 'p')},
    ${selectExpression(transactionMap, 'caveat', 'caveat', 'p')},
    ${selectExpression(transactionMap, 'particulars', 'particulars', 'p')},
    ${selectExpression(transactionMap, 'owner', 'grantee', 'p')},
    ${selectExpression(transactionMap, 'location', 'scheduleName', 'p')},
    ${selectExpression(transactionMap, 'plot', 'plotNumber', 'p')},
    ${selectExpression(transactionMap, 'size', 'plotSize', 'p')},
    ${selectExpression(transactionMap, 'status', 'approved', 'p')},
    ${typeSelect.replace('[type]', '[transactionType]')}
    FROM dbo.${identifier(TABLES.transaction)} p
    LEFT JOIN dbo.${identifier(TABLES.history)} h ON ${propertyIdColumn && historyMap.propertyId ? `p.${identifier(propertyIdColumn)} = h.${identifier(historyMap.propertyId)}` : '1 = 0'}
    ${typeJoin}
    ${transactionWhere}
    ${order}`, search ? { search: `%${search}%` } : {})
  const grouped = new Map<string, Record<string, unknown> & { history?: unknown[] }>()
  for (const row of result.recordset as Array<Record<string, unknown>>) {
    const propertyId = String(row.propertyId ?? row.id ?? '')
    const existing = grouped.get(propertyId)
    if (existing) existing.history = [...(existing.history ?? []), row]
    else grouped.set(propertyId, { ...row, history: [row] })
  }
  return NextResponse.json({ ok: true, source: 'mssql', records: [...grouped.values()], tables: TABLES, schema: { transaction: transactionColumns, history: historyColumns, type: typeColumns } })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const search = typeof body.search === 'string' ? body.search.trim() : ''
  const requestUrl = new URL(request.url)
  requestUrl.searchParams.set('search', search)
  return GET(new Request(requestUrl))
}
