import {
    IApplicationState,
    IEnvironment,
    ILineItemRequestWithPlatformId,
    ILineItemRequestWithSku
} from '@boldcommerce/checkout-frontend-library';
import {IFlow, IMetaFlowSettings, IMetaPaymentError} from 'src/themes/flow-sdk/types/meta';

export interface ICheckoutFlowParameters {
    shopIdentifier: string;
    flowElementId?: string;
    boldSecureUrl?: string;
    environment?:IEnvironment;
    onAction?: IOnAction | null;
}

export type IOnCheckoutClickEvent = (event?: MouseEvent) => void;

export interface IProcessOrderResponse {
    application_state?: IApplicationState;
}

export type IOnAction = (actionType: string, payload?: Record<string, unknown> | IProcessOrderResponse | IMetaPaymentError) => void;

export type IOnGoingRequestTypes = 'onPaymentDetailsChanged' | 'onPaymentConsent';

export interface ICheckoutFlow {
    params: Required<ICheckoutFlowParameters>;
    flow_settings: Record<string, unknown> | IFlow | IMetaFlowSettings;
    canCheckout: boolean;
    onCheckoutClick: IOnCheckoutClickEvent | null;
    onGoingRequests: Array<IOnGoingRequestTypes>
}

export interface IFlowType {
    META: string;
}

export type IAddLineItemRequest = ILineItemRequestWithPlatformId | ILineItemRequestWithSku;
