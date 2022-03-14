import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useBuyNowContainerPage } from 'src/themes/buy-now/hooks';
import ResizeObserver from '__mocks__/ResizeObserver';
import React, { MutableRefObject } from 'react';
import { IUseBuyNowContainerPageProps } from 'src/themes/buy-now/types';

window.ResizeObserver = ResizeObserver;

describe('testing hook useBuyNowContainerPage', () => {
    const testIndexRef: MutableRefObject<HTMLElement | null> = {current: {clientHeight: 100} as HTMLElement};
    const testShippingRef: MutableRefObject<HTMLElement | null> = {current: {clientHeight: 800} as HTMLElement};
    const testSummaryRef: MutableRefObject<HTMLElement | null> = {current: {} as HTMLElement};
    
    const props: IUseBuyNowContainerPageProps = {
        indexRef: testIndexRef,
        shippingRef: testShippingRef,
        summaryRef: testSummaryRef
    }

    test('render the hook properly for tablet/desktop', () => {
        window = Object.assign(window, { innerWidth: 770 });

        const {result} = renderHook(() => useBuyNowContainerPage(props));
        const hookResult = result.current;

        expect(hookResult.openSection).toBe('/');
        expect(hookResult.containerStyle).toEqual({height: '100px', overflow: 'hidden'});
    });

    test('render the hook properly for mobile', () => {
        window = Object.assign(window, { innerWidth: 769 });

        const {result} = renderHook(() => useBuyNowContainerPage(props));
        const hookResult = result.current;

        expect(hookResult.openSection).toBe('/');
        expect(hookResult.containerStyle).toEqual({});
    });

    test('calling navigateTo', () => {
        
        const {result} = renderHook(() => useBuyNowContainerPage(props));

        expect(result.current.openSection).toBe('/');

        act(() => {
            result.current.navigateTo('/shipping');
        });
        expect(result.current.openSection).toBe('/shipping');

        act(() => {
            result.current.navigateTo('/summary');
        });
        expect(result.current.openSection).toBe('/summary');
        act(() => {
            result.current.navigateTo('/');
        });
        expect(result.current.openSection).toBe('/');

    });
    test('testing ResizeObserver', () => {
        window = Object.assign(window, { 
            innerWidth: 770,
            innerHeight: 600,
        });
        
        let {result} = renderHook(() => useBuyNowContainerPage(props));

        act(() => {
            //trigger a change in visible ref
            result.current.navigateTo('/summary');
        });
        expect(result.current.containerStyle).toEqual({height: '0px', overflow: 'hidden'});

        act(() => {
            //trigger a change in visible ref
            result.current.navigateTo('/');
        });
        expect(result.current.containerStyle).toEqual({height: '100px', overflow: 'hidden'});

        act(() => {
            //trigger a change in visible ref
            result.current.navigateTo('/shipping');
        });
        expect(result.current.containerStyle).toEqual({height: '600px', overflow: 'scroll'});
    });
});
