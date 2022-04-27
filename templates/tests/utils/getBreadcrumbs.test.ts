import {getBreadcrumbs, getTerm, neuroIdSubmitFromBreadcrumb} from 'src/utils';
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
jest.mock('src/utils/neuroIdCallsBreadcrumbs');
const getTermMock = mocked(getTerm, true);
const neuroIdSubmitFromBreadcrumbMock = mocked(neuroIdSubmitFromBreadcrumb, true);

describe('Test getBreadcrumbs function', () => {
    const active = 5;
    const getTermValue = 'test-value';
    const preventDefaultMock = jest.fn();
    const eventMock = {preventDefault: preventDefaultMock};

    beforeEach(() => {
        jest.restoreAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = 'http://test.com';
    });

    test('Completed state', () => {
        const {result} = renderHook(() => getBreadcrumbs(historyMock, active));
        const results = result.current;

        results[0].onClick(eventMock);
        expect(neuroIdSubmitFromBreadcrumbMock).toHaveBeenCalledTimes(1);
        expect(window.location.href).toEqual(window.returnUrl);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);

        results[1].onClick(eventMock);
        expect(neuroIdSubmitFromBreadcrumbMock).toHaveBeenCalledTimes(2);
        expect(results[1].text).toStrictEqual(getTermValue);
        expect(replaceMock).toHaveBeenCalledTimes(1);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(2);

        results[2].onClick(eventMock);
        expect(neuroIdSubmitFromBreadcrumbMock).toHaveBeenCalledTimes(3);
        expect(results[2].text).toStrictEqual(getTermValue);
        expect(replaceMock).toHaveBeenCalledTimes(2);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(3);

        results[3].onClick(eventMock);
        expect(neuroIdSubmitFromBreadcrumbMock).toHaveBeenCalledTimes(4);
        expect(results[3].text).toStrictEqual(getTermValue);
        expect(replaceMock).toHaveBeenCalledTimes(3);
        expect(results[0].status).toBe(BreadcrumbsStatus.COMPLETED);
        expect(preventDefaultMock).toHaveBeenCalledTimes(4);
    });
});
