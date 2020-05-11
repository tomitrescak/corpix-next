import { styled as styledBase } from './utilities/styled';

export { Text } from 'evergreen-ui';
export { Link } from 'react-router-dom';

// UTILITIES

export {
  createComponent,
  createComponents,
  resolveComponentProps,
  resolveProps,
  extractProps
} from './utilities/component_utilities';

export const styled = styledBase;

export {
  getValue,
  getContainerValue,
  handle,
  setPropValue,
  setValue,
  simpleHandle,
  sourceOfValueProp,
  valueOfProp
} from './utilities/data_utilities';

export { tryInterpolate } from './utilities/string_utilities';

// COMPONENTS

export type { ToryComponent } from './components/dynamic_component';
export { DynamicComponent } from './components/dynamic_component';
export { Form } from './components/form_view';
export { Context, context } from './context/form_context';
export { ToryForm } from './components/tory_form';
