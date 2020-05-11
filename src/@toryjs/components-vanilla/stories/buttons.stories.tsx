import React from 'react';
import { Observer } from 'mobx-react';

import { renderForm, renderFormEditor, create, schemaFromData } from './common';
import { ButtonProps } from '../buttons_view';

export default {
  title: 'Vanilla/Button'
};

const data = { name: 'Tomas Trescak' };
const schema = schemaFromData(data);

const handlers = {
  click: () => console.log('click')
};

const createButton = create<ButtonProps>('Button');

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

const buttons = [
  createButton({ onClick: 'click', type: 'submit', text: 'Button With Click Handler' }),
  createButton({
    text: 'Button With Click Handler',
    onClick: { handler: 'click' },
    type: 'submit'
  }),
  createButton({
    text: 'Button With Dynamic Click Handler',
    onClick: { dynamicHandler: 'console.log("Dynamic!")' },
    type: 'submit'
  }),
  createButton(
    {
      text: 'Button With Dynamic Click Handler',
      onClick: { dynamicHandler: 'console.log("Dynamic!")' },
      type: 'submit',
      style: {
        background: 'pink',
        color: 'red'
      }
    },
    {
      style: { background: 'blue' },
      label: 'Styled'
    }
  ),
  createButton(
    {
      text: { source: 'name' }
    },
    { label: 'Bound Text' }
  )
];

export const view = () => renderForm({ elements: buttons, handlers, schema, data, controls });

export const editor = () => renderFormEditor({ elements: buttons });

export const reportOnly = () => renderForm({ elements: buttons, handlers, reportOnly: true });

export const readOnly = () => renderForm({ elements: buttons, handlers, readOnly: true });
