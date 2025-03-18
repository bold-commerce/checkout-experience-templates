import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {actionClearErrors} from 'src/action';
import {ITotals} from 'src/types';
import {callEpsProcessOrder, isOnlyFlashError} from 'src/utils';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/action');
jest.mock('src/library/');
jest.mock('src/utils/isOnlyFlashError');

const processOrderMock = mocked(processOrder, true);
const isOnlyFlashErrorMock = mocked(isOnlyFlashError, true);

describe('testing validateCustomerOnLoad', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const historyMock = {replace: jest.fn()};
    const actionClearErrorsMock = jest.fn();

    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        actionClearErrorsMock.mockReturnValue(actionClearErrorsMock);
        processOrderMock.mockReturnValue(jest.fn());
        isOnlyFlashErrorMock.mockReturnValue(true);
    });

    test('testing without amount zero', async () => {
        getState.mockReturnValue(stateMock);
        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:2999, totalDiscounts:0, totalAmountDue:0};

        const thunkCall = callEpsProcessOrder(historyMock, total, lifeFields);
        await thunkCall(dispatch, getState).then(() => {

            expect(dispatch).toHaveBeenCalledWith(actionClearErrors());
            expect(dispatch).toHaveBeenCalledWith(displayOrderProcessingScreen);
            expect(processOrderMock).toHaveBeenCalledTimes(1);
        });
    });


    test('testing without eps payemnt configured', async () => {
        getState.mockReturnValue(stateMock);
        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

        const thunkCall = callEpsProcessOrder(historyMock, total, lifeFields);
        await thunkCall(dispatch, getState).then(() => {

            expect(dispatch).toHaveBeenCalledWith(actionClearErrors());
            expect(dispatch).toHaveBeenCalledWith(displayOrderProcessingScreen);
            expect(processOrderMock).toHaveBeenCalledTimes(0);
        });
    });

    test('testing with eps payemnt configured', async () => {
        const state = {...stateMock};
        state.appSetting.epsBoldPayment = {
            renderPayments: jest.fn(),
            renderWalletPayments: jest.fn(),
            getDataRequirements: jest.fn().mockReturnValue([]),
            tokenize: jest.fn().mockReturnValue(Promise.resolve()),
            isScaRequired: jest.fn().mockReturnValue(false),
            clearErrors: jest.fn(),
        };
        getState.mockReturnValue(state);

        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

        const thunkCall = callEpsProcessOrder(historyMock, total, lifeFields);
        await thunkCall(dispatch, getState).then(() => {
            expect(dispatch).toHaveBeenCalledWith(actionClearErrors());
            expect(dispatch).toHaveBeenCalledWith(displayOrderProcessingScreen);
            expect(processOrderMock).toHaveBeenCalledTimes(1);
        });
    });

    test('testing with eps payemnt configured with data requirement', async () => {
        const state = {...stateMock};
        state.appSetting.epsBoldPayment = {
            renderPayments: jest.fn(),
            renderWalletPayments: jest.fn(),
            getDataRequirements: jest.fn().mockReturnValue(['customer', 'billing_address', 'shipping_address', 'totals']),
            tokenize: jest.fn().mockReturnValue(Promise.resolve()),
            isScaRequired: jest.fn().mockReturnValue(false),
            clearErrors: jest.fn(),
        };
        getState.mockReturnValue(state);

        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

        const thunkCall = callEpsProcessOrder(historyMock, total, lifeFields);
        await thunkCall(dispatch, getState).then(() => {
            expect(dispatch).toHaveBeenCalledWith(actionClearErrors());
            expect(dispatch).toHaveBeenCalledWith(displayOrderProcessingScreen);
            expect(processOrderMock).toHaveBeenCalledTimes(1);
        });
    });

    test('testing with eps payemnt configured with data requirement and exception', async () => {
        const state = {...stateMock};
        state.appSetting.epsBoldPayment = {
            renderPayments: jest.fn(),
            renderWalletPayments: jest.fn(),
            getDataRequirements: jest.fn().mockReturnValue(['customer', 'billing_address', 'shipping_address', 'totals']),
            tokenize: jest.fn().mockReturnValue(Promise.reject()),
            isScaRequired: jest.fn().mockReturnValue(false),
            clearErrors: jest.fn()
        };
        getState.mockReturnValue(state);

        const total: ITotals = {totalSubtotal: 2999, totalFees:0, totalTaxes:0, totalAdditionalFees:0, totalOrder:0, totalPaid:0, totalDiscounts:0, totalAmountDue:2999};

        const thunkCall = callEpsProcessOrder(historyMock, total, lifeFields);
        await thunkCall(dispatch, getState).then(() => {
            expect(dispatch).toHaveBeenCalledWith(actionClearErrors());
            expect(dispatch).toHaveBeenCalledWith(displayOrderProcessingScreen);
            expect(processOrderMock).toHaveBeenCalledTimes(0);
        });
    });

});
