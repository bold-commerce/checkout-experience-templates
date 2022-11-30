import {lockUnlockScroll} from 'src/utils';

describe('testing lockUnlockScroll', () => {

    const dataProvider = [
        {
            name: 'Call with true and loading',
            htmlClassName: 'test loading',
            lock: true,
            expectedHtmlClassName: 'test loading'
        },
        {
            name: 'Call with true without loading',
            htmlClassName: 'test',
            lock: true,
            expectedHtmlClassName: 'test loading'
        },
        {
            name: 'Call with false and loading',
            htmlClassName: 'test loading',
            lock: false,
            expectedHtmlClassName: 'test'
        },
        {
            name: 'Call with false, without loading',
            htmlClassName: 'test',
            lock: false,
            expectedHtmlClassName: 'test'
        },
    ];

    test.each(dataProvider)('$name', ({htmlClassName, lock, expectedHtmlClassName}) => {
        const html = document.querySelector('html') as HTMLHtmlElement;
        html.className = htmlClassName;

        lockUnlockScroll(lock);

        expect(html.className).toBe(expectedHtmlClassName);
    });
});
