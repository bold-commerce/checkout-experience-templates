import {mocked} from 'jest-mock';
import {useGetAppSettingData} from 'src/hooks';
import {render} from '@testing-library/react';
import {ExpressPaymentGateway} from 'src/components';
import {getTerm} from 'src/utils';

jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/utils/getTerm');
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const getTermMock = mocked(getTerm, true);

describe('Testing ExpressPaymentGateway Component', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock
            .mockReturnValueOnce('express payment')
            .mockReturnValueOnce('or');
    });

    test('rendering the component with button enabled', () => {
        useGetAppSettingDataMock.mockReturnValueOnce(true);

        const {container} = render(<ExpressPaymentGateway />);
        expect(container.getElementsByClassName('express-payment-container').length).toBe(1);
        expect(container.getElementsByClassName('hidden').length).toBe(0);


    });

    test('rendering the component with button disabled', () => {
        useGetAppSettingDataMock.mockReturnValueOnce(false);

        const {container} = render(<ExpressPaymentGateway />);
        expect(container.getElementsByClassName('express-payment-container').length).toBe(1);
        expect(container.getElementsByClassName('hidden').length).toBe(1);


    });

});
