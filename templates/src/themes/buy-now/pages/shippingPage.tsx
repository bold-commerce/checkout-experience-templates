import classNames from 'classnames';
import React, { ForwardedRef, useCallback } from 'react';
import { FlashError, AddressSavedFieldRadioList, ShippingLines, NavigationHeading, CloseableHeader} from 'src/components';
import { Constants } from 'src/constants';
import { IBuyNowContainerPageProps } from 'src/themes/buy-now/types';
import { useShippingPage } from 'src/themes/buy-now/hooks';
import { getTerm } from 'src/utils';

function ShippingPage(props : IBuyNowContainerPageProps, ref: ForwardedRef<HTMLDivElement>): React.ReactElement {
    const { closeBuyNow, flashText, stopBack, setStopBack, isValidAddress } = useShippingPage();
    const backOnClick = useCallback(() => { 
        return () => ( isValidAddress ? props.navigateTo('/') : setStopBack(true) );
    }, [isValidAddress]);
    return (
        <div ref={ref} className={classNames('buy-now buy-now__secondary', props.show ? 'buy-now__secondary--open' : 'buy-now__secondary--closed')}>
            <div className='shipping-page' >
                <FlashError/>
                <CloseableHeader  className='buy-now__shipping-header' title={getTerm('shipping', Constants.SHIPPING_INFO)} onClose={closeBuyNow} />
                <NavigationHeading className="buy-now__back" text={getTerm('previous_step',Constants.SAVED_PAYMENT_INFO)} navigation={ backOnClick() }/>
                { stopBack &&
                    <div key={'flash-error-text-shipping'} className={'flash-error__container'}>
                        <span key={'flash-error-text-shipping'} className={'flash-error__text'}>
                            {flashText}
                        </span>
                    </div>
                }
                <AddressSavedFieldRadioList type={Constants.SHIPPING}/>
                <ShippingLines />
            </div>
        </div>
    );
}

export const ShippingPageWrapper = React.forwardRef(ShippingPage);
