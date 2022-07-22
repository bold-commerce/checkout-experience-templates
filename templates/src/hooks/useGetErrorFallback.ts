import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {NeuroIdConstants} from 'src/constants';
import {displayFatalErrorFromTranslation, getNeuroIdPageName, neuroIdSubmit} from 'src/utils';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetErrorFallback(): void {
    const state = useAppSelector(state => state);
    const dispatch = useDispatch();
    useEffect(() => {
        displayFatalErrorFromTranslation(state, dispatch);
    }, []);
    neuroIdSubmit(getNeuroIdPageName(NeuroIdConstants.errorPage));
}
