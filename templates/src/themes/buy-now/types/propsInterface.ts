import { CSSProperties, Dispatch, RefObject, SetStateAction } from 'react';
export interface IUseModal{
    isOpen: boolean;
}

export interface IUseShippingPage {
    closeBuyNow: () => void;
    flashText: string;
    stopBack: boolean;
    setStopBack: Dispatch<SetStateAction<boolean>>;
    isValidAddress: boolean;
}

export interface IModalProps {
    children: React.ReactNode,
}

export interface IUseBuyNowContainerPage {
    openSection: string, 
    navigateTo: (page) => void, 
    containerStyle: CSSProperties, 
}

export interface IUseBuyNowContainerPageProps {
    indexRef: RefObject<HTMLElement>, 
    shippingRef: RefObject<HTMLElement>, 
    summaryRef: RefObject<HTMLElement>
}

export interface IBuyNowContainerPageProps {
    show: boolean;
    navigateTo: (page: string) => void;
}
