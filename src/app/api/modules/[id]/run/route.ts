import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateContent } from '@/lib/gemini';
import { fillTemplate } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

// POST /api/modules/[id]/run — Execute prompt via Gemini
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { variables, model } = body;

        const db = getDb();
        const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(id) as Record<string, unknown> | undefined;

        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        // Fill template with variables
        const prompt = fillTemplate(module.content as string, variables || {});

        // Call Gemini
        const result = await generateContent(prompt, model);

        // Save run to history
        const runId = uuidv4();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT INTO runs (id, module_id, inputs_json, output_text, model, latency_ms, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            runId,
            id,
            JSON.stringify(variables || {}),
            result.text,
            result.model,
            result.latencyMs,
            now
        );

        return NextResponse.json({
            id: runId,
            output_text: result.text,
            model: result.model,
            latency_ms: result.latencyMs,
            created_at: now,
            inputs_json: JSON.stringify(variables || {}),
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to run module';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
