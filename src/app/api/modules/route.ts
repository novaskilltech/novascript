import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/modules — List modules (optionally filter by project_id)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        const db = getDb();
        let modules;

        if (projectId) {
            modules = db.prepare(`
        SELECT m.*, 
          (SELECT COUNT(*) FROM runs WHERE module_id = m.id) as run_count,
          (SELECT COUNT(*) FROM module_versions WHERE module_id = m.id) as version_count
        FROM modules m
        WHERE m.project_id = ?
        ORDER BY m.updated_at DESC
      `).all(projectId);
        } else {
            modules = db.prepare(`
        SELECT m.*, p.name as project_name,
          (SELECT COUNT(*) FROM runs WHERE module_id = m.id) as run_count,
          (SELECT COUNT(*) FROM module_versions WHERE module_id = m.id) as version_count
        FROM modules m
        LEFT JOIN projects p ON m.project_id = p.id
        ORDER BY m.updated_at DESC
      `).all();
        }

        return NextResponse.json(modules);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
    }
}

// POST /api/modules — Create a module
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_id, title, content, tags, status } = body;

        if (!project_id || !title || typeof title !== 'string' || title.trim().length === 0) {
            return NextResponse.json({ error: 'project_id and title are required' }, { status: 400 });
        }

        const db = getDb();

        // Verify project exists
        const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(project_id);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const id = uuidv4();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT INTO modules (id, project_id, title, content, tags, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            id,
            project_id,
            title.trim(),
            content || '',
            JSON.stringify(tags || []),
            status || 'draft',
            now,
            now
        );

        // Update project timestamp
        db.prepare('UPDATE projects SET updated_at = ? WHERE id = ?').run(now, project_id);

        const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(id);
        return NextResponse.json(module, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
    }
}
