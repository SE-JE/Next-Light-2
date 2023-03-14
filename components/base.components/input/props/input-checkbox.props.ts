import { validationRules } from '../../../../helpers';

export type inputCheckboxOptionProps = {
  value: string | number;
  label: string;
};

export type inputCheckboxProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  value?: string[] | number[];
  onChange?: (value: string[] | number[]) => any;
  checked?: boolean;
  color?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  options?: inputCheckboxOptionProps[];
  vertical?: boolean;
  placeholder?: string;
  validations?: validationRules;
  register?: (name: string, validations?: validationRules) => void;
};
