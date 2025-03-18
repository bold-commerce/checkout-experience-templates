import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {useGetCountryInfoList} from 'src/hooks';
import {useDispatch} from 'react-redux';
import {EpsExpressPaymentGateway} from 'src/components';

jest.mock('src/hooks/useGetCountryData');
jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);
const useGetCountryInfoListMock =  mocked(useGetCountryInfoList, true);

describe('Testing EpsExpressPaymentGateway', () => {

    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
        useGetCountryInfoListMock.mockReturnValue([]);
    });

    test('rendering the component', () => {
        const {getByTestId, container} = render(<EpsExpressPaymentGateway/>);
        expect(getByTestId('alternative-payment-method-container-test')).toBeTruthy();
        expect(container.getElementsByClassName('hidden').length).toBe(1);
    });
});
