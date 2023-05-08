import {
    baseReturnObject, ICartParameters, IPatchOrderMetaDataRequest, IPatchOrderMetaDataResponse,
    patchOrderMetaData as patchOrderMetaDataLib
} from '@boldcommerce/checkout-frontend-library';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {handleErrorIfNeeded} from 'src/utils';
import {patchOrderMetaData} from 'src/library/patchOrderMetaData';
import {actionOrderMetaData} from 'src/action';

jest.mock('@boldcommerce/checkout-frontend-library/lib/orderMetaData');
jest.mock('src/utils');
const patchOrderMetaDataLibMock = mocked(patchOrderMetaDataLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing patchOrderMetaData', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();
    const returnObject = {...baseReturnObject};

    const payload: IPatchOrderMetaDataRequest = {
        note_attributes: {
            ['_tax_exempt_checkbox_selected']: true,
        } as ICartParameters,
        cart_parameters: null,
        notes: null,
        tags: null,
    }

    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
    });


    test('tests calling validate Discount with success as false', async  () => {
        const newReturnObj = {...returnObject, success: false};
        patchOrderMetaDataLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const patch = patchOrderMetaData(payload);
        await patch(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
    });

    test('tests calling validate Discount with success as true', async  () => {
        const metaData = {
            order_meta_data: payload
        } as IPatchOrderMetaDataResponse;
        const data = {data: metaData}
        const newReturnObj = {...returnObject, success: true};
        newReturnObj.response = data;
        patchOrderMetaDataLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const patch = patchOrderMetaData(payload);
        await patch(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(mockDispatch).toHaveBeenCalledWith(actionOrderMetaData(metaData.order_meta_data));
    });

    test('tests calling validate Discount with success as true but null response', async  () => {
        const newReturnObj = {...returnObject, success: true, response: null};
        patchOrderMetaDataLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const patch = patchOrderMetaData(payload);
        await patch(mockDispatch, getState);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
    });

});
