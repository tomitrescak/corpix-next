import { createControl, createText } from './link_selector.test';
import { renderForm, schemaFromData } from './common';

export default {
  title: 'Vanilla/Selector'
};

const data = { 
  fromName: 'Tomas Trescak',
  toName:  'To Data' 
};
const schema = schemaFromData(data);

const elements = [
  createControl({ text: 'Name', source: { source: 'fromName' }, target: 'toName' }),
  createText({ value: { source: 'toName' } })
];

export const view = () => renderForm({ elements, schema, data });
