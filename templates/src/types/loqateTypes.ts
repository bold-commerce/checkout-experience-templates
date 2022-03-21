export enum loqateEnumFieldMode {
    /** The field will be ignored. */
    NONE,
    /** Search from this field. */
    SEARCH,
    /** Set the value of this field. */
    POPULATE,
    /** Default of search and populate */
    DEFAULT,
    /** Do not overwrite. */
    PRESERVE,
    /** Show just the country list. */
    COUNTRY = 8
}

export interface ILoqateAddressField {
    element: string;
    field: string;
    mode: number;
}
