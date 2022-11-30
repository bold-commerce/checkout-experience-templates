import {useDispatch} from 'react-redux';
import {actionSetCallApiOnEvent} from 'src/action';

export function useSetApiCallOnEvent(callApiAtOnEvents: boolean): void {
    const dispatch = useDispatch();
    dispatch(actionSetCallApiOnEvent(callApiAtOnEvents));
}
