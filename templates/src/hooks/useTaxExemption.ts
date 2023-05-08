import {useGetGeneralSettingCheckoutFields, useGetNoteAttributes} from 'src/hooks';
import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ITaxExemption} from 'src/types';
import {ICartParameters, IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';
import {patchOrderMetaData} from 'src/library';

const TAX_EXEMPT_ATTR_KEY = '_tax_exempt_checkbox_selected';

export function useTaxExemption(): ITaxExemption {
    const dispatch = useDispatch();
    const sectionEnabled = useGetGeneralSettingCheckoutFields('tax_exempt_checkbox_enabled') as boolean;
    const noteAttributes = useGetNoteAttributes();
    const [checked, setChecked] = useState(Boolean(noteAttributes[TAX_EXEMPT_ATTR_KEY]));

    // TODO PXP-145 - Reduce API calls when user clicks using const callApiAtOnEvents = useCallApiAtOnEvents();
    // TODO PXP-145 - create ticket to refactor hardcoded vals.  Requires updating language file in Checkout.  IE: const title = getTerm('tax_exemption', Constants.TAX_EXEMPTION);
    const sectionTitle  = 'Tax exemption';
    const label         = 'Tax exempt customer';
    const helpText      = 'Indicate if you are tax exempt in order for us to contact you for verification and reimbursement';
    const messageText   = 'You will be contacted to verify your tax exempt status.  Upon successful verification, the payment method used will be reimbursed.';

    const handleChange = useCallback(e => {
        const {checked} = e.target;

        const payload: IPatchOrderMetaDataRequest = {
            note_attributes: {
                [TAX_EXEMPT_ATTR_KEY]: checked,
            } as ICartParameters,
            cart_parameters: null,
            notes: null,
            tags: null,
        };
        setChecked(checked);
        dispatch(patchOrderMetaData(payload));
    }, []);

    return {
        sectionEnabled,
        checked,
        value: String(checked),
        sectionTitle,
        label,
        helpText,
        messageText,
        handleChange
    };
}
