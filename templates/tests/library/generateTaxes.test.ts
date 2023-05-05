import {baseReturnObject, setTaxes} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {generateTaxes, getSummaryStateFromLib} from 'src/library';
import {initialDataMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');
jest.mock('src/utils');
const setTaxesMock = mocked(setTaxes, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing Generate Taxes Thunk Action', () => {
    const returnObject = {...baseReturnObject};
    const {application_state} = initialDataMock;
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        returnObject.success = true;
        returnObject.response = {data: {taxes: application_state.taxes, application_state}};
        setTaxesMock.mockReturnValue(Promise.resolve(returnObject));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling generateTaxes', async () => {
        await generateTaxes(dispatchMock, getStateMock).then(() => {
            expect(setTaxesMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(getSummaryStateFromLib);
        });
    });
});
