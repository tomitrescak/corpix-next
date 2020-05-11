import React from 'react';

import { renderForm, renderFormEditor, create, schemaFromData, renderFormElement } from './common';
import { TextProps } from '../text_view';
import { Observer } from 'mobx-react';

export default {
  title: 'Vanilla/Text'
};

const createText = create<TextProps>('Text');

const data = { name: 'Tomas Trescak' };
const schema = schemaFromData(data);

const controls = (owner: Any) => (
  <Observer>
    {() => (
      <div style={{ marginTop: '16px' }}>
        <hr />
        <label>Change Text</label>
        <input onChange={e => (owner.name = e.currentTarget.value)} value={owner.name} />
      </div>
    )}
  </Observer>
);

export const Simple = () => renderFormElement({ element: createText({ value: 'Simple' }) });

export const Bound = () =>
  renderFormElement({
    element: createText({ value: { source: 'name' } }, { label: 'Bound:' }),
    schema,
    data,
    controls
  });

export const DifferentControl = () =>
  renderFormElement({
    element: createText(
      { value: 'I am label element &lt;label&gt;', type: 'label' },
      { label: 'Label' }
    )
  });

export const Labels = () =>
  renderForm({
    elements: [
      createText({ value: 'With Label' }, { label: 'Labeled' }),
      createText({ value: 'Inlined' }, { label: 'Inline:', inline: true }),
      createText({ value: 'With Empty Label', emptyLabel: true })
    ]
  });

export const Interpolated = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createText({ value: 'My name is ${name}' }, { label: 'Interpolated' }),
    schema,
    data
  });

export const Styled = () =>
  renderForm({
    elements: [
      createText(
        { value: 'Styled', css: 'background: red', style: { fontSize: '24px' } },
        { label: 'Container', css: 'background: blue', style: { padding: '18px' } }
      ),
      createText(
        {
          value: 'Styled No Label',
          css: 'background: red',
          style: { fontSize: '24px', display: 'block' }
        },
        { css: 'background: blue', style: { padding: '18px' } }
      )
    ]
  });

export const editor = () => renderFormEditor({ elements: [] });
