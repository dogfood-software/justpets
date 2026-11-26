'use client'

import { createFormHook } from '@tanstack/react-form'
import { CheckboxField } from '../components/form/checkbox-field'
import { fieldContext, formContext } from '../components/form/context'
import { DatePickerField } from '../components/form/date-picker-field'
import { DateRangePickerField } from '../components/form/date-range-picker-field'
import { NumberInputField } from '../components/form/number-input-field'
import { ResetButton } from '../components/form/reset-button'
import { SelectField } from '../components/form/select-field'
import { SliderField } from '../components/form/slider-field'
import { SubmitButton } from '../components/form/submit-button'
import { SwitchField } from '../components/form/switch-field'
import { TextAreaField } from '../components/form/text-area-field'
import { TextInputField } from '../components/form/text-input-field'

export * from '../components/form/context'

export const { useAppForm: useForm, withForm } = createFormHook({
  fieldComponents: {
    CheckboxField,
    // NativeSelectField, // Pro
    // ComboBoxField,
    DatePickerField,
    DateRangePickerField,
    NumberInputField,
    // NumberStepperField, // Pro
    SelectField,
    SliderField,
    // CheckboxGroupField,
    // CheckboxButtonGroupField, // Pro
    // RadioGroupField,
    // RadioButtonGroupField, // Pro
    SwitchField,
    TextAreaField,
    TextInputField,
    // DropZoneField, // Pro
  },
  fieldContext,
  formComponents: {
    ResetButton,
    SubmitButton,
  },
  formContext,
})
