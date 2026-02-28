import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/modules/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();
        const module = db.prepare(`
      SELECT m.*, p.name as project_name,
        (SELECT COUNT(*) FROM runs WHERE module_id = m.id) as run_count,
        (SELECT COUNT(*) FROM module_versions WHERE module_id = m.id) as version_count
      FROM modules m
      LEFT JOIN projects p ON m.project_id = p.id
      WHERE m.id = ?
    `).get(id);

        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }
        return NextResponse.json(module);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 });
    }
}

// PUT /api/modules/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, tags, status } = body;

        const db = getDb();
        const existing = db.prepare('SELECT * FROM modules WHERE id = ?').get(id) as Record<string, unknown> | undefined;
        if (!existing) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const now = new Date().toISOString();
        db.prepare(`
      UPDATE modules SET title = ?, content = ?, tags = ?, status = ?, updated_at = ? WHERE id = ?
    `).run(
            title?.trim() || existing.title,
            content !== undefined ? content : existing.content,
            tags !== undefined ? JSON.stringify(tags) : existing.tags as string,
            status || existing.status,
            now,
            id
        );

        // Update project timestamp
        db.prepare('UPDATE projects SET updated_at = ? WHERE id = ?').run(now, existing.project_id);

        const module = db.prepare(`
      SELECT m.*, p.name as project_name,
        (SELECT COUNT(*) FROM runs WHERE module_id = m.id) as run_count,
        (SELECT COUNT(*) FROM module_versions WHERE module_id = m.id) as version_count
      FROM modules m
      LEFT JOIN projects p ON m.project_id = p.id
      WHERE m.id = ?
    `).get(id);
        return NextResponse.json(module);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
    }
}

// DELETE /api/modules/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();
        const existing = db.prepare('SELECT * FROM modules WHERE id = ?').get(id);
        if (!existing) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        db.prepare('DELETE FROM modules WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
    }
}
