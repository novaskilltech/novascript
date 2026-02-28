import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { extractVariables } from '@/lib/utils';

// GET /api/modules/[id]/export?format=md|json
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'json';

        const db = getDb();
        const module = db.prepare(`
      SELECT m.*, p.name as project_name
      FROM modules m
      LEFT JOIN projects p ON m.project_id = p.id
      WHERE m.id = ?
    `).get(id) as Record<string, unknown> | undefined;

        if (!module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const variables = extractVariables(module.content as string);

        if (format === 'md') {
            const tags = JSON.parse((module.tags as string) || '[]');
            let markdown = `# ${module.title}\n\n`;
            markdown += `> Project: ${module.project_name || 'N/A'}\n\n`;

            if (tags.length > 0) {
                markdown += `**Tags:** ${tags.join(', ')}\n\n`;
            }

            markdown += `## Prompt Template\n\n\`\`\`\n${module.content}\n\`\`\`\n\n`;

            if (variables.length > 0) {
                markdown += `## Variables\n\n`;
                variables.forEach((v: string) => {
                    markdown += `- \`{${v}}\` — \n`;
                });
                markdown += '\n';
            }

            markdown += `---\n\n`;
            markdown += `*Status: ${module.status}*\n`;
            markdown += `*Created: ${module.created_at}*\n`;
            markdown += `*Updated: ${module.updated_at}*\n`;

            return new NextResponse(markdown, {
                headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${(module.title as string).replace(/[^a-zA-Z0-9]/g, '_')}.md"`,
                },
            });
        }

        // JSON format
        const exportData = {
            version: '1.0',
            type: 'novascript-module',
            module: {
                title: module.title,
                content: module.content,
                tags: JSON.parse((module.tags as string) || '[]'),
                status: module.status,
                variables,
                project_name: module.project_name,
                created_at: module.created_at,
                updated_at: module.updated_at,
            },
        };

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Disposition': `attachment; filename="${(module.title as string).replace(/[^a-zA-Z0-9]/g, '_')}.json"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
    }
}
