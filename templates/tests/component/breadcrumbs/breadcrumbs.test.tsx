import {mocked} from 'jest-mock';
import {getBreadcrumbs} from 'src/utils';
import {IBreadcrumbs} from 'src/types';
import {render} from '@testing-library/react';
import {Breadcrumbs} from 'src/components';
import {useScreenBreakpoints, useSupportedLanguages, useGetIsLoadingExceptSections} from 'src/hooks';


jest.mock('src/utils/getBreadcrumbs');
jest.mock('src/hooks/useScreenBreakpoints');
jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetIsLoadingExceptSections');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const getBreadcrumbsMock = mocked(getBreadcrumbs, true);

const mockScreenBreakpoints = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
};
const selectableLanguages = [
    {value: 'en', name: 'English'},    
    {value: 'de', name: 'Deutsch'},
    {value: 'kr', name: '한국인'},
];

describe('Testing Breadcrumbs component', () => {
    const breadcrumbsResponse: IBreadcrumbs = {
        sectionLabel: 'checkout steps',
        crumbs: [
            {
                name: 'option1',
                text: 'option1',
                status: 'completed',
                onClick: jest.fn()
            },
            {
                name: 'option2',
                text: 'option2',
                status: 'active',
                onClick: jest.fn()
            },
            {

                name: 'option3',
                text: 'option3',
                status: 'next',
                onClick: jest.fn()
            },
            {

                name: 'option4',
                text: 'option4',
                status: 'upcoming',
                onClick: jest.fn()
            }
        ]
    };

    beforeEach(() => {
        jest.restoreAllMocks();
        useScreenBreakpointsMock.mockReturnValue(mockScreenBreakpoints);
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('rendering the component successfully', () => {
        getBreadcrumbsMock.mockReturnValueOnce(breadcrumbsResponse);
        useSupportedLanguagesMock.mockReturnValueOnce({languagesOptions: [], value: '', handleChange: jest.fn()});
        const {container} = render(<Breadcrumbs active={1}/>);
        expect(container.getElementsByClassName('Breadcrumb').length).toBe(1);

        expect(container.getElementsByClassName('Breadcrumb__Item--active').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item--next').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item--upcoming').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb_Item_Divider').length).toBe(breadcrumbsResponse.crumbs.length -1);
        expect(container.getElementsByClassName('supported-language__container').length).toBe(0);
    });

    test('rendering the component successfully with supported languages', () => {
        getBreadcrumbsMock.mockReturnValueOnce(breadcrumbsResponse);
        useSupportedLanguagesMock.mockReturnValueOnce({languagesOptions: selectableLanguages, value: '', handleChange: jest.fn()});
        const {container} = render(<Breadcrumbs active={1}/>);
        expect(container.getElementsByClassName('Breadcrumb').length).toBe(1);

        expect(container.getElementsByClassName('Breadcrumb__Item--active').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item--next').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item--upcoming').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb_Item_Divider').length).toBe(breadcrumbsResponse.crumbs.length -1);
        expect(container.getElementsByClassName('supported-language__container').length).toBe(1);
    });

});
