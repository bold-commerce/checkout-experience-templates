import React from 'react';

import {Overlay, ErrorBoundary} from 'src/components';
import {useGetErrorFallback} from 'src/hooks';

export function ErrorFallback(): React.ReactElement {
    useGetErrorFallback();
    return (
        <div className={'App'}>
            <div className={'error-fallback'}>
                <ErrorBoundary>
                    <Overlay />
                </ErrorBoundary>
            </div>
        </div>
    );
}
