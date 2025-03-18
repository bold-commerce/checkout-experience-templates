import {render} from '@testing-library/react';
import {EpsPayment} from 'src/components/eps-payment/EpsPayment';
import {Constants} from 'src/constants';
import {mocked} from 'jest-mock';
import {useGetAppSettingData} from 'src/hooks';
import {IEpsPayments,} from 'src/types';
import {useDispatch} from 'react-redux';

jest.mock('src/hooks/useGetAppSettingData');
jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing EpsPayment', () => {

    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
    });

    test('rendering the component', () => {
        const epsPayments: IEpsPayments = {
            renderPayments: jest.fn(() => Promise.resolve()),
            renderWalletPayments: jest.fn(() => Promise.resolve()),
            tokenize: jest.fn(),
            getDataRequirements: jest.fn(),
            isScaRequired: jest.fn(),
            clearErrors: jest.fn(),
        };
        useGetAppSettingDataMock.mockReturnValue(epsPayments);
        const {getByTestId} = render(<EpsPayment onLoad={() => true}/>);
        expect(getByTestId(`${Constants.EPS_IFRAME}-test`)).toBeTruthy();
    });
});
