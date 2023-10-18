import {useLifeFieldsByLocations} from 'src/hooks';
import {LifeInputLocationConstants, LifeInputPageConstants, LifeInputTypeConstants} from 'src/constants';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

export function useGetLifeFieldsOnPage(page: string): Array<ILifeField> {

    const requiredLifeFieldLocations = [
        {
            page: LifeInputPageConstants.CUSTOMER_THREE_PAGE,
            locations: [
                LifeInputLocationConstants.CUSTOMER_INFO,
                LifeInputLocationConstants.SHIPPING,
                LifeInputLocationConstants.BILLING_ADDRESS_AFTER,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
                LifeInputLocationConstants.MAIN_CONTENT_BEGINNING,
                LifeInputLocationConstants.MAIN_CONTENT_END,
            ],
        },
        {
            page: LifeInputPageConstants.SHIPPING_THREE_PAGE,
            locations: [
                LifeInputLocationConstants.SHIPPING_LINES,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
                LifeInputLocationConstants.MAIN_CONTENT_BEGINNING,
                LifeInputLocationConstants.MAIN_CONTENT_END,
            ],
        },
        {
            page: LifeInputPageConstants.PAYMENT_THREE_PAGE,
            locations: [
                LifeInputLocationConstants.PAYMENT_METHOD_ABOVE,
                LifeInputLocationConstants.PAYMENT_GATEWAY,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
                LifeInputLocationConstants.MAIN_CONTENT_BEGINNING,
                LifeInputLocationConstants.MAIN_CONTENT_END,
            ],
        },
        {
            page: LifeInputPageConstants.ONE_PAGE,
            locations: [
                LifeInputLocationConstants.CUSTOMER_INFO,
                LifeInputLocationConstants.SHIPPING,
                LifeInputLocationConstants.BILLING_ADDRESS_AFTER,
                LifeInputLocationConstants.SHIPPING_LINES,
                LifeInputLocationConstants.PAYMENT_METHOD_ABOVE,
                LifeInputLocationConstants.PAYMENT_GATEWAY,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
                LifeInputLocationConstants.MAIN_CONTENT_BEGINNING,
                LifeInputLocationConstants.MAIN_CONTENT_END,
            ],
        },
        {
            page: LifeInputPageConstants.THANK_YOU_PAGE,
            locations: [
                LifeInputLocationConstants.THANK_YOU_MESSAGE,
                LifeInputLocationConstants.ORDER_CONFIRMATION,
                LifeInputLocationConstants.ORDER_DETAILS,
            ],
        },
        {
            page: LifeInputPageConstants.PAYPAL_ADDITIONAL_INFO_PAGE,
            locations: [
                LifeInputLocationConstants.PAYPAL_ADDITIONAL_INFORMATION,
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
                LifeInputLocationConstants.MAIN_CONTENT_BEGINNING,
                LifeInputLocationConstants.MAIN_CONTENT_END,
            ],
        },
        {
            page: LifeInputPageConstants.PAYPAL_PAYMENT_PAGE,
            locations: [
                LifeInputLocationConstants.BELOW_ACTIONS,
                LifeInputLocationConstants.SUMMARY_ABOVE_HEADER,
                LifeInputLocationConstants.MAIN_CONTENT_BEGINNING,
                LifeInputLocationConstants.MAIN_CONTENT_END,
            ],
        },
    ];

    const locations = requiredLifeFieldLocations.filter(value => value.page === page).map(value => value.locations);
    const lifeFields = useLifeFieldsByLocations(locations[0]);
    return lifeFields.filter(value => (value.input_type !== LifeInputTypeConstants.HTML));
}