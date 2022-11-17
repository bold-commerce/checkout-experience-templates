import {useScreenBreakpoints, useScreenWidth} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {IUseScreenBreakpoints} from 'src/types';

jest.mock('src/hooks/useScreenWidth');
const useScreenWidthMock = mocked(useScreenWidth, true);

const expectedMobile: IUseScreenBreakpoints = {
    isMobile: true,
    isTablet: false,
    isDesktop: false
};
const expectedTablet: IUseScreenBreakpoints = {
    isMobile: false,
    isTablet: true,
    isDesktop: false
};
const expectedDesktop: IUseScreenBreakpoints = {
    isMobile: false,
    isTablet: false,
    isDesktop: true
};

describe('Testing hook useScreenBreakpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const widthTestCases = [
        {
            name: '1px',
            width: 1,
            expected: expectedMobile
        },
        {
            name: '767px - largest Mobile',
            width: 767,
            expected: expectedMobile
        },
        {
            name: '768px - smallest Tablet',
            width: 768,
            expected: expectedTablet
        },
        {
            name: '1199px - largest Tablet',
            width: 1199,
            expected: expectedTablet
        },
        {
            name: '1200px - smallest Desktop',
            width: 1200,
            expected: expectedDesktop
        },
        {
            name: '13457px - large Desktop',
            width: 13457,
            expected: expectedDesktop
        }
    ];

    test.each(widthTestCases)('render with Width = $name', ({width, expected}) => {
        useScreenWidthMock.mockReturnValue(width);
        const {result} = renderHook(() => useScreenBreakpoints());
        expect(result.current).toStrictEqual(expected);
    });


});
