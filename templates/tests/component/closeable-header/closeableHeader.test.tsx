import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CloseableHeader } from 'src/components';


describe('testing closeableHeader component', () => {
    const props = {
        title: 'test title',
        onClose: jest.fn()
    }

    test('rendering the component successfully', () => {
        const { container } = render(<CloseableHeader {...props}/>)

        expect(container.getElementsByClassName('closeable-header').length).toBe(1);
        expect(container.getElementsByClassName('closeable-header__title').length).toBe(1);
        expect(container.getElementsByClassName('closeable-header__button').length).toBe(1);
        expect(container.getElementsByClassName('closeable-header__title')[0].innerHTML).toBe(props.title);

        const button = screen.getByTestId('closeable-header');
        fireEvent.click(button);
        expect(props.onClose).toHaveBeenCalledTimes(1);
    });
});
