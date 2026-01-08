// app/downloads/custom_downloads/page.tsx
import { Suspense } from 'react';
import CustomDownloadsPage from './client-page';

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <CustomDownloadsPage />
        </Suspense>
    );
}