import { getLineItemPropertiesForDisplay } from "src/utils";

describe('Test getLineItemPropertiesForDisplay function', () => {

    const dataSet = [{
        name: 'test empty line item properties',
        cartParameters: {},
        properties: {},
        expectedProperties: []
    },{
        name: 'test populated line item properties',
        cartParameters: {},
        properties: {'property1': 'my value', 'property2': 'my second value'} as Record<string, string>,
        expectedProperties: ['property1: my value', 'property2: my second value']
    },{
        name: 'test populated line item properties with empty property',
        cartParameters: {},
        properties: {'property1': 'my value', 'property2': ''} as Record<string, string>,
        expectedProperties: ['property1: my value']
    },{
        name: 'test populated line item properties with hidden property',
        cartParameters: {},
        properties: {'property1': 'my value', '_property2': 'my hidden second value'} as Record<string, string>,
        expectedProperties: ['property1: my value']
    },{
        name: 'test empty line item properties with RO',
        cartParameters: {'recurring_order': 'true'} as Record<string, string>,
        properties: {},
        expectedProperties: []
    },{
        name: 'test populated line item properties with RO true',
        cartParameters: {'recurring_order': 'true'} as Record<string, string>,
        properties: {'property1': 'my value', 'property2': 'my second value', 'frequency_type': '1'} as Record<string, string>,
        expectedProperties: ['property1: my value', 'property2: my second value']
    },{
        name: 'test populated line item properties with RO false',
        cartParameters: {'recurring_order': 'false'} as Record<string, string>,
        properties: {'property1': 'my value', 'property2': 'my second value', 'frequency_type': '1'} as Record<string, string>,
        expectedProperties: ['property1: my value', 'property2: my second value', 'frequency_type: 1']
    }];

    test.each(dataSet)('$name', ({cartParameters, properties, expectedProperties}) => {
            const result = getLineItemPropertiesForDisplay(properties, cartParameters);
            expect(result).toStrictEqual(expectedProperties);
        });

});