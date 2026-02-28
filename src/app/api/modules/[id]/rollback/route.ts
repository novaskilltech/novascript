import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POST /api/modules/[id]/rollback — Rollback to a specific version
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { version_id } = body;

        if (!version_id) {
            return NextResponse.json({ error: 'version_id is required' }, { status: 400 });
        }

        const db = getDb();
        const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(id);
        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const version = db.prepare(`
      SELECT * FROM module_versions WHERE id = ? AND module_id = ?
    `).get(version_id, id) as Record<string, unknown> | undefined;

        if (!version) {
            return NextResponse.json({ error: 'Version not found' }, { status: 404 });
        }

        // Update module content to the version's content
        const now = new Date().toISOString();
        db.prepare(`
      UPDATE modules SET content = ?, updated_at = ? WHERE id = ?
    `).run(version.content, now, id);

        const updated = db.prepare(`
      SELECT m.*, p.name as project_name,
        (SELECT COUNT(*) FROM runs WHERE module_id = m.id) as run_count,
        (SELECT COUNT(*) FROM module_versions WHERE module_id = m.id) as version_count
      FROM modules m
      LEFT JOIN projects p ON m.project_id = p.id
      WHERE m.id = ?
    `).get(id);

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to rollback' }, { status: 500 });
    }
}
