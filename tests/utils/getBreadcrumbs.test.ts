import {
    getBreadcrumbs,
    getReturnToCartTermAndLink,
    getTerm,
    isBoldPlatform
} from 'src/utils';
import {BreadcrumbsStatus} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {Action, Location} from 'history';
import {mocked} from 'jest-mock';

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
const getTermMock = mocked(getTerm, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);
const isBoldPlatformMock = mocked(isBoldPlatform, true);

describe('Test getBreadcrumbs function', () => {
    const active = 5;
    const getTermValue = 'test-value';
    const preventDefaultMock = jest.fn();
    const eventMock = {preventDefault: preventDefaultMock};
    const link = 'http://test.com';

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
        getReturnToCartTermAndLinkMock.mockReturnValue({term:'return_to_cart', link: link});
    });

    test('Completed state', () => {
        isBoldPlatformMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => getBreadcrumbs(historyMock, active));
        const { crumbs: results } = result.current;

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

        results[3].onClick(eventMock);
        expect(results[3].text).toStrictEqual(getTermValue);
        expect(replaceMock).toHaveBeenCalledTimes(3);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(4);
    });

    test('Completed state without bold platform', () => {
        isBoldPlatformMock.mockReturnValueOnce(false);
        const {result} = renderHook(() => getBreadcrumbs(historyMock, active));
        const { crumbs: results } = result.current;

        results[0].onClick(eventMock);
        expect(window.location.href).toEqual(link);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
    });
});
