import { renderFormElement, mockFetchResolve, mockFetchReject, schemaFromData } from './common';

import { create, testElement } from './common';
import { FormElement } from '@toryjs/form';
import { FormulaProps } from '../formula_view';

export default {
  title: 'Vanilla/Formula'
};

const createControl = create<FormulaProps>('Formula');

const data = { age: 20 };
const schema = schemaFromData(data);

export const Default = () =>
  renderFormElement({
    element: createControl({ formula: '$age + 20' }, { label: 'Formula' }),
    data,
    schema
  });

export const NoLabel = () =>
  renderFormElement({
    element: createControl({ formula: '$age + 120' }),
    data,
    schema
  });
