import {initializeExpressPay} from 'src/library';
import {initialize} from '@bold-commerce/checkout-express-pay-library';
import {mocked} from 'jest-mock';
import {SET_EXPRESS_PAYMENT_SECTION_ENABLED} from 'src/action';

jest.mock('@bold-commerce/checkout-express-pay-library');
const initializeExpressPayMock = mocked(initialize, true);

describe('testing initializeExpressPay', () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        initializeExpressPayMock.mockImplementation(({showHideExpressPaymentSection})=> {
            showHideExpressPaymentSection && showHideExpressPaymentSection(true);
        });
    });

    test('testing the function', async () => {

        initializeExpressPay(dispatchMock);
        const expectedAction = {type: SET_EXPRESS_PAYMENT_SECTION_ENABLED, payload: {isExpressPaySectionEnable:true}};

        expect(initializeExpressPayMock).toBeCalled();
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
    });

});
