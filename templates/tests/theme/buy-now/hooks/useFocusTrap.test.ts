import { renderHook } from '@testing-library/react-hooks';
import { useFocusTrap } from 'src/themes/buy-now/hooks';
import { IUseFocusTrap } from 'src/themes/buy-now/types';
import { mocked } from 'jest-mock';
import { useLocation } from 'react-router';

jest.mock('react-router');
const useLocationMock = mocked(useLocation, true);

describe('testing hook useFocusTrap', () => {
    jest.useFakeTimers();
    const locationMock = {
        pathname: '/platform/store/experience/thank_you'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useLocationMock.mockReturnValue(locationMock);
    });

    test('render the hook properly', () => {
        const expectedResult: IUseFocusTrap = {
            activeElement: 'thank_you',
            focusTrapOptions: {
                checkCanFocusTrap: expect.anything(),
                checkCanReturnFocus: expect.anything(),
                escapeDeactivates: false,
                clickOutsideDeactivates: true
            }
        };
        const { result } = renderHook(() => useFocusTrap());

        expect(result.current).toStrictEqual(expectedResult);
    });

    test('check modal can focus trap', () => {
        const containers = [];
        const { result } = renderHook(() => useFocusTrap());

        const canCheckFocusTrap = result.current.focusTrapOptions.checkCanFocusTrap?.(containers);
        jest.advanceTimersByTime(200);

        expect(canCheckFocusTrap).resolves.not.toThrow();
    });


    test('check modal can return focus', () => {
        const trigger = document.createElement('div');
        const { result } = renderHook(() => useFocusTrap());

        const canCheckFocusTrap = result.current.focusTrapOptions.checkCanReturnFocus?.(trigger);
        jest.advanceTimersByTime(200);

        expect(canCheckFocusTrap).resolves.not.toThrow();
    });
});
