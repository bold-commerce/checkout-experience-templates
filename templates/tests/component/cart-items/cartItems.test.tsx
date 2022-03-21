import {counterNames} from 'src/constants';
import {IApplicationStateLineItem, ICartItemProps, ICartItemsProps} from 'src/types';
import {stateMock} from 'src/mocks';
import {render} from '@testing-library/react';
import {CartItems} from 'src/components';


describe('Testing CartItems component', () => {
    const {one} = counterNames;
    const lineItems: Array<IApplicationStateLineItem> = stateMock.data.application_state.line_items;
    const props: ICartItemsProps = {
        line_items: lineItems
    };

    test('rendering the component successfully', () => {
        const {container} = render(<CartItems {...props}/>);
        expect(container.getElementsByClassName('cart-items').length).toBe(one);
        expect(container.getElementsByClassName('cart-item').length).toBe(lineItems.length);
    });
    
});
