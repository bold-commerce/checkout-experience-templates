import {Dispatch} from 'redux';
import {Constants} from 'src/constants';
import {deleteBillingAddress, deleteShippingAddress} from 'src/library';

export function deleteAddress(type: string) {
    return async function deleteAddressThunk(dispatch: Dispatch): Promise<void> {
        if(type === Constants.SHIPPING){
            return await dispatch(deleteShippingAddress);
        } else {
            return await dispatch(deleteBillingAddress);
        }
    };
}
