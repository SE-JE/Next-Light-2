import { ReactElement } from 'react';
import { validationRules } from '../../../../helpers';

export type selectOptionProps = {
  label: string;
  value: string | string[] | number | number[];
  custom?: ReactElement;
  searchable?: string[];
};

export type selectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string | string[] | number | number[];
  onChange?: (value: string | string[] | number | number[]) => any;
  onFocus?: any;
  onBlur?: any;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  options: selectOptionProps[];
  leftIcon?: any;
  validations?: validationRules;
  tip?: string;
  clearable?: boolean;
  searchable?: boolean;
  searchServer?: boolean;
  urlOption?: string;
  multiple?: boolean;
  register?: (name: string, validations?: validationRules) => void;
};
