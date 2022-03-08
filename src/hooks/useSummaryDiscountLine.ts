import {useDispatch} from 'react-redux';
import {useGetIsLoading, useGetLoaderScreenVariable} from 'src/hooks';
import {useCallback} from 'react';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {deleteDiscounts} from 'src/library';
import {ISummaryDiscountLine} from 'src/types';


export function useSummaryDiscountLine(): ISummaryDiscountLine{
    const dispatch = useDispatch();
    const discountCloseLoading = useGetLoaderScreenVariable('discountClose');
    const isLoading = useGetIsLoading();
    const deleteElementFromState = useCallback((eventName: string, id: string) => {
        dispatch(actionSetLoaderAndDisableButton('discountClose' , true));
        dispatch(deleteDiscounts(id));
    }, []);

    return {discountCloseLoading, deleteElementFromState, isLoading};
}
