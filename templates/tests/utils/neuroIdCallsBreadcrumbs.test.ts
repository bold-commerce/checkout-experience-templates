import {neuroIdInit, neuroIdSubmit, getNeuroIdPageName, neuroIdSubmitFromBreadcrumb} from 'src/utils';
import SpyInstance = jest.SpyInstance;
import {mocked} from 'jest-mock';
import * as neuroIdCalls from 'src/utils/neuroIdCalls';

jest.mock('src/utils/neuroIdCalls');

describe('Testing functions related to Neuro ID', () => {
    const neuroIdSubmitMock = mocked(neuroIdSubmit, true);
    const getNeuroIdPageNameMock = mocked(getNeuroIdPageName, true);

    const dataProviderBreadcrumbsInvalidActive = [
        {
            active: 0,
        },
        {
            active: 4,
        },
    ];
    const dataProviderBreadcrumbsValidActive = [
        {
            active: 1,
            pageName: 'customer_info_page_name',
            expected: 1,
        },
        {
            active: 2,
            pageName: 'shipping_info_page_name',
            expected: 1,
        },
        {
            active: 3,
            pageName: 'payment_info_page_name',
            expected: 1,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataProviderBreadcrumbsValidActive)('Function neuroIdSubmitFromBreadcrumbs with valid active value', ({active, expected, pageName}) => {
        getNeuroIdPageNameMock.mockReturnValue(pageName);

        neuroIdSubmitFromBreadcrumb(active);
        expect(neuroIdSubmitMock).toHaveBeenCalledTimes(expected);
        expect(neuroIdSubmitMock).toHaveBeenCalledWith(pageName);
    });

    test.each(dataProviderBreadcrumbsInvalidActive)('Function neuroIdSubmitFromBreadcrumbs with invalid active value - $name', ({active}) => {
        jest.mock('src/utils/neuroIdCalls');
        const neuroIdSubmitMock = mocked(neuroIdSubmit, true);

        neuroIdSubmitFromBreadcrumb(active);
        expect(neuroIdSubmitMock).not.toHaveBeenCalled();
    });
});
