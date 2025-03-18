import {getOrderInitialData} from '@boldcommerce/checkout-frontend-library';
import {isObjectEmpty} from 'src/utils';

export function getPhoneNumber(phone = ''): string {
    const {general_settings} = getOrderInitialData();
    if(general_settings.checkout_process.phone_number_required && isObjectEmpty({phone})){
        return '1111111111';
    } else {
        return phone;
    }
}
