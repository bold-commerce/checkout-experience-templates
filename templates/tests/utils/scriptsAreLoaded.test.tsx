import {scriptsAreLoaded} from 'src/utils';

describe('testing scriptsAreLoaded', () => {

    const mockIDOne = 'mock-id-1';
    const mockIDTwo = 'mock-id-2';
    const mockScriptIdsArray: string[] = [mockIDOne, mockIDTwo];

    const dataProvider = [
        {
            name: 'Scripts exist and are loaded correctly',
            documentBody: `<p id="${mockIDOne}"></p><p id="${mockIDTwo}"></p>`,
            idsArray: mockScriptIdsArray,
            expectedResult: true
        },
        {
            name: 'Array of scripts to check is empty',
            documentBody: `<p id="${mockIDOne}"></p><p id="${mockIDTwo}"></p>`,
            idsArray: [],
            expectedResult: false
        },
        {
            name: 'Scripts are not present  in the body',
            documentBody: '<p>Some body without ID nor scripts</p>',
            idsArray: mockScriptIdsArray,
            expectedResult: false
        },
    ];

    test.each(dataProvider)('$name', ({documentBody, idsArray, expectedResult}) => {
        document.body.innerHTML = documentBody;
        const areLoaded = scriptsAreLoaded(idsArray);
        expect(areLoaded).toStrictEqual(expectedResult);
    });
});
