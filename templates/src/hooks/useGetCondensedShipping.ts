import { isObjectEmpty } from 'src/utils';
import { IAddress, ICondensedShipping } from 'src/types';

export function useGetCondensedShipping (address: IAddress): ICondensedShipping {
    const name = `${address.first_name} ${address.last_name}`;
    const shippingInfo = [
        address.address_line_1,
        address.address_line_2,
        address.city,
        address.province,
        address.postal_code,
        address.country
    ];
    const addressLine = shippingInfo.filter(x => !(isObjectEmpty(x))).join(', ');

    return { name, addressLine, phone: address.phone_number };
}
