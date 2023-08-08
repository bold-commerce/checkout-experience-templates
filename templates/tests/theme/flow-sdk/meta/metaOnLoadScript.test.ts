import { metaOnLoadScript, MissingMetapayObjectError } from 'src/themes/flow-sdk/meta/metaOnLoadScript';
import { mocked } from 'jest-mock';
import { logger } from 'src/themes/flow-sdk/logger';
import { metaInitPaymentClient, metaCheckAvailability, metaRenderButton } from 'src/themes/flow-sdk/meta/';
import { IMetaPay } from 'src/themes/flow-sdk/types';
import { checkoutFlow } from 'src/themes/flow-sdk/flowState';

jest.mock('src/themes/flow-sdk/logger')
jest.mock('src/themes/flow-sdk/meta/metaInitPaymentClient')
jest.mock('src/themes/flow-sdk/meta/metaCheckAvailability')
jest.mock('src/themes/flow-sdk/flowState')
jest.mock('src/themes/flow-sdk/meta/metaRenderButton')

const loggerMock = mocked(logger, true);
const metaInitPaymentClientMock = mocked(metaInitPaymentClient, true);
const metaCheckAvailabilityMock = mocked(metaCheckAvailability, true);
const checkoutFlowMock = mocked(checkoutFlow, true);
const metaRenderButtonMock = mocked(metaRenderButton, true);

describe('metaOnLoadScript', () => {

    it('should log error if window.metapay is not defined', async () => {
        window.metapay = undefined;
        await expect(metaOnLoadScript()).rejects.toEqual(MissingMetapayObjectError);
        expect(loggerMock).toHaveBeenCalled();
    });

    it('Metapay causes error', async () => {
        window.metapay = {
            PaymentClient: Object.assign(jest.fn(), { message: "Some Message" }),
            PaymentError: Object.assign(jest.fn(), { message: "Some Error Message" })
        } as IMetaPay;

        checkoutFlowMock.params.flowElementId = 'someId';

        await expect(metaOnLoadScript()).resolves.toEqual(undefined);

        expect(metaInitPaymentClientMock).toHaveBeenCalled();
        expect(metaCheckAvailabilityMock).toHaveBeenCalled();
        expect(metaRenderButtonMock).toHaveBeenCalled();
    });

    it('should log error if flowElementID is not set in pararms', async () => {
        window.metapay = {
            PaymentClient: Object.assign(jest.fn(), { message: "Some Message" }),
            PaymentError: Object.assign(jest.fn(), { message: "Some Error Message" })
        } as IMetaPay;

        checkoutFlowMock.params.flowElementId = "";

        await expect(metaOnLoadScript()).resolves.toEqual(undefined);

        expect(metaInitPaymentClientMock).toHaveBeenCalled();
        expect(metaCheckAvailabilityMock).toHaveBeenCalled();
        expect(loggerMock).toHaveBeenCalled();
    });
})