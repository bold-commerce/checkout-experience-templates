import { metaOnLoadScript, MissingMetapayObjectError } from 'src/themes/flow-sdk/meta/metaOnLoadScript';
import { mocked } from 'jest-mock';
import { logger } from 'src/themes/flow-sdk/logger';
import { metaInitPaymentClient, metaCheckAvailability, metaRenderButton } from 'src/themes/flow-sdk/meta/';
import { IMetaPay } from 'src/themes/flow-sdk/types';
import { checkoutFlow } from 'src/themes/flow-sdk/flowState';
import {FlowError} from "src/themes/flow-sdk/errors";

jest.mock('src/themes/flow-sdk/logger')
jest.mock('src/themes/flow-sdk/meta/metaInitPaymentClient')
jest.mock('src/themes/flow-sdk/meta/metaCheckAvailability')
jest.mock('src/themes/flow-sdk/meta/metaRenderButton')

const loggerMock = mocked(logger, true);
const metaInitPaymentClientMock = mocked(metaInitPaymentClient, true);
const metaCheckAvailabilityMock = mocked(metaCheckAvailability, true);
const metaRenderButtonMock = mocked(metaRenderButton, true);
const onActionMock = jest.fn();

describe('metaOnLoadScript', () => {

    it('should log error if window.metapay is not defined', async () => {
        window.metapay = undefined;

        checkoutFlow.params.onAction = onActionMock;

        await expect(metaOnLoadScript()).rejects.toEqual(MissingMetapayObjectError);

        expect(loggerMock).toHaveBeenCalled();
        expect(onActionMock).toHaveBeenCalled();
        expect(onActionMock).toHaveBeenCalledWith('FLOW_INITIALIZE', {success: false, error: new FlowError(MissingMetapayObjectError)});
    });

    it('Metapay causes error', async () => {
        window.metapay = {
            PaymentClient: Object.assign(jest.fn(), { message: "Some Message" }),
            PaymentError: Object.assign(jest.fn(), { message: "Some Error Message" })
        } as IMetaPay;

        checkoutFlow.params.flowElementId = 'someId';
        checkoutFlow.params.onAction = onActionMock;

        await expect(metaOnLoadScript()).resolves.toEqual(undefined);

        expect(metaInitPaymentClientMock).toHaveBeenCalled();
        expect(metaCheckAvailabilityMock).toHaveBeenCalled();
        expect(metaRenderButtonMock).toHaveBeenCalled();
        expect(onActionMock).toHaveBeenCalled();
        expect(onActionMock).toHaveBeenCalledWith('FLOW_INITIALIZE', {success: true});
    });

    it('should log error if flowElementID is not set in params', async () => {
        window.metapay = {
            PaymentClient: Object.assign(jest.fn(), { message: "Some Message" }),
            PaymentError: Object.assign(jest.fn(), { message: "Some Error Message" })
        } as IMetaPay;

        checkoutFlow.params.flowElementId = "";
        checkoutFlow.params.onAction = onActionMock;

        await expect(metaOnLoadScript()).resolves.toEqual(undefined);

        expect(metaInitPaymentClientMock).toHaveBeenCalled();
        expect(metaCheckAvailabilityMock).toHaveBeenCalled();
        expect(loggerMock).toHaveBeenCalled();
        expect(onActionMock).toHaveBeenCalled();
        expect(onActionMock).toHaveBeenCalledWith('FLOW_INITIALIZE', {success: true});
    });
})