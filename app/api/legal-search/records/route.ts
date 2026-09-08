import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'
import { LEGAL_SEARCH_RECORDS } from '@/lib/legal-search-data'

export const runtime = 'nodejs'

const TABLES = {
  history: 'Stage_PropertyTransactionHistory',
  type: 'Stage_PropertyTransactionType',
} as const

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

/** Resolve the real column name from a list of candidates, case/format-insensitive. */
function resolver(columns: string[]) {
  const normalized = new Map(columns.map((column) => [column.toLowerCase().replace(/[^a-z0-9]/g, ''), column]))
  return (...candidates: string[]) =>
    candidates.map((name) => normalized.get(name.toLowerCase().replace(/[^a-z0-9]/g, ''))).find(Boolean)
}

export async function GET(request: Request) {
  const debugId = `legal-search-${Date.now().toString(36)}`
  if (!isDbConfigured()) {
    console.log('[v0] Legal search database not configured', { debugId, source: 'demo' })
    return NextResponse.json({ ok: true, source: 'demo', records: LEGAL_SEARCH_RECORDS, debugId })
  }
  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim() ?? ''
  const propertyIdParam = url.searchParams.get('propertyId')?.trim() ?? ''
  console.log('[v0] Legal search started', { debugId, searchLength: search.length, propertyIdParam, tables: TABLES })
  try {
    const [historyColumns, typeColumns] = await Promise.all([getColumns(TABLES.history), getColumns(TABLES.type)])
    const h = resolver(historyColumns)
    const t = resolver(typeColumns)

    // Exact Abia schema mapping. `FileNumberID` is the property key: one property
    // (file) has many history rows (its transactions over time).
    const cols = {
      id: h('PropertyTransactionHistoryID'),
      propertyId: h('FileNumberID'),
      fileNo: h('ParentFileNumber'),
      grantor: h('GrantorName'),
      grantee: h('GranteeName'),
      guarantor: h('GuarantorName'),
      scheduleName: h('ScheduleName'),
      layoutName: h('LayoutName'),
      lga: h('LgaOrCityID'),
      district: h('DistrictID'),
      plotNumber: h('PlotNumber'),
      plotSize: h('PlotSize'),
      approved: h('IsApproved'),
      caveated: h('IsCaveated'),
      caveatRemarks: h('CaveatRemarks'),
      parentRegistration: h('ParentRegistrationNumber'),
      rootRegistration: h('RootRegistrationNumber'),
      registrationNumber: h('FullRegistrationNumber', 'RegistrationNumber'),
      planNumber: h('PlanNumber', 'OriginalPlanNumber'),
      propertyDescription: h('PropertyDescription'),
      address: h('AddressDescription'),
      instrumentDate: h('InstrumentDate'),
      registrationDate: h('RegistrationDate'),
      created: h('DateCreated'),
      transferTypeId: h('PropertyTransferTypeID', 'PropertyTransactionTypeId'),
    }
    const typeIdCol = t('PropertyTransactionTypeId', 'PropertyTransferTypeID', 'Id')
    const typeNameCol = t('TransactionType', 'Name', 'Type')

    const sel = (alias: string, column: string | undefined, tableAlias = 'h') =>
      column ? `${tableAlias}.${identifier(column)} AS ${identifier(alias)}` : `NULL AS ${identifier(alias)}`

    // Search runs across every relevant property field, not just the grantee name.
    const searchableColumns = [
      cols.fileNo, cols.grantor, cols.grantee, cols.guarantor, cols.scheduleName, cols.layoutName,
      cols.plotNumber, cols.parentRegistration, cols.rootRegistration, cols.registrationNumber,
      cols.planNumber, cols.propertyDescription, cols.address,
    ].filter(Boolean) as string[]
    const uniqueSearchable = [...new Set(searchableColumns)]

    const typeJoin = cols.transferTypeId && typeIdCol
      ? `LEFT JOIN dbo.${identifier(TABLES.type)} t ON h.${identifier(cols.transferTypeId)} = t.${identifier(typeIdCol)}`
      : ''
    const typeSelect = typeJoin && typeNameCol ? `t.${identifier(typeNameCol)} AS [transactionType]` : 'NULL AS [transactionType]'
    const approvedSelect = cols.approved ? `CASE WHEN h.${identifier(cols.approved)} = 1 THEN 'Yes' ELSE 'No' END AS [approved]` : `'No' AS [approved]`
    const caveatSelect = cols.caveated
      ? `CASE WHEN h.${identifier(cols.caveated)} = 1 THEN COALESCE(${cols.caveatRemarks ? `TRY_CONVERT(nvarchar(400), h.${identifier(cols.caveatRemarks)})` : `'Yes'`}, 'Yes') ELSE 'None' END AS [caveat]`
      : `'None' AS [caveat]`
    const order = cols.created ? `ORDER BY h.${identifier(cols.created)} DESC` : cols.id ? `ORDER BY h.${identifier(cols.id)} DESC` : ''

    const params: Record<string, string> = {}
    let where = ''
    if (propertyIdParam && cols.propertyId) {
      // Report mode: return EVERY transaction tied to this property id.
      params.propertyId = propertyIdParam
      where = `WHERE h.${identifier(cols.propertyId)} = @propertyId`
    } else {
      // Tokenize so "MR. NGADIUBA SAMUEL" matches each word in any field, any order.
      const tokens = search.split(/\s+/).map((token) => token.replace(/[^\p{L}\p{N}/-]/gu, '')).filter((token) => token.length >= 2)
      const tokenClauses = tokens.map((token, index) => {
        params[`token${index}`] = `%${token}%`
        return `(${uniqueSearchable.map((column) => `TRY_CONVERT(nvarchar(500), h.${identifier(column)}) LIKE @token${index}`).join(' OR ')})`
      })
      where = tokenClauses.length ? `WHERE ${tokenClauses.join(' AND ')}` : ''
    }

    console.log('[v0] Legal search query mapping', { debugId, propertyKey: cols.propertyId, fileNo: cols.fileNo, grantee: cols.grantee, grantor: cols.grantor, transactionType: typeNameCol, searchColumns: uniqueSearchable })

    const result = await query(`SELECT TOP (500)
      ${sel('id', cols.id)},
      ${sel('propertyId', cols.propertyId)},
      ${sel('fileNo', cols.fileNo)},
      ${sel('grantor', cols.grantor)},
      ${sel('grantee', cols.grantee)},
      ${sel('guarantor', cols.guarantor)},
      ${sel('scheduleName', cols.scheduleName)},
      ${sel('layoutName', cols.layoutName)},
      ${sel('lga', cols.lga)},
      ${sel('district', cols.district)},
      ${sel('plotNumber', cols.plotNumber)},
      ${sel('plotSize', cols.plotSize)},
      ${approvedSelect},
      ${caveatSelect},
      ${sel('parentRegistration', cols.parentRegistration)},
      ${sel('rootRegistration', cols.rootRegistration)},
      ${sel('registrationNumber', cols.registrationNumber)},
      ${sel('planNumber', cols.planNumber)},
      ${sel('propertyDescription', cols.propertyDescription)},
      ${sel('address', cols.address)},
      ${sel('instrumentDate', cols.instrumentDate)},
      ${sel('registrationDate', cols.registrationDate)},
      ${sel('created', cols.created)},
      ${typeSelect}
      FROM dbo.${identifier(TABLES.history)} h
      ${typeJoin}
      ${where}
      ${order}`, params)

    const rows = result.recordset as Array<Record<string, unknown>>

    // Group one property's many transactions together, keyed by its property id
    // (FileNumberID). The first row is the representative/most-recent transaction.
    const grouped = new Map<string, Record<string, unknown> & { history: Record<string, unknown>[] }>()
    for (const row of rows) {
      const key = String(row.propertyId ?? row.fileNo ?? row.id ?? Math.random())
      const existing = grouped.get(key)
      if (existing) existing.history.push(row)
      else grouped.set(key, { ...row, history: [row] })
    }
    const records = [...grouped.values()].map((record) => ({ ...record, transactionCount: record.history.length }))

    console.log('[v0] Legal search completed', { debugId, rawRows: rows.length, groupedProperties: records.length })
    return NextResponse.json({ ok: true, source: 'mssql', records, tables: TABLES, debugId })
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
