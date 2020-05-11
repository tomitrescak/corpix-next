import { renderForm, dataSchemaFromData, createText } from './common';

import { create } from './common';
import { IfProps } from '../if_view';
import { FormElement } from '@toryjs/form';

export default {
  title: 'Vanilla/If'
};

const { schema, data } = dataSchemaFromData({
  name: 'Tomas',
  age: 40,
  moto: undefined
});

const createControl = create<IfProps>('If');

const children = (label: string): FormElement[] => [
  {
    control: 'Container',
    uid: 'trueContainer',
    elements: [createText('True', label)],
    componentProps: {},
    containerProps: {}
  },
  {
    control: 'Container',
    uid: 'falseContainer',
    elements: [createText('False', label)],
    componentProps: {},
    containerProps: {}
  }
];

export const Exists = () =>
  renderForm({
    elements: [
      createControl(
        { exists: true, value: { source: 'sureName' } },
        {},
        children('Has Surename'),
        'sn'
      ),
      createControl({ exists: true, value: { source: 'moto' } }, {}, children('Has Moto'), 'moto'),
      createControl({ exists: true, value: { source: 'name' } }, {}, children('Has Name'), 'name')
    ],
    schema,
    data
  });
