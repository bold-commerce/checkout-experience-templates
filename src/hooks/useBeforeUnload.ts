import {useEffect} from 'react';
import {navigateDialog} from 'src/utils';
import {useGetAppSettingData} from 'src/hooks/useGetAppSettingData';

export function useBeforeUnload(): void {
    const allowNavigation = useGetAppSettingData('allowNavigation');
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            navigateDialog(event);
        };

        if (allowNavigation) {
            // don't hook into beforeunload
        } else {
            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [allowNavigation]);
}
