import { CSSProperties, RefObject, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { sendEvents, sendPageView } from 'src/analytics';
import { IUseBuyNowContainerPage, IUseBuyNowContainerPageProps } from 'src/themes/buy-now/types';
import {useDispatch} from 'react-redux';
import {checkInventory} from 'src/library';
import {checkInventoryStage} from '@bold-commerce/checkout-frontend-library';

export function useBuyNowContainerPage(props : IUseBuyNowContainerPageProps) : IUseBuyNowContainerPage {
    const dispatch = useDispatch();
    const [ openSection, setOpenSection ] = useState('/');
    const [ openRef, setOpenRef ] = useState<RefObject<HTMLElement>>(props.indexRef);
    const [ containerStyle, setContainerStyle ] = useState<CSSProperties>({
        height: '0px',
        overflow: 'hidden',
        maxHeight: '100%',
    });

    const navigateTo = useCallback((page) => {
        setOpenSection(page);
        
        switch(page){
            case '/summary':
                setOpenRef(props.summaryRef);
                break;
            case '/shipping':
                setOpenRef(props.shippingRef);
                break;
            default:
                setOpenRef(props.indexRef);
                break;
        }
    }, []);

    useEffect(() => {
        sendPageView(openSection);
        sendEvents('Checkout', `Landed on buy now ${openSection} page`);
        dispatch(checkInventory(checkInventoryStage.initial));
    }, [openSection]);

    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            const height = (openRef.current as HTMLElement).clientHeight;
            setContainerStyle(ps => ({...ps, height: `${height}px`, overflow: 'auto'}));
        });

        openRef.current && resizeObserver.observe(openRef.current);
        return resizeObserver.disconnect.bind(resizeObserver);
    }, [openRef]);

    return {
        openSection,
        navigateTo,
        containerStyle,
    };
}
