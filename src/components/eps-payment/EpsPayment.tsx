import React, {useEffect} from 'react';
import {Constants} from 'src/constants';
import {useGetAppSettingData,} from 'src/hooks';
import {IEpsPayments} from 'src/types';
import {useDispatch} from 'react-redux';
import {initEpsPaymentSdk} from 'src/eps';
import {useHistory} from 'react-router';
import {actionSetButtonDisable} from 'src/action';
import {logError} from 'src/utils';

export function EpsPayment(): React.ReactElement {
    const dispatch = useDispatch();
    const history = useHistory();
    const boldPayments = useGetAppSettingData('epsBoldPayment') as IEpsPayments | null;

    useEffect(() => {
        if(!boldPayments) {
            dispatch(initEpsPaymentSdk(history));
        }
    }, [boldPayments]);

    useEffect(() => {
        boldPayments?.renderPayments(Constants.EPS_IFRAME)
            .then(() => {
                dispatch(actionSetButtonDisable('paymentPageButton', false));
            })
            .catch((e: Error) => {
                dispatch(actionSetButtonDisable('paymentPageButton', false));
                logError(e);
            });
    }, [boldPayments]);

    return (
        <div id={Constants.EPS_IFRAME} data-testid={`${Constants.EPS_IFRAME}-test`}/>
    );
}
