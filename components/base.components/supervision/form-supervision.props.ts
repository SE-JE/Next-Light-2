import { postProps } from './../../../helpers/api.helpers';
import {
  inputCheckboxProps,
  inputDateProps,
  inputFileProps,
  inputImageProps,
  inputMapProps,
  inputNumberProps,
  inputProps,
  inputRadioProps,
  inputTimeProps,
  selectProps,
} from '../input';

export type formProps = {
  construction?:
    | inputProps
    | selectProps
    | inputDateProps
    | inputTimeProps
    | inputNumberProps
    | inputRadioProps
    | inputCheckboxProps
    | inputFileProps
    | inputImageProps
    | inputMapProps;
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  type?:
    | 'default'
    | 'select'
    | 'number'
    | 'date'
    | 'time'
    | 'radio'
    | 'check'
    | 'file'
    | 'image'
    | 'map'
    | 'custom';
  custom?: () => any;
};

export type formSupervisionProps = {
  title?: string;
  forms: formProps[];
  submitControl: postProps;
  confirmation?: boolean;
  defaultValue?: object;
  onSuccess?: () => void;
  customActionBar?: any;
};
