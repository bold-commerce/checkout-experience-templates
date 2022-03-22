import {getPigiIframe} from 'src/utils';
import {Constants} from 'src/constants';

describe('Test helpers for PIGI iFrame', () => {
    const bodyContentVar = 'BODY_CONTENT';
    const documentBody = `<html><head><title>Some title</title></head><body>${bodyContentVar}</body></html>`;
    const pigiElement = `<iframe><div id="${Constants.PIGI_IFRAME}" style="height:20px">PIGI content</div></iframe>`;

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('getPigiIframe function when element doesn\'t exist', () => {
        document.body.innerHTML = documentBody.replace(bodyContentVar, '');
        const returned = getPigiIframe();
        expect(returned).toBeNull();
    });

    test('getPigiIframe function when element exists', () => {
        document.body.innerHTML = documentBody.replace(bodyContentVar, pigiElement);
        const expected = document.getElementById(Constants.PIGI_IFRAME);
        const returned = getPigiIframe();
        expect(returned).toBe(expected);
    });
});
