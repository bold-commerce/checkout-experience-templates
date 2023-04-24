import {mocked} from 'jest-mock';
import {render} from '@testing-library/react';
import {ExternalPaymentGatewayIframe} from 'src/components';
import {useGetExternalPaymentGatewayLoading, useGetPigiDisplaySca} from 'src/hooks';

jest.mock('src/hooks/useGetExternalPaymentGateways');
jest.mock('src/hooks/useGetPigiDisplaySca');
const useGetExternalPaymentGatewayLoadingMock = mocked(useGetExternalPaymentGatewayLoading, true);
const useGetPigiDisplayScaMock = mocked(useGetPigiDisplaySca, true);

describe('Testing External Payment Gateway Iframe Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        useGetExternalPaymentGatewayLoadingMock.mockReturnValue(true);
        useGetPigiDisplayScaMock.mockReturnValue(false);
    });

    test('rendering the component with button enabled', () => {
        const gateway = {
            'is_test': true,
            'iframe_url': 'testURL',
            'target_div': 'payment',
            'base_url': 'testURL',
            'public_id': 'publicID',
            'location': 'payment_method_below',
            'currency': 'USD'
        };

        const {container} = render(<ExternalPaymentGatewayIframe
            externalPaymentGateway={gateway}
            key={''}
            onLoad={() => 1}
        />);

        expect(container.getElementsByClassName('payment__iframe').length).toBe(1);
        expect(container.getElementsByClassName('hidden').length).toBe(0);
    });
});
