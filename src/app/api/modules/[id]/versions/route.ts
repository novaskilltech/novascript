import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/modules/[id]/versions — List versions
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

        const versions = db.prepare(`
      SELECT * FROM module_versions
      WHERE module_id = ?
      ORDER BY version_number DESC
    `).all(id);

        return NextResponse.json(versions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
    }
}

// POST /api/modules/[id]/versions — Save a new version
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { changelog } = body;

        const db = getDb();
        const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(id) as Record<string, unknown> | undefined;
        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        // Get next version number
        const lastVersion = db.prepare(`
      SELECT MAX(version_number) as max_version FROM module_versions WHERE module_id = ?
    `).get(id) as Record<string, unknown>;
        const nextVersion = ((lastVersion?.max_version as number) || 0) + 1;

        const versionId = uuidv4();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT INTO module_versions (id, module_id, content, changelog, version_number, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(versionId, id, module.content, changelog?.trim() || '', nextVersion, now);

        const version = db.prepare('SELECT * FROM module_versions WHERE id = ?').get(versionId);
        return NextResponse.json(version, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save version' }, { status: 500 });
    }
}
