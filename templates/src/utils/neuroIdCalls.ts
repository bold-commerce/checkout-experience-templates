import {NeuroIdConstants} from 'src/constants';

export function neuroIdInit(pageName: string): void {
    if (typeof window['nid'] !== 'function') {
        return;
    }

    window['nid']('start', [pageName]);
    window['nid']('setUserId', [window.shopAlias]);
}

export function neuroIdSubmit(pageName: string): void {
    if (typeof window['nid'] !== 'function') {
        return;
    }

    window['nid']('applicationSubmit', [pageName]);
    window['nid']('sendData');
}

export function getNeuroIdPageName(pageName: string): string {
    const page = pageName === NeuroIdConstants.customerResumePage ? NeuroIdConstants.customerPage : pageName;
    return `${NeuroIdConstants.neuroIdPrefix}_${page}`;
}
