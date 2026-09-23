export type FieldType = 'text' | 'textearea' | 'date' | 'select' | 'repeater';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface RepeaterConfig {
    itemLabel: string;
    addLabel: string;
    emptySatetText?: string;
    minItems?: number;
    fields: FormFieldSchema[];
}

export interface FormFieldSchema {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: SelectOption[];
    repeaterConfig?: RepeaterConfig;
    rows?: number;
    helpText?: string;
    placeholder?: string;
}

export interface FormSectionSchema {
    id: string;
    title: string;
    fields: FormFieldSchema[];
    description?: string;
}

export interface FormSchema {
    id: string;
    title: string;
    sections: FormSectionSchema[];
}


