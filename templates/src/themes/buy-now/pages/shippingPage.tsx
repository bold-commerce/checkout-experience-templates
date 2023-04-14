import React, {ForwardedRef, useCallback} from 'react';
import {ShippingLines, NavigationHeading, CloseableHeader, Address} from 'src/components';
import {Constants} from 'src/constants';
import {IBuyNowContainerPageProps} from 'src/themes/buy-now/types';
import {useFocusTrap, useShippingPage} from 'src/themes/buy-now/hooks';
import {getTerm} from 'src/utils';
import FocusTrap from 'focus-trap-react';

function ShippingPage(props : IBuyNowContainerPageProps, ref: ForwardedRef<HTMLDivElement>): React.ReactElement {
    const {closeBuyNow, flashText, stopBack, setStopBack, isValidAddress} = useShippingPage();
    const placeholder = getTerm('enter_new_address', Constants.CUSTOMER_INFO);

    const backOnClick = useCallback(() => { 
        return isValidAddress ? props.navigateTo('/') : setStopBack(true);
    }, [isValidAddress]);
    const {focusTrapOptions} = useFocusTrap();

    return (
        <FocusTrap active={props.show} focusTrapOptions={focusTrapOptions}>
            <div ref={ref} className={`buy-now buy-now__shipping buy-now__secondary buy-now__secondary--${props.show ? 'open' : 'closed'}`}>
                <CloseableHeader  className='buy-now__shipping-header' title={getTerm('shipping', Constants.SHIPPING_INFO)} onClose={closeBuyNow} />
                <NavigationHeading className="buy-now__back" text={getTerm('previous_step',Constants.SAVED_PAYMENT_INFO)} navigation={backOnClick} />
                {stopBack && (
                    <div key="flash-error-text-shipping" className="flash-error__container">
                        <span key="flash-error-text-shipping" aria-live="assertive" className="flash-error__text">
                            {flashText}
                        </span>
                    </div>
                )}

                <Address
                    type={Constants.SHIPPING}
                    showTitle={false}
                    title=""
                    showSavedAddresses
                    savedAddressesSelectProps={{
                        autoSelect: true,
                        placeholderValue: placeholder,
                    }}
                />
                <ShippingLines showNoRatesAsAlert />
            </div>
        </FocusTrap>
    );
}

export const ShippingPageWrapper = React.forwardRef(ShippingPage);
