import type { TokenConfig } from '@/types/config';

export interface SavedProject {
    id: string;
    tokenName: string;
    tokenSymbol: string;
    contractAddress: string;
    createdAt: string;       // ISO string
    status: 'Live' | 'Draft';
    config: TokenConfig;
}

const STORAGE_KEY = 'bnb_launchpad_projects';

export function getSavedProjects(): SavedProject[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveProject(config: TokenConfig, contractAddress: string): SavedProject {
    const project: SavedProject = {
        id: crypto.randomUUID(),
        tokenName: config.tokenName,
        tokenSymbol: config.tokenSymbol ?? (config as any).ticker ?? 'TKN',
        contractAddress,
        createdAt: new Date().toISOString(),
        status: 'Live',
        config,
    };

    const existing = getSavedProjects();
    existing.unshift(project); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return project;
}

export function deleteProject(id: string): void {
    const existing = getSavedProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}
