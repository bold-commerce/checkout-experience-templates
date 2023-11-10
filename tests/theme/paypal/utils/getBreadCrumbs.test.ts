import {
    getReturnToCartTermAndLink,
    getTerm,
    isBoldPlatform
} from 'src/utils';
import {BreadcrumbsStatus} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {Action, Location} from 'history';
import {mocked} from 'jest-mock';
import {useGetLifeFields} from 'src/hooks';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {getBreadcrumbs} from 'src/themes/paypal/utils';

const replaceMock = jest.fn();
const historyMock = {
    push: jest.fn(),
    action: {} as Action,
    location: {} as Location,
    createHref: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    replace: replaceMock,
    forward: jest.fn(),
    listen: jest.fn(),
    block: jest.fn(),
};

jest.mock('src/utils/getTerm');
jest.mock('src/utils/getReturnToCartTermAndLink');
jest.mock('src/utils/isBoldPlatform');
jest.mock('src/hooks/useGetLifeFields');
const getTermMock = mocked(getTerm, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);
const isBoldPlatformMock = mocked(isBoldPlatform, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);

describe('Test getBreadcrumbs function', () => {
    const active = 5;
    const getTermValue = 'test-value';
    const preventDefaultMock = jest.fn();
    const eventMock = {preventDefault: preventDefaultMock};
    const link = 'http://test.com';

    const dummyLifeField: ILifeField ={
        input_default: '',
        input_label: 'label',
        input_placeholder: 'placeholder',
        input_required: true,
        input_type: '',
        input_regex: null,
        location: '',
        meta_data_field: '',
        order_asc: 1,
        public_id: ''
    };

    beforeEach(() => {
        jest.restoreAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = link;
        window.shopAlias = 'lowlaundry.com';
        getReturnToCartTermAndLinkMock.mockReturnValue({term:'return_to_cart', link: link});
    });

    test('Completed state', () => {
        isBoldPlatformMock.mockReturnValueOnce(true);
        useGetLifeFieldsMock.mockReturnValue([dummyLifeField]);
        const {result} = renderHook(() => getBreadcrumbs(historyMock, active));
        const {crumbs: results} = result.current;

        results[0].onClick(eventMock);
        expect(window.location.href).toEqual(window.returnUrl);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);

        results[1].onClick(eventMock);
        expect(results[1].text).toStrictEqual(getTermValue);
        expect(replaceMock).toHaveBeenCalledTimes(1);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(2);

        results[2].onClick(eventMock);
        expect(results[2].text).toStrictEqual(getTermValue);
        expect(replaceMock).toHaveBeenCalledTimes(2);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(3);

    });

    test('Completed state without bold platform', () => {
        isBoldPlatformMock.mockReturnValueOnce(false);
        useGetLifeFieldsMock.mockReturnValue([dummyLifeField]);
        const {result} = renderHook(() => getBreadcrumbs(historyMock, active));
        const {crumbs: results} = result.current;

        results[0].onClick(eventMock);
        expect(window.location.href).toEqual(link);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
    });

    test('Test not requires shipping', () => {
        isBoldPlatformMock.mockReturnValueOnce(true);
        useGetLifeFieldsMock.mockReturnValue([]);
        const {result} = renderHook(() => getBreadcrumbs(historyMock, active));
        const {crumbs: results} = result.current;
        expect(results[1].name).toBe('payment_method');
        expect(results[1].name).not.toBe('additional_information');
    });
});
