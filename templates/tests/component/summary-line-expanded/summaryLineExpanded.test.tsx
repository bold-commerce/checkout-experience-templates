import {IPaymentsSummaryClasses, ISummaryLineExpanded, IUseSummaryLineExpanded} from 'src/types';
import {fireEvent, render, screen} from '@testing-library/react';
import {SummaryLineExpanded} from 'src/components';
import {mocked} from 'ts-jest/utils';
import {useSummaryLineExpanded} from 'src/hooks';

jest.mock('src/hooks/useSummaryLineExpanded');
const useSummaryLineExpandedMock = mocked(useSummaryLineExpanded, true);

describe('Testing SummaryLineExpanded component', () => {
    const classes: IPaymentsSummaryClasses =  {
        container: 'TEST',
        title: {
            container: 'container-test',
            arrow: 'arrow-test',
            text: 'text-test',
            price: 'price-text'
        },
        list: {
            ul: 'ul-test',
            li: 'li-test',
            text: 'text-test',
            price: 'price-test',
            delete: 'delete-test',
            loading: 'loading-test',
            loadingSpan: 'loadingSpan-test'
        }
    };

    const props: ISummaryLineExpanded = {
        amount: 5,
        content: 'code',
        id: 'test-id',
        classes: classes
    };

    const hookResult: IUseSummaryLineExpanded = {
        textAlign: 'center',
        eventDeleteName: '',
        itemId: '',
        deleteElementFromState: jest.fn(),
        closeLoading: false,
        isLoading: false,
        formattedPrice: '${{amount}}'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rendering the component', () => {
        useSummaryLineExpandedMock.mockReturnValueOnce(hookResult);

        const {container} = render(<SummaryLineExpanded {...props} />);
        expect(container.getElementsByClassName(classes.list.li).length).toBe(1);
        expect(container.getElementsByClassName(classes.list.text).length).toBe(1);
        expect(container.getElementsByClassName(classes.list.price).length).toBe(1);
    });

    test('rendering the component with hasDeleteButton as true and closeLoading as false', () => {
        const localProps = {...props};
        localProps.hasDeleteButton = true;
        const hookLocalProps = {...hookResult};
        hookLocalProps.closeLoading = false;
        useSummaryLineExpandedMock.mockReturnValueOnce(hookLocalProps);

        const {container} = render(<SummaryLineExpanded {...localProps} />);
        expect(container.getElementsByClassName(classes.list.delete).length).toBe(1);
    });

    test('rendering the component with hasDeleteButton as true and closeLoading as true', () => {
        const localProps = {...props};
        localProps.hasDeleteButton = true;
        const hookLocalProps = {...hookResult};
        hookLocalProps.closeLoading = true;
        useSummaryLineExpandedMock.mockReturnValueOnce(hookLocalProps);

        const {container} = render(<SummaryLineExpanded {...localProps} />);
        expect(container.getElementsByClassName(classes.list.loading).length).toBe(1);
        expect(container.getElementsByClassName(classes.list.loadingSpan).length).toBe(1);
    });

    test('rendering the component with hasDeleteButton as true and isloading as true ', () => {
        const localProps = {...props};
        localProps.hasDeleteButton = true;
        const hookLocalProps = {...hookResult};
        hookLocalProps.isLoading = true;
        useSummaryLineExpandedMock.mockReturnValueOnce(hookLocalProps);

        const {container} = render(<SummaryLineExpanded {...localProps} />);
        expect(container.getElementsByClassName(classes.list.delete).length).toBe(0);
    });

    test('calling the on click event ', () => {
        const localProps = {...props};
        localProps.hasDeleteButton = true;
        const hookLocalProps = {...hookResult};
        hookLocalProps.closeLoading = false;
        useSummaryLineExpandedMock.mockReturnValueOnce(hookLocalProps);

        render(<SummaryLineExpanded {...localProps} />);
        const input = screen.getByTestId('delete-discount');
        fireEvent.click(input);
        expect(hookResult.deleteElementFromState).toHaveBeenCalled();
    });

});
