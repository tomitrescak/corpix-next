import * as React from 'react';

import { renderFormElement, schemaFromData, create, renderForm } from './common';
import { DropdownProps } from '../dropdown_view';

export default {
  title: 'Vanilla/Dropdown'
};

const createControl = create<DropdownProps>('Dropdown');

const data = {
  value: '',
  make: '--'
};
const schema = schemaFromData(data);

const options = [
  { value: '', label: 'None' },
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' }
];

const cars = [
  { value: '', label: 'None' },
  { value: 'skoda', label: 'Skoda' },
  { value: 'bmw', label: 'Bmw' }
];

const skodaMakes = [
  { value: '1', label: 'Octavia', make: 'skoda' },
  { value: '2', label: 'Fabia', make: 'skoda' }
];

const bmwMakes = [
  { value: '3', label: 'M3', make: 'bmw' },
  { value: '4', label: 'M5', make: 'bmw' },
  { value: '4', label: 'M7', make: 'bmw' }
];

const makes = [{ value: '', label: 'None' }, ...skodaMakes, ...bmwMakes];

const handlers = {
  asyncOptions() {
    return new Promise(resolve => {
      setTimeout(() => resolve(options), 10);
    });
  },
  asyncFilter({ args }: Any) {
    return new Promise(resolve => {
      setTimeout(() => {
        switch (args) {
          case 'skoda':
            resolve(skodaMakes);
            return;
          case 'bmw':
            resolve(bmwMakes);
            return;
          default:
            resolve([]);
            return;
        }
      }, 20);
    });
  }
};

export const Basic = () =>
  renderFormElement({
    element: createControl({ options }, { label: 'Basic' }),
    schema,
    data
  });

export const Cascade = () =>
  renderForm({
    elements: [
      createControl({ options: cars, value: { source: 'make' } }, { label: 'Cars' }, [], 'car'),
      createControl(
        { options: makes, filterSource: { source: 'make' }, filterColumn: 'make' },
        { label: 'Makes' },
        [],
        'make'
      )
    ],
    schema,
    data
  });

export const CascadeAsync = () =>
  renderForm({
    elements: [
      createControl({ options: cars, value: { source: 'make' } }, { label: 'Cars' }, [], 'car'),
      createControl(
        {
          asyncOptionsHandler: 'asyncFilter',
          filterSource: { source: 'make' },
          filterColumn: 'make'
        },
        { label: 'Makes' },
        [],
        'make'
      )
    ],
    schema,
    data,
    handlers
  });

export const Async = () =>
  renderFormElement({
    element: createControl({ asyncOptionsHandler: 'asyncOptions' }, { label: 'Async Load' }),
    schema,
    data,
    handlers
  });

export const Readonly = () =>
  renderFormElement({
    element: createControl({ options }, { label: 'Basic' }),
    schema,
    data,
    readOnly: true
  });

export const Report = () =>
  renderFormElement({
    element: createControl({ options: cars, value: { source: 'make' } }, { label: 'Basic' }),
    schema,
    data: { make: 'skoda' },
    reportOnly: true
  });
