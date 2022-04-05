import {mocked} from 'jest-mock';
import {setTaxes} from '@bold-commerce/checkout-frontend-library';
import {initialDataMock} from 'src/mocks';
import {generateTaxes, getSummaryStateFromLib} from 'src/library';
import * as HandleError from 'src/utils/handleErrorIfNeeded';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';

jest.mock('@bold-commerce/checkout-frontend-library');
const setTaxesMock = mocked(setTaxes, true);

describe('testing Generate Taxes Thunk Action', () => {
    const returnObject = {...baseReturnObject};
    const {application_state} = initialDataMock;
    const calledOnce = 1;
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    let handleErrorIfNeededSpy: jest.SpyInstance;

    beforeEach(() => {
        returnObject.success = true;
        returnObject.response = {data: {taxes: application_state.taxes, application_state}};
        setTaxesMock.mockReturnValue(returnObject);
        handleErrorIfNeededSpy = jest.spyOn(HandleError, 'handleErrorIfNeeded');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling generateTaxes', async () => {
        await generateTaxes(dispatchMock, getStateMock).then(() => {
            expect(setTaxesMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorIfNeededSpy).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorIfNeededSpy).toHaveBeenCalledWith(returnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(calledOnce);
            expect(dispatchMock).toHaveBeenCalledWith(getSummaryStateFromLib);
        });
    });
});
