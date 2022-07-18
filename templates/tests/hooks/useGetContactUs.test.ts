import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {useGetContactUs} from 'src/hooks';
import {IUseContactUs} from 'src/types';
import {getTerm} from 'src/utils';

jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetContactUs', () => {
    const mockResponse: IUseContactUs = {
        needHelp: 'need help',
        contactUs: 'contact us'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValue('');
    });

    test('rendering the hook properly', () => {
        getTermMock
            .mockReturnValueOnce(mockResponse.needHelp)
            .mockReturnValueOnce(mockResponse.contactUs);
        const {result} = renderHook(() => useGetContactUs());

        expect(getTermMock).toHaveBeenCalledWith('help', Constants.CONFIRMATION_PAGE_INFO, undefined, 'Need Help?');
        expect(getTermMock).toHaveBeenCalledWith('contact_us', Constants.CONFIRMATION_PAGE_INFO, undefined, 'Contact us');
        expect(result.current).toStrictEqual(mockResponse);
    });
});
