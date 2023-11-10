import {placeHolderTransformer} from 'src/utils/placeholder';

describe('placeHolderData', () => {
    it('should return placeholder if active and data is empty', () => {
        const data = '';
        const placeHolder = 'Enter text here';
        const active = true;

        const expected = placeHolder;

        expect(placeHolderTransformer(data, placeHolder, active)).toEqual(expected);
    });

    it('should return data if not active or data is not empty', () => {
        const data = 'Hello world';
        const placeHolder = 'Enter text here';
        const active = false;

        const expected = data;

        expect(placeHolderTransformer(data, placeHolder, active)).toEqual(expected);
    });
});