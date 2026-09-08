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
    fileNo: find('ParentFileNumber', 'FileNumber', 'FileNo', 'KANGISFileNo', 'NewKANGISFileNo', 'RootRegistrationNumber', 'FullRegistrationNumber', 'RegistrationNumber'),
    property: find('ScheduleName', 'PropertyDescription', 'Property', 'PropertyName', 'Description', 'Subject'),
    owner: find('GranteeName', 'GrantorName', 'Grantee', 'Grantor', 'Owner', 'OwnerName', 'ApplicantName', 'ProprietorName'),
    location: find('ScheduleName', 'LayoutName', 'Location', 'Address', 'AddressDescription', 'PropertyAddress', 'District'),
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
  const debugId = `legal-search-${Date.now().toString(36)}`
  if (!isDbConfigured()) {
    console.log('[v0] Legal search database not configured', { debugId, source: 'demo' })
    return NextResponse.json({ ok: true, source: 'demo', records: LEGAL_SEARCH_RECORDS, debugId })
  }
  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim() ?? ''
  console.log('[v0] Legal search started', { debugId, searchLength: search.length, tables: TABLES })
  try {
  const [transactionColumns, historyColumns, typeColumns] = await Promise.all(Object.values(TABLES).map(getColumns))
  console.log('[v0] Legal search schema detected', { debugId, transactionColumns, historyColumns, typeColumns })
  const historyMap = mapColumns(historyColumns)
  const grantorColumn = historyColumns.find((column) => column.toLowerCase() === 'grantorname')
  const typeName = typeColumns.find((column) => column.toLowerCase() === 'transactiontype')
  const historyId = historyColumns.find((column) => column.toLowerCase() === 'propertytransactionhistoryid')
  const typeId = typeColumns.find((column) => column.toLowerCase() === 'propertytransactiontypeid')
  // The rich, searchable property data lives entirely in the history table.
  // The transaction table has no reliable key to join on, so the search runs on history alone.
  const searchableColumns = [historyMap.fileNo, historyMap.property, historyMap.owner, grantorColumn, historyMap.location, historyMap.lga, historyMap.plot, historyMap.plan, historyMap.particulars].filter(Boolean) as string[]
  const uniqueSearchable = [...new Set(searchableColumns)]
  // Tokenize the search so "MR. NGADIUBA SAMUEL" matches records containing each word
  // in any searchable column, regardless of order or prefixes. Ignore very short noise tokens.
  const tokens = search.split(/\s+/).map((token) => token.replace(/[^\p{L}\p{N}/-]/gu, '')).filter((token) => token.length >= 2)
  const params: Record<string, string> = {}
  const tokenClauses = tokens.map((token, index) => {
    params[`token${index}`] = `%${token}%`
    return `(${uniqueSearchable.map((column) => `TRY_CONVERT(nvarchar(500), h.${identifier(column)}) LIKE @token${index}`).join(' OR ')})`
  })
  const where = tokenClauses.length ? `WHERE ${tokenClauses.join(' AND ')}` : ''
  const order = historyMap.created ? `ORDER BY h.${identifier(historyMap.created)} DESC` : historyId ? `ORDER BY h.${identifier(historyId)} DESC` : ''
  const typeJoin = historyMap.typeId && typeId ? `LEFT JOIN dbo.${identifier(TABLES.type)} t ON h.${identifier(historyMap.typeId)} = t.${identifier(typeId)}` : ''
  const typeSelect = typeName && typeJoin ? `t.${identifier(typeName)} AS [type]` : 'NULL AS [type]'
  console.log('[v0] Legal search query mapping', { debugId, fileNumberColumn: historyMap.fileNo, ownerColumn: historyMap.owner, grantorColumn, transactionTypeColumn: typeName, transactionTypeJoinColumn: historyMap.typeId, searchColumns: uniqueSearchable, tokens })
  const result = await query(`SELECT TOP (300)
    ${historyId ? `h.${identifier(historyId)}` : 'NULL'} AS [id],
    ${selectExpression(historyMap, 'fileNo', 'fileNo', 'h')},
    ${selectExpression(historyMap, 'fileNo', 'propertyId', 'h')},
    ${selectExpression(historyMap, 'property', 'property', 'h')},
    ${selectExpression(historyMap, 'owner', 'owner', 'h')},
    ${grantorColumn ? `h.${identifier(grantorColumn)}` : 'NULL'} AS [grantor],
    ${selectExpression(historyMap, 'owner', 'grantee', 'h')},
    ${selectExpression(historyMap, 'location', 'location', 'h')},
    ${selectExpression(historyMap, 'property', 'scheduleName', 'h')},
    ${selectExpression(historyMap, 'lga', 'lga', 'h')},
    ${selectExpression(historyMap, 'plot', 'plot', 'h')},
    ${selectExpression(historyMap, 'plot', 'plotNumber', 'h')},
    ${selectExpression(historyMap, 'plan', 'plan', 'h')},
    ${selectExpression(historyMap, 'status', 'status', 'h')},
    ${selectExpression(historyMap, 'status', 'approved', 'h')},
    ${typeSelect},
    ${typeSelect.replace('[type]', '[transactionType]')},
    ${selectExpression(historyMap, 'created', 'created', 'h')},
    ${selectExpression(historyMap, 'size', 'size', 'h')},
    ${selectExpression(historyMap, 'size', 'plotSize', 'h')},
    ${selectExpression(historyMap, 'caveat', 'caveat', 'h')},
    ${selectExpression(historyMap, 'particulars', 'particulars', 'h')}
    FROM dbo.${identifier(TABLES.history)} h
    ${typeJoin}
    ${where}
    ${order}`, params)
  // Group one property's many transactions together, keyed by its parent file number.
  const grouped = new Map<string, Record<string, unknown> & { history?: unknown[] }>()
  for (const row of result.recordset as Array<Record<string, unknown>>) {
    const key = String(row.fileNo ?? row.id ?? Math.random())
    const existing = grouped.get(key)
    if (existing) existing.history = [...(existing.history ?? []), row]
    else grouped.set(key, { ...row, history: [row] })
  }
  const records = [...grouped.values()]
  console.log('[v0] Legal search completed', { debugId, rawRows: result.recordset.length, groupedProperties: records.length, historyRows: records.reduce((total, record) => total + (record.history?.length ?? 0), 0) })
  return NextResponse.json({ ok: true, source: 'mssql', records, tables: TABLES, schema: { transaction: transactionColumns, history: historyColumns, type: typeColumns }, debugId })
  } catch (error) {
    console.log('[v0] Legal search failed', { debugId, error: error instanceof Error ? error.message : String(error), tables: TABLES })
    return NextResponse.json({ ok: false, error: 'Legal search database query failed.', debugId }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const search = typeof body.search === 'string' ? body.search.trim() : ''
  const requestUrl = new URL(request.url)
  requestUrl.searchParams.set('search', search)
  return GET(new Request(requestUrl))
}
