import {IApplicationStateLineItem} from 'src/types';
import {stateMock} from 'src/mocks';
import {fireEvent, render} from '@testing-library/react';
import {CartItem, SemiControlledNumberInput} from 'src/components';
import { mocked } from 'jest-mock';

jest.mock('src/components/semi-controlled-number-input/semiControlledNumberInput');

const SemiControlledNumberInputMock = mocked(SemiControlledNumberInput);

describe('Testing CartItem component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    const lineItem: IApplicationStateLineItem = stateMock.data.application_state.line_items[0];
    const lineItemVariant: IApplicationStateLineItem = {
        ...lineItem,
        product_data: {
            ...lineItem.product_data,
            title: 'Variant Title'
        }
    };

    const dataArray = [
        {
            name: 'rendering the cart item component without variant',
            props: { line_item: lineItem },
            counters: { variant_title: 0 }
        },
        {
            name: 'rendering the cart item component with a variant',
            props: { line_item: lineItemVariant },
            counters: { variant_title: 1 }
        },
    ];

    test.each(dataArray)('$name', ({counters, props}) => {
        const {container} = render(<CartItem {...props}/>);
        expect(container.getElementsByClassName('cart-item').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__text').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__title').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__variant-title').length).toBe(counters.variant_title);
        expect(container.getElementsByClassName('cart-item__price-quantity').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-container').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-number').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__price').length).toBe(1);
        expect(container.getElementsByClassName('cart-item__quantity-controls').length).toBe(0);
    });

    test('rendering the cart item with quantity selector', () => {
        SemiControlledNumberInputMock.mockImplementation(() => <div data-testid="test-input" />);
        const { container, getByTestId } = render(<CartItem line_item={lineItem} onUpdateQuantity={jest.fn()} />);
        
        expect(container.getElementsByClassName('cart-item__quantity-controls').length).toBe(1);
        expect(getByTestId('test-input')).toBeTruthy();
    });
    
    test('updating the local quantity and submitting the quantity', () => {
        let onCommit: (qty: number) => void = jest.fn();
        SemiControlledNumberInputMock.mockImplementation((props) => {
            onCommit = props.onCommit;
            return <div data-testid="test-input" />;
        });
        const onUpdateQuantity = jest.fn();
        const _lineItem: IApplicationStateLineItem = {
            ...lineItem,
            product_data: {
                ...lineItem.product_data,
                quantity: 1,
            }
        };

        const { container } = render(<CartItem line_item={_lineItem} onUpdateQuantity={onUpdateQuantity} />);
        const [ incrementButton ] = container.getElementsByClassName('cart-item__quantity-increase');
        const [ decrementButton ] = container.getElementsByClassName('cart-item__quantity-decrease');
        expect(incrementButton).toBeTruthy();
        expect(decrementButton).toBeTruthy();
        
        // Testing incrememnting and decrementing should not all onUpdateQuantity
        fireEvent.click(incrementButton);
        fireEvent.click(decrementButton);
        jest.runAllTimers();
        expect(onUpdateQuantity).not.toHaveBeenCalled();

        // Testing incrementing and letting the debounce happen should call onUpdateQuantity
        fireEvent.click(incrementButton);
        jest.runAllTimers();
        expect(onUpdateQuantity).toBeCalledTimes(1);
        expect(onUpdateQuantity).toBeCalledWith(_lineItem.product_data.line_item_key, 2);

        // Testing calling commit from the <SemiControlledNumberInput />
        onCommit(2);
        expect(onUpdateQuantity).toBeCalledTimes(2);
    });
});
