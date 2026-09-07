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
    fileNo: find('FileNo', 'FileNumber', 'KANGISFileNo', 'KangisFileNumber', 'NewKANGISFileNo'),
    property: find('Property', 'PropertyName', 'Description', 'Subject'),
    owner: find('Owner', 'OwnerName', 'ApplicantName', 'ProprietorName', 'GuarantorName'),
    location: find('Location', 'Address', 'PropertyAddress', 'District'),
    lga: find('LGA', 'LocalGovernmentArea'),
    plot: find('PlotNumber', 'PlotNo'),
    plan: find('PlanNumber', 'PlanNo'),
    status: find('Status', 'TransactionStatus'),
    typeId: find('TransactionTypeId', 'TypeId'),
    type: find('TransactionType', 'Type', 'Name'),
    created: find('CreatedDate', 'CreatedAt', 'TransactionDate', 'DateCreated'),
    size: find('Size', 'PropertySize', 'Area'),
    caveat: find('Caveat', 'HasCaveat'),
    particulars: find('RegistrationParticulars', 'Particulars', 'Instrument'),
  }
}

function selectExpression(map: ColumnMap, key: string, alias: string) {
  return map[key] ? `${identifier(map[key]!)} AS ${identifier(alias)}` : `NULL AS ${identifier(alias)}`
}

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: true, source: 'demo', records: LEGAL_SEARCH_RECORDS })
  const url = new URL(request.url)
  const search = url.searchParams.get('search')?.trim() ?? ''
  const tables = await Promise.all(Object.values(TABLES).map(getColumns))
  const map = mapColumns(tables[0])
  const searchable = [map.fileNo, map.property, map.owner, map.location, map.lga, map.plot, map.plan].filter(Boolean) as string[]
  const where = search && searchable.length ? `WHERE ${searchable.map((column) => `TRY_CONVERT(nvarchar(500), ${identifier(column)}) LIKE @search`).join(' OR ')}` : ''
  const order = map.created ? `ORDER BY ${identifier(map.created)} DESC` : map.id ? `ORDER BY ${identifier(map.id)} DESC` : ''
  const result = await query(`SELECT TOP (200) ${['id','fileNo','property','owner','location','lga','plot','plan','status','type','created','size','caveat','particulars'].map((key) => selectExpression(map, key, key)).join(', ')} FROM dbo.${identifier(TABLES.transaction)} ${where} ${order}`, search ? { search: `%${search}%` } : {})
  return NextResponse.json({ ok: true, source: 'mssql', records: result.recordset, tables: TABLES })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const search = typeof body.search === 'string' ? body.search.trim() : ''
  const requestUrl = new URL(request.url)
  requestUrl.searchParams.set('search', search)
  return GET(new Request(requestUrl))
}
