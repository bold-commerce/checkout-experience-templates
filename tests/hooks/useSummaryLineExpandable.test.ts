import {ISummaryLineExpandable, IUseGetCurrencyInformation} from 'src/types';
import {Constants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {useGetCurrencyInformation, useSummaryLineExpandable} from 'src/hooks';
import {mocked} from 'jest-mock';
import {getClassesListSummary, getFieldNamesSummary} from 'src/utils';
import {act} from '@testing-library/react';

jest.mock('src/utils');
jest.mock('src/hooks/useGetCurrencyInformation');
const getClassesListSummaryMock = mocked(getClassesListSummary, true);
const getFieldNamesSummaryMock = mocked(getFieldNamesSummary, true);
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);


describe('Testing hook useSummaryLineExpandable', () => {
    const props: ISummaryLineExpandable = {
        eventToggleName: Constants.SHIPPING_TOGGLE,
        total: 300,
        isExpanded: true,
        hasBottom: false,
        hasList: false,
        content: [],
        title: 'test'
    };
    const fieldNameSummary = {content: 'test', amount: '200', id: '1'};
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

    const currencyData: IUseGetCurrencyInformation = {
        currency: 'CAD',
        currencySymbol: '$',
        formattedPrice: '${{amount}}'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getFieldNamesSummaryMock.mockReturnValueOnce(fieldNameSummary);
        getClassesListSummaryMock.mockReturnValueOnce(classesListSummary);
        useGetCurrencyInformationMock.mockReturnValue(currencyData);
    });


    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useSummaryLineExpandable(props));
        const hookResult = result.current;
        expect(hookResult.expand).toBe(props.isExpanded);
        expect(hookResult.classes).toBe(classesListSummary);
        expect(hookResult.fieldNames).toBe(fieldNameSummary);
        expect(hookResult.formattedPrice).toBe(currencyData.formattedPrice);
    });

    test('calling the toggle function', () => {
        const {result, rerender} = renderHook(() => useSummaryLineExpandable(props));

        expect(result.current.expand).toBe(props.isExpanded);
        rerender();
        act(() => {
            result.current.toggle();
        });
        expect(result.current.expand).toBe(!props.isExpanded);
    });

});
