import {useEffect, useRef} from 'react';
import {useGetFlashErrors} from 'src/hooks';
import {useBuyNowContainerPage} from 'src/themes/buy-now/hooks';
import {IndexPage, ShippingPage, SummaryPage} from 'src/themes/buy-now/pages';

export function BuyNowContainerPage() : React.ReactElement{
    const indexRef = useRef<HTMLDivElement>(null);
    const shippingRef = useRef<HTMLDivElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const {openSection, navigateTo, containerStyle} = useBuyNowContainerPage({indexRef, shippingRef, summaryRef});
    const errors = useGetFlashErrors();

    useEffect(() => {
        if(errors.length > 0) {
            navigateTo('/');
        }
    }, [errors]);

    return (
        <div className="checkout-experience-container" >
            <div className="buy-now-container" style={containerStyle}>
                <IndexPage ref={indexRef} show={openSection === '/'} navigateTo={navigateTo}/>
                <ShippingPage ref={shippingRef} show={openSection === '/shipping'} navigateTo={navigateTo}/>
                <SummaryPage ref={summaryRef} show={openSection === '/summary'} navigateTo={navigateTo} />
            </div>
        </div>
    );
}
