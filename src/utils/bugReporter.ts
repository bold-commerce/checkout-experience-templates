import {ErrorInfo} from 'react';
import {
    environmentTypes,
    IApiReturnObject,
    IApiSuccessResponse,
    IApplicationState,
    IInitializeOrderResponse
} from '@boldcommerce/checkout-frontend-library';
import Bugsnag, {BreadcrumbType} from '@bugsnag/js';

import {LIB_VERSION as appVersion} from 'src/constants';
import {IMetadata, IMetadataList} from 'src/types';
import {isObjectEmpty} from 'src/utils';

export function init(appType: string): void {
    if (window.bugsnagApiKey) {
        const releaseStage = window.environment?.type === environmentTypes.local
            ? window.environment.path?.replace(/checkout-*/, '') ?? environmentTypes.local
            : window.environment?.type ?? 'unknown';
        Bugsnag.start({
            apiKey: window.bugsnagApiKey,
            appVersion,
            appType,
            releaseStage,
            maxBreadcrumbs: 100,
            metadata: {
                global: {
                    platformType: window.platformType,
                    publicOrderId: window.publicOrderId,
                    jwtToken: (window.initializedOrder && window.initializedOrder.data && window.initializedOrder.data.jwt_token) ? window.initializedOrder.data.jwt_token : '',
                    initialData: (window.initializedOrder && window.initializedOrder.data && window.initializedOrder.data.initial_data) ? window.initializedOrder.data.initial_data : [],
                    shopAlias: window.shopAlias,
                    shopName: window.shopName,
                    environment: window.environment,
                    shopIdentifier: window.shopIdentifier,
                    returnUrl: window.returnUrl,
                    loginUrl: window.loginUrl,
                    resumableUrl: window.resumableUrl
                }
            }
        });
    }
}

export function logComponentError(error: Error, errorInfo?: ErrorInfo): void {
    setMetadata( 'react', errorInfo as unknown as { [key: string]: unknown });
    logError(error);
}

export function logError(error: Error, metadataList?: IMetadataList): void {
    if (window.bugsnagApiKey) {
        if (metadataList && metadataList.length > 0) {
            metadataList.forEach(data => setMetadata(data.section, data.values));
        }
        Bugsnag.notify(error);
    }
    // eslint-disable-next-line no-console
    window.enableConsole && console.error(error);
}

export function leaveBreadcrumb(message: string, metadata?: IMetadata, type?: BreadcrumbType): void {
    window.bugsnagApiKey && Bugsnag.leaveBreadcrumb(message, metadata, type as BreadcrumbType | undefined);
}

export function setContext(ctx: string): void {
    window.bugsnagApiKey && Bugsnag.setContext(ctx);
}

export function setMetadata(section: string, values: IMetadata): void {
    window.bugsnagApiKey && Bugsnag.addMetadata(section, values);
}

export function setUser(id?: string, email?: string, name?: string): void {
    window.bugsnagApiKey && Bugsnag.setUser(id, email, name);
}

export function setApplicationStateMetaDataFromResponse(response: IApiReturnObject): void {
    const resp: IApiSuccessResponse = response.response as IApiSuccessResponse;
    let applicationState: IApplicationState | null = null;
    if (resp?.application_state) {
        applicationState = resp.application_state;
    } else {
        const data: IInitializeOrderResponse = resp?.data as IInitializeOrderResponse;
        if (data?.application_state) {
            applicationState = data.application_state;
        }
    }
    if (applicationState) {
        setMetadata('application_state', applicationState as unknown as IMetadata);
        const {customer} = applicationState;
        if (!isObjectEmpty(customer)) {
            setUser(customer.platform_id ?? undefined, customer.email_address, customer.first_name);
        }
    }
}
