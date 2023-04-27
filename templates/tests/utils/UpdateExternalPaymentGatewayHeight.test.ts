import {mocked} from 'jest-mock';
import {updateExternalPaymentGatewayHeight, getExternalPaymentGateway} from 'src/utils';

jest.mock('src/utils/getExternalPaymentGateway');
const getExternalPaymentGatewayMock = mocked(getExternalPaymentGateway, true);

describe('Test helpers for PIGI iFrame', () => {
    const externalPaymentGatewayHeightUpdate = '40px';
    let externalPaymentGatewayElementMock: HTMLElement;

    beforeEach(() => {
        jest.resetAllMocks();
        externalPaymentGatewayElementMock = document.createElement('iframe');
        getExternalPaymentGatewayMock.mockReturnValue(externalPaymentGatewayElementMock);
    });

    test('call updateExternalPaymentGateway when element missing', () => {
        getExternalPaymentGatewayMock.mockReturnValueOnce(null);

        updateExternalPaymentGatewayHeight(externalPaymentGatewayHeightUpdate, 'test_gateway_id');

        expect(getExternalPaymentGatewayMock).toHaveBeenCalledTimes(1);
        expect(externalPaymentGatewayElementMock.style.height).not.toBe(externalPaymentGatewayHeightUpdate);
    });

    test('call updateExternalPaymentGateway when element exists', () => {
        updateExternalPaymentGatewayHeight(externalPaymentGatewayHeightUpdate, 'test_gateway_id');

        expect(getExternalPaymentGatewayMock).toHaveBeenCalledTimes(1);
        expect(externalPaymentGatewayElementMock.style.height).toBe(externalPaymentGatewayHeightUpdate);
    });
});
