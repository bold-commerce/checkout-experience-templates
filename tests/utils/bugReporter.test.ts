import {environmentTypes} from '@boldcommerce/checkout-frontend-library';
import Bugsnag from '@bugsnag/js';
import {ErrorInfo} from 'react';
import {mocked} from 'jest-mock';

import {
    init,
    leaveBreadcrumb,
    logComponentError,
    logError,
    setApplicationStateMetaDataFromResponse,
    setContext,
    setMetadata,
    setUser
} from 'src/utils/bugReporter';
import {initialDataMock} from 'src/mocks';
import {breadcrumbTypes, LIB_VERSION as appVersion} from 'src/constants';
import {IMetadata, IMetadataList} from 'src/types';
import {
    IApiReturnObject,
    IApiSuccessResponse,
    IInitializeOrderResponse
} from '@boldcommerce/checkout-frontend-library';

jest.mock('@bugsnag/js');
const bugsnagMock = mocked(Bugsnag, true);

describe('testing BugReporter', () => {
    const id = 'test-id';
    const email = 'test-email@example.com';
    const name = 'test-name';
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const startParamBaseMock = {
        apiKey: 'some-key',
        appVersion,
        appType: 'some-app-type',
        releaseStage: environmentTypes.production,
        maxBreadcrumbs: 100,
        metadata: {
            global: {
                platformType: 'testPlatform',
                publicOrderId: 'some-order-id',
                jwtToken: initialDataMock.jwt_token,
                initialData: initialDataMock.initial_data,
                shopAlias: 'test-shop',
                shopName: 'test-shop',
                environment: {type: environmentTypes.production},
                shopIdentifier: 'test-shop',
                returnUrl: 'https://test.example.com',
                loginUrl: 'https://test.example.com',
                resumableUrl: 'https://test.example.com'
            }
        }
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window.bugsnagApiKey = 'some-key';
        window.enableConsole = false;
        window = Object.create(window);
        window.platformType = 'testPlatform';
        window.publicOrderId = 'some-order-id';
        window.initializedOrder = {data: initialDataMock};
        window.shopAlias = 'test-shop';
        window.shopName = 'test-shop';
        window.environment = {type: environmentTypes.production};
        window.shopIdentifier = 'test-shop';
        window.returnUrl = 'https://test.example.com';
        window.loginUrl = 'https://test.example.com';
        window.resumableUrl = 'https://test.example.com';
    });

    test('call init with no bugsnagApiKey', () => {
        window.bugsnagApiKey = '';
        init('some-app-type');

        expect(bugsnagMock.start).toHaveBeenCalledTimes(0);
    });

    test('call init', () => {
        init('some-app-type');

        expect(bugsnagMock.start).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.start).toHaveBeenCalledWith({...startParamBaseMock});
    });

    test('call init with local environment', () => {
        window.environment = {type: environmentTypes.local, path: 'checkout-some-path'};
        const startParamMock = {
            ...startParamBaseMock,
            releaseStage: 'some-path',
            metadata: {
                global: {
                    ...startParamBaseMock.metadata.global,
                    environment: window.environment
                }
            }
        };

        init('some-app-type');

        expect(bugsnagMock.start).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.start).toHaveBeenCalledWith(startParamMock);
    });

    test('call init with local environment and no path', () => {
        window.environment = {type: environmentTypes.local, path: undefined};
        const startParamMock = {
            ...startParamBaseMock,
            releaseStage: environmentTypes.local,
            metadata: {
                global: {
                    ...startParamBaseMock.metadata.global,
                    environment: window.environment
                }
            }
        };

        init('some-app-type');

        expect(bugsnagMock.start).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.start).toHaveBeenCalledWith(startParamMock);
    });

    test('call init with no environment', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.environment = undefined;
        const startParamMock = {
            ...startParamBaseMock,
            releaseStage: 'unknown',
            metadata: {
                global: {
                    ...startParamBaseMock.metadata.global,
                    environment: window.environment
                }
            }
        };

        init('some-app-type');

        expect(bugsnagMock.start).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.start).toHaveBeenCalledWith(startParamMock);
    });

    test('call init with initializedOrder undefined', () => {
        window.environment = {type: environmentTypes.local, path: 'checkout-some-path'};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.initializedOrder = undefined;
        const startParamMock = {
            ...startParamBaseMock,
            releaseStage: 'some-path',
            metadata: {
                global: {
                    ...startParamBaseMock.metadata.global,
                    jwtToken: '',
                    initialData: [],
                    environment: window.environment
                }
            }
        };

        init('some-app-type');

        expect(bugsnagMock.start).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.start).toHaveBeenCalledWith(startParamMock);
    });

    test('call logComponentError', () => {
        const error = new Error('test');
        const errorInfo: ErrorInfo = {componentStack: 'some component stack trace'};

        logComponentError(error, errorInfo);

        expect(bugsnagMock.notify).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.notify).toHaveBeenCalledWith(error);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledWith('react', errorInfo);
    });

    test('call logError with enableConsole true', () => {
        window.enableConsole = true;
        const error = new Error('test');
        const metadataList: IMetadataList = [{section: 'some-section', values: {someKey: 'some value'}}];
        consoleErrorSpy.mockImplementationOnce(() => {/*Silence expected console error*/});

        logError(error, metadataList);

        expect(bugsnagMock.notify).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.notify).toHaveBeenCalledWith(error);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledWith(metadataList[0].section, metadataList[0].values);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    test('call leaveBreadcrumb', () => {
        const message = 'test';
        const metadata: IMetadata = {someKey: 'some value'};
        const type = breadcrumbTypes.manual;

        leaveBreadcrumb(message, metadata, type);

        expect(bugsnagMock.leaveBreadcrumb).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.leaveBreadcrumb).toHaveBeenCalledWith(message, metadata, type);
    });

    test('call setContext', () => {
        const ctx = 'test';

        setContext(ctx);

        expect(bugsnagMock.setContext).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.setContext).toHaveBeenCalledWith(ctx);
    });

    test('call setMetadata', () => {
        const section = 'test';
        const metadata: IMetadata = {someKey: 'some value'};

        setMetadata(section, metadata);

        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledWith(section, metadata);
    });

    test('call setUser', () => {
        setUser(id, email, name);

        expect(bugsnagMock.setUser).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.setUser).toHaveBeenCalledWith(id, email, name);
    });

    test('call setApplicationStateMetaDataFromResponse with app state in response key', () => {
        const response = {application_state: {customer: {platform_id: id, email_address: email, first_name: name}}} as unknown as IApiSuccessResponse;
        const resp = {response} as IApiReturnObject;

        setApplicationStateMetaDataFromResponse(resp);

        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledWith('application_state', response.application_state);
        expect(bugsnagMock.setUser).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.setUser).toHaveBeenCalledWith(id, email, name);
    });

    test('call setApplicationStateMetaDataFromResponse with no response key', () => {
        const resp = {response: undefined} as unknown as IApiReturnObject;

        setApplicationStateMetaDataFromResponse(resp);

        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(0);
        expect(bugsnagMock.setUser).toHaveBeenCalledTimes(0);
    });

    test('call setApplicationStateMetaDataFromResponse with app state in data key', () => {
        const applicationState = {customer: {platform_id: id, email_address: email, first_name: name}};
        const dataResponse = {application_state: applicationState} as unknown as IInitializeOrderResponse;
        const response = {data: dataResponse} as unknown as IApiSuccessResponse;
        const resp = {response} as IApiReturnObject;

        setApplicationStateMetaDataFromResponse(resp);

        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledWith('application_state', applicationState);
        expect(bugsnagMock.setUser).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.setUser).toHaveBeenCalledWith(id, email, name);
    });

    test('call setApplicationStateMetaDataFromResponse with no data key', () => {
        const response = {data: undefined} as unknown as IApiSuccessResponse;
        const resp = {response} as IApiReturnObject;

        setApplicationStateMetaDataFromResponse(resp);

        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(0);
        expect(bugsnagMock.setUser).toHaveBeenCalledTimes(0);
    });

    test('call setApplicationStateMetaDataFromResponse with no customer id', () => {
        const applicationState = {customer: {email_address: email, first_name: name}};
        const dataResponse = {application_state: applicationState} as unknown as IInitializeOrderResponse;
        const response = {data: dataResponse} as unknown as IApiSuccessResponse;
        const resp = {response} as IApiReturnObject;

        setApplicationStateMetaDataFromResponse(resp);

        expect(bugsnagMock.addMetadata).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.addMetadata).toHaveBeenCalledWith('application_state', applicationState);
        expect(bugsnagMock.setUser).toHaveBeenCalledTimes(1);
        expect(bugsnagMock.setUser).toHaveBeenCalledWith(undefined, email, name);
    });
});
