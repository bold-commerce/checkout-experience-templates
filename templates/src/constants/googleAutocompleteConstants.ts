export class GoogleAutocompleteConstants {
    static googleAutocompleteScriptId = 'google-autocomplete-script-loader';
    static srcWithKey = 'https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places&callback=initializeAutoComplete';
    static eventToListen = 'place_changed';
}
