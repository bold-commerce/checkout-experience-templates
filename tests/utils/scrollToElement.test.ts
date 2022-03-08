import {scrollToElement} from 'src/utils';

describe('Testing scrollToElementOnNavigate', () => {
    const scrollIntoViewMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        const div = document.createElement('div');
        div.className = 'test';
        document.body.appendChild(div);

        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    });

    test('rendered and rerender hook', async () => {
        scrollToElement('test');
        expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

        scrollToElement('cant find');
        expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    });

});
