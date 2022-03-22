import {Constants} from 'src/constants';

export function getPigiIframe(): HTMLElement | null{
    return document.getElementById(Constants.PIGI_IFRAME);
}

