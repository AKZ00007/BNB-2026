'use client';

import { Download } from 'lucide-react';
import type { TokenConfig } from '@/types/config';

interface ExportButtonProps {
    config: TokenConfig;
}

export function ExportButton({ config }: ExportButtonProps) {
    function handleExport() {
        const json = JSON.stringify(config, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.tokenSymbol || 'token'}-config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"
        >
            <Download className="w-4 h-4" />
            Export JSON
        </button>
    );
}
