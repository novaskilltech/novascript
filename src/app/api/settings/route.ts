import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

interface Settings {
    geminiModel: string;
    hasApiKey: boolean;
}

function getSettings(): Settings {
    const defaultSettings: Settings = {
        geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        hasApiKey: !!process.env.GEMINI_API_KEY,
    };

    if (!existsSync(SETTINGS_FILE)) {
        return defaultSettings;
    }

    try {
        const data = JSON.parse(readFileSync(SETTINGS_FILE, 'utf-8'));
        return { ...defaultSettings, ...data, hasApiKey: !!process.env.GEMINI_API_KEY };
    } catch {
        return defaultSettings;
    }
}

// GET /api/settings
export async function GET() {
    return NextResponse.json(getSettings());
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { geminiModel } = body;

        const settings: Record<string, unknown> = {};
        if (geminiModel) {
            settings.geminiModel = geminiModel;
        }

        // Ensure data dir exists
        const dataDir = path.dirname(SETTINGS_FILE);
        const { mkdirSync } = await import('fs');
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        }

        writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));

        return NextResponse.json({
            ...settings,
            hasApiKey: !!process.env.GEMINI_API_KEY,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
