import {CSSProperties, RefObject, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {sendEvents, sendPageView} from 'src/analytics';
import {IUseBuyNowContainerPage, IUseBuyNowContainerPageProps} from 'src/themes/buy-now/types';

export function useBuyNowContainerPage(props : IUseBuyNowContainerPageProps) : IUseBuyNowContainerPage {
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
        sendEvents(`Landed on buy now ${openSection} page`, {'category': 'Checkout'});
    }, [openSection]);

    useLayoutEffect(() => {
        const openResizeObserver = new ResizeObserver(() => {
            if (openRef.current) {
                const height = (openRef.current as HTMLElement).clientHeight;
                setContainerStyle(ps => ({...ps, height: `${height}px`, 'overflowY': 'auto'}));
            }
        });

        const containerResizeObserver = new ResizeObserver(() => {
            if(openRef.current) {
                const height = (openRef.current.parentElement as HTMLElement).clientHeight ?? 0;
                document.body.style.setProperty('--buy-now-height', `${height}px`);
            }
        });
        
        openRef.current && openResizeObserver.observe(openRef.current);
        openRef.current && openRef.current.parentElement && containerResizeObserver.observe(openRef.current.parentElement);
        return () => {
            openResizeObserver.disconnect();
            containerResizeObserver.disconnect();
        };
    }, [openRef]);

    return {
        openSection,
        navigateTo,
        containerStyle,
    };
}
