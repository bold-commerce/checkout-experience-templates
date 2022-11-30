import React from 'react';
import {TextWithCenterLine} from 'src/components';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetAppSettingData} from 'src/hooks';

export function ExpressPaymentGateway(): React.ReactElement {
    const isAnyButtonEnabled = useGetAppSettingData('isExpressPaySectionEnable') as boolean;

    return (
        <section id="alternative-payment-method-container" className={!isAnyButtonEnabled ? 'hidden' : ''}>
            <TextWithCenterLine text={getTerm('use_wallet_pay_express_payment', Constants.PAYMENT_INFO)} />
            <div id="express-payment-container" className="express-payment-container">
            </div>
            <TextWithCenterLine text={getTerm('use_wallet_pay_or', Constants.PAYMENT_INFO)} />
        </section>
    );
}
