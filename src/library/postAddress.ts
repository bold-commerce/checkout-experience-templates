import {Dispatch} from 'redux';
import {Constants} from 'src/constants';
import {postShippingAddress, postBillingAddress} from 'src/library';

export function postAddress(type: string) {
    return async function postAddressThunk(dispatch: Dispatch): Promise<void> {
        if(type === Constants.SHIPPING){
            return await dispatch(postShippingAddress);
        } else {
            return await dispatch(postBillingAddress);
        }
    };
}
