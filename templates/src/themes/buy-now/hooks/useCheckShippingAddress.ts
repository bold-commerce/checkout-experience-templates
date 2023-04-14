import {useMemo} from 'react';
import {Constants, errorTypes} from 'src/constants';
import {useGetErrors} from 'src/hooks';
import {IUseCheckShippingAddress} from 'src/themes/buy-now/types';

export const useCheckShippingAddress = (): IUseCheckShippingAddress => {
    const errors = useGetErrors();

    return {
        isValid: useMemo(() => {
            return !errors.some(e =>
                (e.type === errorTypes.address && e.address_type === Constants.SHIPPING) ||
                e.type === errorTypes.shipping_line
            );
        }, [errors]),
    };
};