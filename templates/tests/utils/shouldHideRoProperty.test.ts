import { shouldHideRoProperty } from "src/utils";

describe('Test shouldHideRoProperty function', () => {

    const dataSet = [{
        name: 'test empty key with no recurring order',
        cartParameters: {},
        property: '',
        expectedResult: false
    },{
        name: 'test ro property with no recurring order',
        cartParameters: {},
        property: 'frequency_num',
        expectedResult: false
    },{
        name: 'test non ro property with no recurring order',
        cartParameters: {},
        property: 'test',
        expectedResult: false
    },{
        name: 'test ro property with recurring order',
        cartParameters: { 'recurring_order': 'true' } as Record<string,string>,
        property: 'frequency_num',
        expectedResult: true
    },{
        name: 'test non ro property with recurring order',
        cartParameters: { 'recurring_order': 'true' } as Record<string,string>,
        property: 'test',
        expectedResult: false
    }];

    test.each(dataSet)('$name', ({cartParameters, property, expectedResult}) => {
        const result = shouldHideRoProperty(property, cartParameters);
        expect(result).toStrictEqual(expectedResult);
    });

});