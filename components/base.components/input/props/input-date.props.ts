import { validationRules } from '../../../../helpers';

export type inputDateProps = {
  range?: boolean;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string | Date | string[] | Date[];
  onChange?: (value: Date | Date[]) => any;
  onFocus?: any;
  onBlur?: any;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: any;
  validations?: validationRules;
  tip?: string;
  min?: Date;
  max?: Date;
  defaultView?: 'month' | 'year' | 'decade' | 'century';
  register?: (name: string, validations?: validationRules) => void;
};
