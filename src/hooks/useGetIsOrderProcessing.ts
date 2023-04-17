import {useAppSelector} from 'src/hooks/rootHooks';
import {Constants} from 'src/constants';
import {shallowEqual} from 'react-redux';
import {getTerm} from 'src/utils';

export function useGetIsOrderProcessing(): boolean {
    const overlay = useAppSelector((state) => state.overlay, shallowEqual);
    const headerTerm = getTerm('loading_header', Constants.CONFIRMATION_PAGE_INFO, undefined, 'Processing order... ');
    return overlay.shown && overlay.header === headerTerm;
}
