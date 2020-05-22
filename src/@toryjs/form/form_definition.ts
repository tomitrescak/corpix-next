import * as React from 'react';

import { JSONSchema } from './json_schema';
import { ToryFormContext } from './context_definition';
import { Handlers } from './handler_definition';
import { DataSet } from './stores/dataset_model';
import { ToryComponent } from '@toryjs/ui';

export type Option = {
  [index: string]: Any;
  label?: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  description?: string;
  type?: string;
};

interface FormElementBase {
  uid: string;
  documentation?: string;
  group?: string;
  tuple?: string;
  control: string;
  bound?: boolean;
}

export interface ContainerProps {
  css?: string;
  style?: Any;
  className?: string;

  label?: string;
  labelPosition?: 'before' | 'after';
  inline?: boolean;
  documentation?: string;
  display?: string;

  hidden?: boolean;
  readOnly?: boolean;
  children?: any;

  editorLabel?: string;

  onMount?: string;
}

export interface CommonComponentProps {
  // css?: string;
  style?: Any;
  className?: string;
  id?: string;
  'data-control'?: string;
}

export interface FormElement<P = Any> extends FormElementBase {
  parent?: FormElement;
  componentProps?: CommonComponentProps & P;
  containerProps?: ContainerProps;
  elements?: FormElement[];
  components?: FormElement[];
}

export type BoundType<T = string> = {
  value?: T;
  handler?: string;
  name?: string;
  dynamicHandler?: string;
  source?: string;
  sourceId?: string;
  validate?: string;
  parse?: string;
  args?: Any;
  type?: string;
};

export type BoundProp<T = string> = T | BoundType<T>;

export type FormComponentProps<P = Any, O = Any, C = ToryFormContext> = {
  catalogue: ComponentCatalogue;
  formElement: FormElement<P>;
  handlers: Handlers<O, C>;
  owner: DataSet<O>;
  context: C;

  readOnly?: boolean;
  reportOnly?: boolean;

  componentProps?: P & CommonComponentProps;
  // containerProps?: ContainerProps;
  dynamicProps?: Any[];

  uid?: string;
};

// [K in keyof T]: Prop;
// type ControlProps = { [index: string]: BoundProp };

type Prop = {
  control: FormElement;
  schema: JSONSchema;
  defaultValue?: Any;
};

type PropMap = { [index: string]: Prop };

export type EditorComponent<P = Any, O = Any> = {
  Component: React.ComponentType<FormComponentProps<P, O>>;
  props: PropMap;
  childProps?: PropMap;
  provider?: boolean;
  control: string;
  group?: string;
  icon: {
    universal?: JSX.Element;
    dark?: JSX.Element;
    light?: JSX.Element;
  };
  title: string;
  defaultChildren?: FormElement[];
  defaultProps?: { [index: string]: Any };
  bound?: boolean;
  events?: boolean;
  handlers?: Handlers<Any, Any>;
  valueProvider?: string;
};

/* CATALOGUES */

type ComponentCatalogue<T = Any> = {
  isEditor?: boolean;
  createComponent: Any;
  components: { [index: string]: T };
};

export type FormComponentCatalogue = ComponentCatalogue<ToryComponent<Any>>;
export type EditorComponentCatalogue = ComponentCatalogue<EditorComponent>;

// type FormExtension = (props: FormViewProps) => void;

// type FormViewProps = {
//   formElement: FormElement;
//   extensions?: FormExtension[];
//   owner: DataSet;
//   catalogue: FormComponentCatalogue;
//   handlers: Handlers<Any, Any>;
//   readOnly?: boolean;
// };

// type EditorFormViewProps<P, O> = {
//   formElement: FormElement<P>;
//   owner: DataSet<O>;
//   catalogue: FormComponentCatalogue;
//   handlers: Handlers<Any, Any>;
//   readOnly?: boolean;
// };

// type FormProp = {
//   [index: string]: string | number | boolean | BoundProp;
// };

// type CommonProps = {
//   label?: string;
//   help?: string;
//   css?: string;
//   className?: string;
// };

// type CommonPropNames = keyof CommonProps;
