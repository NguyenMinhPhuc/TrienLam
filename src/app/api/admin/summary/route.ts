import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [products, sections, stats] = await Promise.all([
      query('SELECT COUNT(*) as count FROM Products'),
      query('SELECT COUNT(*) as count FROM CustomSections'),
      query('SELECT COUNT(*) as count FROM Stats'),
    ]);

    const recentProducts = await query('SELECT TOP 5 * FROM Products ORDER BY Id DESC');

    return NextResponse.json({
      totalProducts: products.recordset[0].count,
      totalSections: sections.recordset[0].count,
      totalStats: stats.recordset[0].count,
      recentProducts: recentProducts.recordset,
    });
  } catch (err) {
    console.error('Summary API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
