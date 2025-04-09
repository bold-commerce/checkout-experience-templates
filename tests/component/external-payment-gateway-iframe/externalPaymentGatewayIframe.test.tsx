import {mocked} from 'jest-mock';
import {render} from '@testing-library/react';
import {ExternalPaymentGatewayIframe} from 'src/components';
import {useGetExternalPaymentGatewayLoading} from 'src/hooks';

jest.mock('src/hooks/useGetExternalPaymentGateways');
const useGetExternalPaymentGatewayLoadingMock = mocked(useGetExternalPaymentGatewayLoading, true);

describe('Testing External Payment Gateway Iframe Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        useGetExternalPaymentGatewayLoadingMock.mockReturnValue(true);
    });

    test('rendering the component with button enabled', () => {
        const gateway = {
            'is_test': true,
            'iframe_url': 'testURL',
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
