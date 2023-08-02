import {ICartParameters} from '@boldcommerce/checkout-frontend-library';
import {patchOrderMetaData} from 'src/library/patchOrderMetaData';
import {patchLifeField} from 'src/library';
import {mocked} from 'jest-mock';

jest.mock('src/library/patchOrderMetaData');
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);

describe('testing patchLifeField', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockReturnValue(Promise.resolve());
    });


    test('tests calling the patchOrderMetaData', async  () => {
        const patch = patchLifeField({['test_meta_data']: true} as ICartParameters);
        await patch(mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(1);
    });
});