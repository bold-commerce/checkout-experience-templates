import {mocked} from 'jest-mock';
import {render} from '@testing-library/react';
import {ExternalPaymentGateway} from 'src/components/external-payment-gateway/external-payment-gateway';
import {useGetExternalPaymentGatewaySection} from 'src/hooks/useGetExternalPaymentGatewaySection';
import {ExternalPaymentGatewayIframe} from 'src/components/external-payment-gateway-iframe/externalPaymentGatewayIframe';
import {useGetIsSessionInitialized} from 'src/hooks';

jest.mock('src/hooks/useGetExternalPaymentGatewaySection');
jest.mock('src/hooks/useGetIsSessionInitialized');
jest.mock('src/components/external-payment-gateway-iframe/externalPaymentGatewayIframe');

const useGetExternalPaymentGatewaySectionMock = mocked(useGetExternalPaymentGatewaySection, true);
const ExternalPaymentGatewayIframeMock = mocked(ExternalPaymentGatewayIframe);
const useGetIsSessionInitializedMock = mocked(useGetIsSessionInitialized);

describe('Testing External Payment Gateway Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        ExternalPaymentGatewayIframeMock.mockImplementation(() => <div />);
    });

    test('rendering the component with iframe valid', () => {
        useGetExternalPaymentGatewaySectionMock.mockReturnValue({
            loading: false,
            isValidAddress: true,
            isValidShippingLine: true,
            notValidText: '',
            fieldSectionText: '',
            onLoad: () => 1,
            isValidExternalLoad: true,
        });
        const gateway = {
            'is_test': true,
            'iframe_url': 'testURL',
            'target_div': 'payment',
            'base_url': 'testURL',
            'public_id': 'publicID',
            'location': 'payment_method_below',
            'currency': 'USD'
        };

        const {container} = render(<ExternalPaymentGateway
            externalPaymentGateway={gateway}
            position={'payment_method_below'}
            loadIframeImmediately={false}
            showTitle={false}
            key={''}
        />);

        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('hidden').length).toBe(0);
    });

    test('rendering the component with iframe disabled', () => {
        useGetIsSessionInitializedMock.mockReturnValue(false);
        useGetExternalPaymentGatewaySectionMock.mockReturnValue({
            loading: false,
            isValidAddress: true,
            isValidShippingLine: true,
            notValidText: '',
            fieldSectionText: '',
            onLoad: () => 1,
            isValidExternalLoad: true,
        });
        const gateway = {
            'is_test': true,
            'iframe_url': 'testURL',
            'target_div': 'payment',
            'base_url': 'testURL',
            'public_id': 'publicID',
            'location': 'payment_method_below',
            'currency': 'USD'
        };

        const {container} = render(<ExternalPaymentGateway
            externalPaymentGateway={gateway}
            position={'payment_method_below'}
            loadIframeImmediately={true}
            showTitle={false}
            key={''}
        />);

        expect(container.getElementsByClassName('payment').length).toBe(1);
        expect(container.getElementsByClassName('hidden').length).toBe(0);
    });
});
