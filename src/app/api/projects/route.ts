import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/projects — List all projects
export async function GET() {
    try {
        const db = getDb();
        const projects = db.prepare(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM modules WHERE project_id = p.id) as module_count
      FROM projects p
      ORDER BY p.updated_at DESC
    `).all();
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST /api/projects — Create a project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const db = getDb();
        const id = uuidv4();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT INTO projects (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name.trim(), description?.trim() || '', now, now);

        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
