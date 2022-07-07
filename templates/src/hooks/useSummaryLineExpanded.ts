import {useDispatch} from 'react-redux';
import {actionDeleteElement, actionSetLoaderAndDisableButton, REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action';
import {useGetCurrencyInformation, useGetIsLoading, useGetLoaderScreenVariable, useGetPaymentType} from 'src/hooks';
import {useCallback} from 'react';
import {deleteDiscounts} from 'src/library';
import {ISummaryLineExpanded, IUseSummaryLineExpanded} from 'src/types';
import {Constants} from 'src/constants';
import {getFieldNamesSummary} from 'src/utils';
import {IPayment} from '@bold-commerce/checkout-frontend-library';

export function useSummaryLineExpanded(props: ISummaryLineExpanded): IUseSummaryLineExpanded{

    const dispatch = useDispatch();
    const fieldNames = getFieldNamesSummary(props.eventToggleName);
    const textAlign = props.textAlign ? props.textAlign : 'right';
    const eventDeleteName = props.eventDeleteName ? props.eventDeleteName : '';
    const itemId = props.itemId ? props.itemId : '';
    const isLoading = useGetIsLoading();
    const {formattedPrice} = useGetCurrencyInformation();
    let content = props.content[fieldNames.content];
    const paymentMethodText = useGetPaymentType(props.content as IPayment);
    if(props.eventToggleName === Constants.PAYMENTS_TOGGLE){
        content = paymentMethodText;
    }
    let deleteElementFromState;
    let closeLoading = false;
    if(eventDeleteName){
        switch (eventDeleteName) {
            case REMOVE_DISCOUNT:
                closeLoading = useGetLoaderScreenVariable('discountClose');
                deleteElementFromState = useCallback((eventName: string, id: string) => {
                    dispatch(actionSetLoaderAndDisableButton('discountClose' , true));
                    dispatch(deleteDiscounts(id));
                }, []);
                break;
            case REMOVE_PAYMENT:
                closeLoading = useGetLoaderScreenVariable('paymentClose');
                deleteElementFromState = useCallback((eventName: string, id: string) => {
                    dispatch(actionDeleteElement(eventName, id));
                }, []);
                break;
            default:
                break;
        }
    }

    return {textAlign, eventDeleteName, itemId, deleteElementFromState, closeLoading, isLoading, formattedPrice, content};
}
