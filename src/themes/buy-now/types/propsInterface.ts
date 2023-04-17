import {CSSProperties, Dispatch, RefObject, SetStateAction} from 'react';
import {Options as FocusTrapOptions} from 'focus-trap';
export interface IUseModal {
    isOpen: boolean;
}

export interface IUseFocusTrap {
    activeElement: string,
    focusTrapOptions: FocusTrapOptions
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

export interface IUseGetCloseBuyNow {
    closeBuyNow: () => void;
    websiteName: string;
    terms: Record<string, string>;
    loginUrl: (event) => void;
}

export interface IUseCheckShippingAddress {
    isValid: boolean;
}