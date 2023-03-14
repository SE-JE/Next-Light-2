import { filterColumnProps } from './../table/filter.props';
import { getProps } from '../../../helpers';
import { formProps } from './form-supervision.props';

export type tableSupervisionColumnProps = {
  selector: string;
  label?: string;
  width?: string;
  sortable?: boolean;
  filter?: filterColumnProps;
  item?: any;
};

export type tableSupervisionColumnGroupProps = {
  custom: tableSupervisionColumnProps[];
  change: (tableSupervisionColumnProps & { custom: (data: any) => any })[];
  include: (tableSupervisionColumnProps & { before: string })[];
  except: string[];
  searchable: string[];
  exceptSorts: string[];
};

export type tableSupervisionFormGroupProps = {
  custom: formProps[];
  change: formProps[];
  include: formProps[];
  except: string[];
};

export type tableSupervisionFormUpdateGroupProps = {
  custom: formProps[];
  change: formProps[];
  include: formProps[];
  except: string[];
  customDefaultValue: (data: object) => object;
};

export type tableSupervisionActionProps = {
  custom: (data: object, handler: object) => any;
  except: ('detail' | 'edit' | 'delete')[];
  include: (data: object, handler: object) => any;
};

export type tableSupervisionProps = {
  title?: string;
  fetchControl: getProps;
  setToRefresh?: boolean;
  setToLoading?: boolean;
  customTopBar?: any;
  columnControl?: tableSupervisionColumnGroupProps;
  formControl?: tableSupervisionFormGroupProps;
  formUpdateControl?: tableSupervisionFormUpdateGroupProps;
  actionControl?: tableSupervisionActionProps;
};
