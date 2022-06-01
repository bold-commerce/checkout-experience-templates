import {
    IApplicationStateDiscount,
    ISummaryLineExpandable,
    IUseSummaryLineExpandable,
    IUseSummaryLineExpanded
} from 'src/types';
import {Constants} from 'src/constants';
import {mocked} from 'jest-mock';
import {useSummaryLineExpandable, useSummaryLineExpanded} from 'src/hooks';
import {SummaryLineExpandable} from 'src/components';
import {render} from '@testing-library/react';
import {classesListSummary} from 'src/mocks';

jest.mock('src/hooks');
const useSummaryLineExpandableMock = mocked(useSummaryLineExpandable, true);
const useSummaryLineExpandedMock = mocked(useSummaryLineExpanded, true);

describe('Testing SummaryLineExpandable component', () => {
    const fieldNameSummary = {content: 'test', amount: '200', id: '1'};

    const props: ISummaryLineExpandable = {
        eventToggleName: Constants.SHIPPING_TOGGLE,
        total: 300,
        isExpanded: true,
        hasBottom: false,
        hasList: false,
        content: [],
        title: 'test'
    };

    const hookProps: IUseSummaryLineExpandable ={
        expand: true,
        classes: classesListSummary,
        toggle: jest.fn(),
        fieldNames: fieldNameSummary,
        formattedPrice: '${{amount}}'
    };
    const content: Array<IApplicationStateDiscount> = [
        {
            code: 'test',
            text: 'text',
            value: 200,
            valid: true
        }
    ];

    const summaryLineExpandedHookResult: IUseSummaryLineExpanded = {
        textAlign: 'center',
        eventDeleteName: '',
        itemId: '',
        content: '',
        deleteElementFromState: jest.fn(),
        closeLoading: false,
        isLoading: false,
        formattedPrice: '${{amount}}'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useSummaryLineExpandedMock.mockReturnValueOnce(summaryLineExpandedHookResult);
    });


    test('rendering the component properly without line item expanded = true', () => {
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);

        const { container } = render(<SummaryLineExpandable {...props}/>);
        expect(container.getElementsByClassName(classesListSummary.container).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.container).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.text).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.arrow).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.list.price).length).toBe(0);
        expect(container.getElementsByClassName('summary-line--no-line').length).toBe(1);
    });

    test('rendering the hook properly without line item expanded = false', () => {
        const localHooksResult = {...hookProps, expand: false};
        useSummaryLineExpandableMock.mockReturnValueOnce(localHooksResult);

        const { container } = render(<SummaryLineExpandable {...props}/>);
        expect(container.getElementsByClassName(classesListSummary.container).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.container).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.text).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.title.arrow).length).toBe(1);
        expect(container.getElementsByClassName(classesListSummary.list.price).length).toBe(1);
        expect(container.getElementsByClassName('summary-line--no-line').length).toBe(0);
    });

    test('rendering the hook properly with line item', () => {
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: content };

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the hook properly with line item - item id as null', () => {
        const localHooks = {...hookProps};
        localHooks.fieldNames.id = '';
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: content };

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

});
