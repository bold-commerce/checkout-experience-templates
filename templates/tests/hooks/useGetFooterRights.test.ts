import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {useGetFooterRights} from 'src/hooks';
import {IUseFooterRights} from 'src/types';
import {getTerm} from 'src/utils';

jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetFooterRights', () => {
    const shopName = 'test-shop';
    const shopAlias = 'test-shop.alias.com';
    const mockResponse: IUseFooterRights = {
        shopAlias: shopName,
        footerRights: 'All rights test'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValue(mockResponse.footerRights);
    });

    const dataArray = [
        {
            name: 'rendering the hook with shopName',
            expectedResponse: {...mockResponse, shopAlias: shopName},
            shopName,
            shopAlias: '',
        },
        {
            name: 'rendering the hook with no shopName and with shopAlias',
            expectedResponse: {...mockResponse, shopAlias: shopAlias},
            shopName: '',
            shopAlias,
        },
        {
            name: 'rendering the hook without shopName and shopAlias',
            expectedResponse: {...mockResponse, shopAlias: ''},
            shopName: '',
            shopAlias: '',
        }
    ];

    test.each(dataArray)('$name', (data) => {
        window.shopName = data.shopName;
        window.shopAlias = data.shopAlias;
        const {result} = renderHook(() => useGetFooterRights());

        expect(getTermMock).toHaveBeenCalledWith('footer_rights', Constants.GLOBAL_INFO);
        expect(result.current).toStrictEqual(data.expectedResponse);
    });
});
