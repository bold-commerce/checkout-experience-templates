import {NeuroIdConstants} from 'src/constants';
import {getNeuroIdPageName, neuroIdSubmit} from 'src/utils/neuroIdCalls';

export function neuroIdSubmitFromBreadcrumb(active: number): void {
    let pageName = '';
    switch (active) {
        case 1:
            pageName = getNeuroIdPageName(NeuroIdConstants.customerPage);
            break;
        case 2:
            pageName = getNeuroIdPageName(NeuroIdConstants.shippingPage);
            break;
        case 3:
            pageName = getNeuroIdPageName(NeuroIdConstants.paymentPage);
            break;
        default:
            break;
    }

    if (pageName) {
        neuroIdSubmit(pageName);
    }
}
