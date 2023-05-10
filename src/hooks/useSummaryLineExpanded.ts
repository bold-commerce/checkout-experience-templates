import {useDispatch} from 'react-redux';
import {actionSetLoaderAndDisableButton, REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action';
import {useGetCurrencyInformation, useGetIsLoading, useGetLoaderScreenVariable, useGetPaymentType} from 'src/hooks';
import {useCallback} from 'react';
import {deleteDiscounts} from 'src/library';
import {ISummaryLineExpanded, IUseSummaryLineExpanded} from 'src/types';
import {Constants, CreditBrandedCardsBrand} from 'src/constants';
import {getFieldNamesSummary, getTerm} from 'src/utils';
import {IPayment} from '@boldcommerce/checkout-frontend-library';
import {deletePayment} from 'src/library/deletePayment';
import {deleteGiftCardPayment} from 'src/library/deleteGiftCardPayment';

export function useSummaryLineExpanded(props: ISummaryLineExpanded): IUseSummaryLineExpanded {
    const dispatch = useDispatch();
    const isLoading = useGetIsLoading();
    const paymentMethodText = useGetPaymentType(props.content as IPayment);
    const discountCloseLoading = useGetLoaderScreenVariable('discountClose');
    const paymentCloseLoading = useGetLoaderScreenVariable('paymentClose');
    const {formattedPrice} = useGetCurrencyInformation();
    const fieldNames = getFieldNamesSummary(props.eventToggleName);
    const textAlign = props.textAlign ? props.textAlign : 'right';
    const eventDeleteName = props.eventDeleteName ? props.eventDeleteName : '';
    const itemId = props.itemId ? props.itemId : '';
    const deleteDiscountElement = useCallback(() => {
        dispatch(actionSetLoaderAndDisableButton('discountClose' , true));
        dispatch(deleteDiscounts(itemId));
    }, []);
    const deleteGenericPaymentElement = useCallback(() => {
        dispatch(actionSetLoaderAndDisableButton('paymentClose' , true));
        dispatch(deletePayment(itemId));
    }, []);
    const deleteGiftCardPaymentElement = useCallback(() => {
        dispatch(actionSetLoaderAndDisableButton('paymentClose' , true));
        dispatch(deleteGiftCardPayment(itemId));
    }, []);
    let content = props.content[fieldNames.content] ?? '';
    let closeLoading = false;
    let deleteDataTestId = '';
    let deleteElement;
    let isGiftCard = false;

    if(props.eventToggleName === Constants.PAYMENTS_TOGGLE){
        const {driver, type, brand} = props.content as IPayment;
        const endingWithString = getTerm('ending_with', Constants.PAYMENT_INFO);
        isGiftCard = `${type}${driver}`.toLowerCase().replace(/\s|_/g, '').includes('giftcard');
        content = CreditBrandedCardsBrand.ALL_CARDS.includes(brand?.toLowerCase() ?? '') ? `${content} ${endingWithString} ${paymentMethodText}` : paymentMethodText;
    }

    if(eventDeleteName){
        switch (eventDeleteName) {
            case REMOVE_DISCOUNT:
                deleteDataTestId = 'delete-discount';
                closeLoading = discountCloseLoading;
                deleteElement = deleteDiscountElement;
                break;
            case REMOVE_PAYMENT:
                deleteDataTestId = 'delete-payment';
                closeLoading = paymentCloseLoading;
                deleteElement = isGiftCard ? deleteGiftCardPaymentElement : deleteGenericPaymentElement;
                break;
            default:
                break;
        }
    }

    return {textAlign, eventDeleteName, itemId, deleteElement, closeLoading, isLoading, formattedPrice, content, deleteDataTestId};
}
