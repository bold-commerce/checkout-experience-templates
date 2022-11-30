import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {displayFatalErrorFromTranslation} from 'src/utils';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetErrorFallback(): void {
    const state = useAppSelector(state => state);
    const dispatch = useDispatch();
    useEffect(() => {
        displayFatalErrorFromTranslation(state, dispatch);
    }, []);
}
