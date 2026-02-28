import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/modules/[id]/runs — Get run history for a module
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();

        const module = db.prepare('SELECT id FROM modules WHERE id = ?').get(id);
        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const runs = db.prepare(`
      SELECT * FROM runs
      WHERE module_id = ?
      ORDER BY created_at DESC
      LIMIT 100
    `).all(id);

        return NextResponse.json(runs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch runs' }, { status: 500 });
    }
}
