import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {useGetFooter} from 'src/hooks';
import {IUseFooter} from 'src/types';
import {getTerm} from 'src/utils';

jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetFooter', () => {
    const shopName = 'test-shop';
    const shopAlias = 'test-shop.alias.com';
    const customDomain = 'test-shop.custom.com';

    const mockResponse: IUseFooter = {
        shopAlias: shopName,
        footerRights: 'All rights test',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValue(mockResponse.footerRights);
    });

    const dataArray = [
        {
            name: 'rendering the hook with shopName, shopAlias, customDomain',
            shopName: shopName,
            shopAlias: shopAlias,
            customDomain: customDomain,
            expectedResponse: {...mockResponse, shopAlias: shopName},
        },
        {
            name: 'rendering the hook with no shopName and no customDomain and with shopAlias',
            shopName: '',
            shopAlias: shopAlias,
            customDomain: '',
            expectedResponse: {...mockResponse, shopAlias: shopAlias},
        },
        {
            name: 'rendering the hook without shopName and with customDomain with shopAlias',
            shopName: '',
            shopAlias: shopAlias,
            customDomain: customDomain,
            expectedResponse: {...mockResponse, shopAlias: customDomain},
        },
        {
            name: 'rendering the hook with no shopName, no shopAlias, no customDomain',
            shopName: '',
            shopAlias: '',
            customDomain: '',
            expectedResponse: {...mockResponse, shopAlias: ''},
        },
    ];

    test.each(dataArray)('$name', (data) => {
        window.shopName = data.shopName;
        window.shopAlias = data.shopAlias;
        window.customDomain = data.customDomain;
        const {result} = renderHook(() => useGetFooter());

        expect(getTermMock).toHaveBeenCalledWith('footer_rights', Constants.GLOBAL_INFO, undefined, 'All rights reserved');
        expect(result.current).toStrictEqual(data.expectedResponse);
    });
});
