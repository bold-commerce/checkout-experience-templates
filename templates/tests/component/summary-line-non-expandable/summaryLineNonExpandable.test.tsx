import {mocked} from 'jest-mock';
import {getClassesListSummary} from 'src/utils';
import {render, screen} from '@testing-library/react';
import {SummaryLineNonExpandable} from 'src/components';
import {ISummaryLineNonExpandable, IUseGetCurrencyInformation} from 'src/types';
import {Constants} from 'src/constants';
import {useGetCurrencyInformation} from 'src/hooks';

jest.mock('src/utils');
jest.mock('src/hooks/useGetCurrencyInformation');
const getClassesListSummaryMock = mocked(getClassesListSummary, true);
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);

describe('Testing SummaryLineNonExpandable component', () => {

    const classesListSummary = {
        container: 'test-container',
        title: {
            container: 'test-title-container',
            arrow: 'test-title-arrow',
            text: 'test-title-text',
            price: 'test-title-price'
        },
        list: {
            ul: 'test-list-ul',
            li: 'test-list-li',
            text: 'test-list-text',
            price: 'test-list-price',
            delete: 'test-list-delete',
            loading: 'test-list-loading',
            loadingSpan: 'test-list-span',
        }
    };

    const props: ISummaryLineNonExpandable ={
        eventName: Constants.TOTAL_EVENT,
        name: 'test',
        total: 200
    };
    const currencyData: IUseGetCurrencyInformation = {
        currency: 'CAD',
        currencySymbol: '$',
        formattedPrice: '${{amount}}'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getClassesListSummaryMock.mockReturnValueOnce(classesListSummary);
        useGetCurrencyInformationMock.mockReturnValueOnce(currencyData);
    });

    test('Rendering the component properly', () => {
        const { container } = render(<SummaryLineNonExpandable {...props}/>);
        expect(container.getElementsByClassName(classesListSummary.container).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.container).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.price).length).toBe(1);
        expect(screen.getAllByText(props.name).length).toBe(1);

    });
});
