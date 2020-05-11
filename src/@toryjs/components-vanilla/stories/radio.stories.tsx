import * as React from 'react';

import { renderFormElement, schemaFromData, create, renderForm } from './common';
import { RadioProps } from '../radio_view';
import { Observer } from 'mobx-react';
import { Option } from '@toryjs/form';

export default {
  title: 'Vanilla/Radio'
};

const createControl = create<RadioProps>('Radio');

const options: Option[] = [
  { value: 'm', label: 'Male' },
  { value: 'f', label: 'Female' },
  { value: 'o', label: 'Other' }
];

const data = {
  gender: '',
  selected: 'o'
};

const schema = schemaFromData(data);

export const Horizontal = () =>
  renderFormElement({
    element: createControl({ options, value: { source: 'gender' } }, { label: 'Sex' }),
    schema,
    data
  });

export const Vertical = () =>
  renderFormElement({
    element: createControl(
      { options, vertical: true, value: { source: 'gender' }, style: { margin: '4px' } },
      { label: 'Sex' }
    ),
    schema,
    data
  });

export const Selected = () =>
  renderFormElement({
    element: createControl(
      { options, vertical: true, value: { source: 'selected' } },
      { label: 'Sex' }
    ),
    schema,
    data
  });

export const Readonly = () =>
  renderFormElement({
    element: createControl(
      { options, vertical: true, value: { source: 'selected' } },
      { label: 'Sex' }
    ),
    readOnly: true,
    schema,
    data
  });

export const Report = () =>
  renderFormElement({
    element: createControl(
      { options, vertical: true, value: { source: 'selected' } },
      { label: 'Sex' }
    ),
    reportOnly: true,
    schema,
    data
  });
