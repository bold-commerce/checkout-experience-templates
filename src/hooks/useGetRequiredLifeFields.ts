import {useGetRequiredLifeFieldsByLocations} from 'src/hooks';
import {LifeInputLocationConstants, LifeInputPageConstants, LifeInputTypeConstants} from 'src/constants';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

export function useGetRequiredLifeFields(page: string): Array<ILifeField> {

    const requiredLifeFieldLocations = [
        {
            page: LifeInputPageConstants.CUSTOMER_THREE_PAGE,
            locations: [
                LifeInputLocationConstants.CUSTOMER_INFO,
                LifeInputLocationConstants.SHIPPING,
                LifeInputLocationConstants.BILLING_ADDRESS_AFTER,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
            ],
        },
        {
            page: LifeInputPageConstants.SHIPPING_THREE_PAGE,
            locations: [
                LifeInputLocationConstants.SHIPPING_LINES,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
            ],
        },
        {
            page: LifeInputPageConstants.PAYMENT_THREE_PAGE,
            locations: [
                LifeInputLocationConstants.PAYMENT_GATEWAY,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
            ],
        },
        {
            page: LifeInputPageConstants.ONE_PAGE,
            locations: [
                LifeInputLocationConstants.CUSTOMER_INFO,
                LifeInputLocationConstants.SHIPPING,
                LifeInputLocationConstants.BILLING_ADDRESS_AFTER,
                LifeInputLocationConstants.SHIPPING_LINES,
                LifeInputLocationConstants.PAYMENT_GATEWAY,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
            ],
        }
    ];

    const locations = requiredLifeFieldLocations.filter(value => value.page === page).map(value => value.locations);
    const lifeFields = useGetRequiredLifeFieldsByLocations(locations[0]);
    return lifeFields.filter(value => (value.input_type === LifeInputTypeConstants.TEXT || value.input_type === LifeInputTypeConstants.TEXTAREA));
}