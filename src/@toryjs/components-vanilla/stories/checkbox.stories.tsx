import * as React from 'react';

import { renderFormElement, schemaFromData, create, renderForm } from './common';
import { CheckBoxProps } from '../checkbox_view';
import { Observer } from 'mobx-react';

export default {
  title: 'Vanilla/Checkbox'
};

const createControl = create<CheckBoxProps>('Checkbox');

const data = {
  checked: true,
  unchecked: false,
  values: []
};

const schema = schemaFromData(data);

export const BeforeLabel = () =>
  renderFormElement({
    element: createControl({ checked: { source: 'checked' } }, { label: 'Before', inline: true }),
    schema,
    data
  });

export const AfterLabel = () =>
  renderFormElement({
    element: createControl(
      { checked: { source: 'checked' } },
      { label: 'After', inline: true, labelPosition: 'after' }
    ),
    schema,
    data
  });

export const TopLabel = () =>
  renderFormElement({
    element: createControl({ checked: { source: 'checked' } }, { label: 'Top' }),
    schema,
    data
  });

const controls = (owner: Any) => {
  console.log(owner);
  return (
    <Observer>
      {() => (
        <ul style={{ marginTop: '16px' }}>
          {owner.values.items.map((k: string, i: number) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      )}
    </Observer>
  );
};

export const arraySource = () =>
  renderForm({
    elements: [
      createControl(
        { checked: { source: 'values' }, value: 'Pizza' },
        { label: 'Pizza', inline: true }
      ),
      createControl(
        { checked: { source: 'values' }, value: 'Ice Cream' },
        { label: 'Ice Cream', inline: true }
      ),
      createControl(
        { checked: { source: 'values' }, value: 'Pasta' },
        { label: 'Pasta', inline: true }
      )
    ],
    schema,
    data,
    controls
  });

export const Readonly = () =>
  renderFormElement({
    element: createControl(
      { checked: { source: 'checked' } },
      { label: 'After', inline: true, labelPosition: 'after' }
    ),
    schema,
    data,
    readOnly: true
  });

export const Report = () =>
  renderForm({
    elements: [
      createControl(
        { checked: { source: 'checked' } },
        { label: 'Checked', inline: true, labelPosition: 'after' },
        [],
        'checked'
      ),
      createControl(
        { checked: { source: 'unchecked' } },
        { label: 'Unchecked', inline: true, labelPosition: 'after' },
        [],
        'unchecked'
      )
    ],
    schema,
    data,
    reportOnly: true
  });
