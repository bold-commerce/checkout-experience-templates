import { getLineItemPropertiesForDisplay } from "src/utils";

describe('Test getLineItemPropertiesForDisplay function', () => {

    const dataSet = [{
        name: 'test empty line item properties',
        properties: {},
        expectedProperties: []
    },{
        name: 'test populated line item properties',
        properties: {'property1': 'my value', 'property2': 'my second value'} as Record<string, string>,
        expectedProperties: ['property1: my value', 'property2: my second value']
    },{
        name: 'test populated line item properties with empty property',
        properties: {'property1': 'my value', 'property2': ''} as Record<string, string>,
        expectedProperties: ['property1: my value']
    },{
        name: 'test populated line item properties with hidden property',
        properties: {'property1': 'my value', '_property2': 'my hidden second value'} as Record<string, string>,
        expectedProperties: ['property1: my value']
    }];

    test.each(dataSet)('$name', ({properties, expectedProperties}) => {
            const result = getLineItemPropertiesForDisplay(properties);
            expect(result).toStrictEqual(expectedProperties);
        });

});