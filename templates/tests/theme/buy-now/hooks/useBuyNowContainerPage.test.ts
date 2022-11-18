import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useBuyNowContainerPage } from 'src/themes/buy-now/hooks';
import { RefObject } from 'react';
import { IUseBuyNowContainerPageProps } from 'src/themes/buy-now/types';
import { mocked } from 'jest-mock';
import { useDispatch } from 'react-redux';
import { useGetIsOrderProcessing } from 'src/hooks';

jest.mock('react-redux');
jest.mock('src/hooks/useGetIsOrderProcessing');
const useDispatchMock = mocked(useDispatch, true);
const useGetIsOrderProcessingMock = mocked(useGetIsOrderProcessing, true);

describe('testing hook useBuyNowContainerPage', () => {
    const mockResizeObserver = global.ResizeObserver = jest.fn().mockImplementation(function (this: ResizeObserver, cb) {
        this.observe = jest.fn(() => {
            cb([], this);
        });
        this.disconnect = jest.fn();
        this.unobserve = jest.fn();
    });
    const dispatchMock = jest.fn();
    /**
     * Calls all callbacks passed to the ResizeObserver constructor to be called
     */
    const triggerResize = () => {
        mockResizeObserver.mock.calls.forEach((args, i) => args[0]([], mockResizeObserver.mock.instances[i]));
    };
    beforeEach(() => {
        useDispatchMock.mockReturnValue(dispatchMock);
        useGetIsOrderProcessingMock.mockReturnValue(false);
    });

    afterEach(() => {
        mockResizeObserver.mockClear();
        document.body.style.removeProperty('--buy-now-height');
    });

    test('render the hook properly', () => {
        const testIndexRef = { current: { clientHeight: 100 } };
        const props: IUseBuyNowContainerPageProps = {
            indexRef: testIndexRef as RefObject<HTMLElement>,
            shippingRef: { current: null },
            summaryRef: { current: null },
        };

        const { result } = renderHook(() => useBuyNowContainerPage(props));
        const { openSection, containerStyle } = result.current;

        expect(openSection).toBe('/');
        expect(containerStyle.height).toBe('100px');
    });

    test('calling navigateTo', () => {
        const props: IUseBuyNowContainerPageProps = {
            indexRef: { current: { clientHeight: 100 } } as RefObject<HTMLElement>,
            shippingRef: { current: { clientHeight: 100 } } as RefObject<HTMLElement>,
            summaryRef: { current: { clientHeight: 100 } } as RefObject<HTMLElement>,
        };

        const { result } = renderHook(() => useBuyNowContainerPage(props));
        const { openSection: firstOpenSection } = result.current;

        act(() => result.current.navigateTo('/shipping'));
        const { openSection: secondOpenSection } = result.current;

        act(() => result.current.navigateTo('/summary'));
        const { openSection: thirdOpenSection } = result.current;

        act(() => result.current.navigateTo('/'));
        const { openSection: fourthOpenSection } = result.current;

        expect(firstOpenSection).toBe('/');
        expect(secondOpenSection).toBe('/shipping');
        expect(thirdOpenSection).toBe('/summary');
        expect(fourthOpenSection).toBe('/');

    });

    test('testing ResizeObserver', () => {
        const testIndexRef = { current: { clientHeight: 100, parentElement: {} } };
        const props: IUseBuyNowContainerPageProps = {
            indexRef: testIndexRef as RefObject<HTMLElement>,
            shippingRef: { current: null },
            summaryRef: { current: null },
        };

        const { result } = renderHook(() => useBuyNowContainerPage(props));
        const { containerStyle: firstContainerStyle } = result.current;
        expect(document.body.style.getPropertyValue('--buy-now-height')).toBe('0px');

        testIndexRef.current.clientHeight = 200;
        testIndexRef.current.parentElement = { clientHeight: 1000 };
        act(triggerResize);
        const { containerStyle: secondContainerStyle } = result.current;

        expect(firstContainerStyle.height).toBe('100px');
        expect(secondContainerStyle.height).toBe('200px');
        expect(document.body.style.getPropertyValue('--buy-now-height')).toBe('1000px');
    });
});
