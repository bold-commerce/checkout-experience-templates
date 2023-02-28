import {useDispatch} from 'react-redux';
import {
    useGetAddressPostalCodeAndProvinceData,
    useGetAddressDataField,
    useCallApiAtOnEvents,
    useGetErrorByField
} from 'src/hooks';
import {useCallback} from 'react';
import {IAddressProvinceHookProps} from 'src/types';
import {AddressLabelMapping, Constants} from 'src/constants';
import {actionRemoveErrorByField, actionUpdateAddressField} from 'src/action';
import {getTerm} from 'src/utils';

export function useGetAddressProvinceInputData(type: string, debounceApiCall: () => void): IAddressProvinceHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const value: string = useGetAddressDataField(type, Constants.ADDRESS_PROVINCE_CODE);
    const provinceName = useGetAddressDataField(type, Constants.ADDRESS_PROVINCE);
    const name = Constants.ADDRESS_PROVINCE;

    const {province, showProvince, provinceLabel} = useGetAddressPostalCodeAndProvinceData(type);
    const provinceOptions = province.map(p => ({value: p.iso_code, name: p.name}));
    const id = `${type}-address__province`;
    const dataTestId = `${type}-address-province`;
    const placeholder = getTerm(AddressLabelMapping[`${provinceLabel}_placeholder`],Constants.SHIPPING_INFO);
    const label = getTerm(AddressLabelMapping[provinceLabel],Constants.SHIPPING_INFO);
    const errorMessage = useGetErrorByField('province', type);

    const handleChange = useCallback(e => {
        const value = e.target.value;
        const field = e.target[e.target.selectedIndex].text;

        dispatch(actionUpdateAddressField(Constants.ADDRESS_PROVINCE, field, type ));
        dispatch(actionUpdateAddressField(Constants.ADDRESS_PROVINCE_CODE, value, type ));

        if(errorMessage){
            dispatch(actionRemoveErrorByField('province', type));
        }

        if(callApiAtOnEvents) {
            debounceApiCall();
        }

    }, [errorMessage, callApiAtOnEvents, type]);

    return {placeholder, label, id, name , value, showProvince, provinceOptions, handleChange, errorMessage, provinceName, dataTestId};
}
