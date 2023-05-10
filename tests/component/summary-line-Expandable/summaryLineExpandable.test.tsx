import {
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
import {IDiscount, IPayment} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/hooks');
const useSummaryLineExpandableMock = mocked(useSummaryLineExpandable, true);
const useSummaryLineExpandedMock = mocked(useSummaryLineExpanded, true);

describe('Testing SummaryLineExpandable component', () => {
    const fieldNameSummary = {content: 'description', amount: 'amount', id: 'id'};

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
    const content: Array<IDiscount> = [
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
        deleteElement: jest.fn(),
        closeLoading: false,
        isLoading: false,
        formattedPrice: '${{amount}}',
        deleteDataTestId: 'some-test-id'
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

    test('rendering the component properly without line item expanded = false', () => {
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

    test('rendering the component properly with line item', () => {
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: content };

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the component properly with line item containing source but empty string', () => {
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: content};
        localProps.content[0].source = '';

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the component properly with line item containing source and not empty string', () => {
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: content};
        localProps.content[0].source = 'some_source';

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the component properly with line item containing source and "cart" string', () => {
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: content};
        localProps.content[0].source = 'cart';

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the component properly with line item - item id empty', () => {
        const localHooks = {...hookProps, fieldNames: {...hookProps.fieldNames, id: ''}};
        useSummaryLineExpandableMock.mockReturnValueOnce(localHooks);
        const localProps = {...props, content: content };

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the component properly with payment line item - item amount and value defined', () => {
        const localContent: Array<IPayment> = [
            {
                gateway_public_id: 'test',
                amount: 200,
                currency: 'CAD',
                type: 'credit',
                display_string: '1111',
                id: 'test',
                token: 'test',
                retain: true,
                value: 200
            }
        ];
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: localContent, eventToggleName: Constants.PAYMENTS_TOGGLE};

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });

    test('rendering the component properly with payment line item - item amount define, value and id undefined', () => {
        const localContent: Array<IPayment> = [
            {
                gateway_public_id: 'test',
                amount: 200,
                currency: 'CAD',
                type: 'credit',
                display_string: '1111',
                id: 'test',
                token: 'test',
                retain: true
            }
        ];
        useSummaryLineExpandableMock.mockReturnValueOnce(hookProps);
        const localProps = {...props, content: localContent, eventToggleName: Constants.PAYMENTS_TOGGLE};

        const { container } = render(<SummaryLineExpandable {...localProps}/>);
        expect(container.getElementsByClassName(classesListSummary.list.li).length).toBe(content.length);
    });
});
