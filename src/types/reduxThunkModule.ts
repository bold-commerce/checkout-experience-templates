import {AnyAction} from 'redux';
import {ThunkAction} from 'redux-thunk';

declare module 'redux' {
    interface Dispatch<A extends Action = AnyAction> {
        <S, E, R>(asyncAction: ThunkAction<R, S, E, A>): R;
    }
}
