import { NextResponse } from 'next/server'
import { isDbConfigured } from '@/lib/db/config'
import { query } from '@/lib/db/mssql'

export const runtime = 'nodejs'

function identifier(value: string) {
  return `[${value.replace(/]/g, ']]')}]`
}

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: true, source: 'demo', history: [], types: [] })
  const url = new URL(request.url)
  const transactionId = url.searchParams.get('transactionId')?.trim()
  const [historyColumns, typeColumns] = await Promise.all([
    query<{ name: string }>(`SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Stage_PropertyTransactionHistory' ORDER BY ORDINAL_POSITION`),
    query<{ name: string }>(`SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Stage_PropertyTransactionType' ORDER BY ORDINAL_POSITION`),
  ])
  const pick = (columns: string[], ...candidates: string[]) => {
    const lookup = new Map(columns.map((column) => [column.toLowerCase().replace(/[^a-z0-9]/g, ''), column]))
    return candidates.map((candidate) => lookup.get(candidate.toLowerCase().replace(/[^a-z0-9]/g, ''))).find(Boolean)
  }
  const historyId = pick(historyColumns.recordset.map((column) => column.name), 'PropertyTransactionHistoryID', 'PropertyTransactionHistoryId', 'Id')
  const typeId = pick(typeColumns.recordset.map((column) => column.name), 'PropertyTransactionTypeID', 'PropertyTransactionTypeId', 'Id', 'TransactionTypeId')
  const history = historyId && transactionId
    ? await query(`SELECT TOP (200) * FROM dbo.${identifier('Stage_PropertyTransactionHistory')} WHERE TRY_CONVERT(nvarchar(200), ${identifier(historyId)}) = @transactionId ORDER BY 1 DESC`, { transactionId })
    : await query(`SELECT TOP (200) * FROM dbo.${identifier('Stage_PropertyTransactionHistory')} ORDER BY 1 DESC`)
  const types = typeId ? await query(`SELECT TOP (200) * FROM dbo.${identifier('Stage_PropertyTransactionType')} ORDER BY ${identifier(typeId)}`) : { recordset: [] }
  return NextResponse.json({ ok: true, source: 'mssql', history: history.recordset, types: types.recordset })
}
