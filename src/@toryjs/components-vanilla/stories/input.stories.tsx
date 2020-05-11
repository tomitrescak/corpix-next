import { schemaFromData, create, renderForm, renderFormElement } from './common';
import { InputProps } from '../input_view';
import { TextProps } from '../text_view';

export default {
  title: 'Vanilla/Input'
};

const createControl = create<InputProps>('Input');
const createText = create<TextProps>('Text');

const data = {
  name: 'Tomas'
};

const schema = schemaFromData(data);

export const View = () =>
  renderForm({
    elements: [
      createControl({ value: { source: 'name' } }, { label: 'Name' }),
      createText({ value: { source: 'name' } })
    ],
    schema,
    data
  });

export const Readonly = () =>
  renderFormElement({
    element: createControl({ value: { source: 'name' } }, { label: 'Name' }),
    schema,
    data,
    readOnly: true
  });

export const Report = () =>
  renderFormElement({
    element: createControl({ value: { source: 'name' } }, { label: 'Name' }),
    schema,
    data,
    reportOnly: true
  });
