import { CSSProperties, RefObject, useCallback, useEffect, useState } from 'react';
import { IUseBuyNowContainerPage, IUseBuyNowContainerPageProps } from 'src/themes/buy-now/types';

export function useBuyNowContainerPage(props : IUseBuyNowContainerPageProps) : IUseBuyNowContainerPage {

    const [openSection, setOpenSection] = useState('/');
    const [openRef, setOpenRef] = useState<RefObject<HTMLElement>>(props.indexRef);
    const [containerHeight, setContainerHeight] = useState('0px');
    const [containerOverflow, setContainerOverflow] = useState('hidden');

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
        const resizeObserver = new ResizeObserver(() => {
            if(openRef.current && openRef.current.clientHeight){
                if(openRef.current.parentElement && openRef.current.parentElement.clientHeight < openRef.current.clientHeight) {
                    setContainerHeight('100%');
                    setContainerOverflow('auto');
                } else {
                    setContainerHeight(`${openRef.current.clientHeight}px`);
                    setContainerOverflow('hidden');
                }
            } else{
                setContainerHeight('0px');
            }
        });

        if(openRef.current){
            resizeObserver.observe(openRef.current);
        }
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [openRef]);

    const containerStyle : CSSProperties = window.innerWidth > 769 ? {
        height: containerHeight,
        overflow: containerOverflow
    } : {};

    return {openSection, navigateTo, containerStyle};
}
