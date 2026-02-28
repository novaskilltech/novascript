import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/projects/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();
        const project = db.prepare(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM modules WHERE project_id = p.id) as module_count
      FROM projects p WHERE p.id = ?
    `).get(id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PUT /api/projects/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description } = body;

        const db = getDb();
        const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const now = new Date().toISOString();
        db.prepare(`
      UPDATE projects SET name = ?, description = ?, updated_at = ? WHERE id = ?
    `).run(
            name?.trim() || (existing as Record<string, unknown>).name,
            description?.trim() ?? (existing as Record<string, unknown>).description,
            now,
            id
        );

        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE /api/projects/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();
        const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        db.prepare('DELETE FROM projects WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
