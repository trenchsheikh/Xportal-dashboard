import { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface TextareaConfig {
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export interface SliderConfig {
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

export interface DatePickerConfig {
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabledDates?: Date[];
}

export interface FileUploadConfig {
  accept?: string;
  acceptedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
}

export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}
