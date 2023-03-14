import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type sidebarItem = {
  icon?: IconProp;
  label: string;
  // key: string;
  path: string;
  items?: sidebarItem[];
};

export type sidebarHeadItem = {
  label: string;
  // key: string;
  collapse: boolean;
  items?: sidebarItem[];
};

export type sidebarProps = {
  items: sidebarHeadItem[];
  basePath?: string;
  show?: boolean;
  minimize?: boolean;
  children?: any;
  onChange?: (active: object[]) => void;
};
