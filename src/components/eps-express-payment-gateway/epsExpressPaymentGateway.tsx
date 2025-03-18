import React, {useEffect, useState} from 'react';
import {
    useGetAppSettingData,
    useGetCountryInfoList,
    useGetGeneralSettingCheckoutFields,
    useGetShopName
} from 'src/hooks';
import {useDispatch} from 'react-redux';
import {initEpsPaymentSdk} from 'src/eps';
import {useHistory} from 'react-router';
import {IEpsPayments} from 'src/types';
import {TextWithCenterLine} from 'src/components';
import {getTerm, logError} from 'src/utils';
import {Constants} from 'src/constants';

export function EpsExpressPaymentGateway(): React.ReactElement {
    const dispatch = useDispatch();
    const shopName = useGetShopName();
    const isPhoneRequired = useGetGeneralSettingCheckoutFields('phone_number_required') as boolean;
    const history = useHistory();
    const boldPayments = useGetAppSettingData('epsBoldPayment') as IEpsPayments | null;
    const allowedShippingCountries = useGetCountryInfoList();
    const allowedCountryCodes = allowedShippingCountries.map(c => c.iso_code.toUpperCase());
    const [isSectionEnable, setSectionEnable] = useState(false);
    const epsExpressPayId = 'eps-express-pay';

    useEffect(() => {
        if(!boldPayments) {
            dispatch(initEpsPaymentSdk(history));
        }

        boldPayments?.renderWalletPayments(
            'eps-express-pay',
            {fastlane: false, isPhoneRequired: isPhoneRequired, shopName: shopName, allowedCountryCodes: allowedCountryCodes})
            .then(() => {
                if(document.getElementById(epsExpressPayId)?.innerHTML.trim() !== ''){
                    setSectionEnable(true);
                }
            })
            .catch((e: Error) => {
                logError(e);
            });
    }, [boldPayments, isPhoneRequired, shopName]);

    return (

        <section id="alternative-payment-method-container" className={!isSectionEnable ? 'hidden' : ''} data-testid="alternative-payment-method-container-test">
            <TextWithCenterLine text={getTerm('use_wallet_pay_express_payment', Constants.PAYMENT_INFO)} />
            <div id={epsExpressPayId}/>
            <TextWithCenterLine text={getTerm('use_wallet_pay_or', Constants.PAYMENT_INFO)} />
        </section>
    );
}
