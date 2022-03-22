import {useEffect} from 'react';
import {navigateDialog} from 'src/utils';

export function useBeforeUnload(): void {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            navigateDialog(event);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    });
}
