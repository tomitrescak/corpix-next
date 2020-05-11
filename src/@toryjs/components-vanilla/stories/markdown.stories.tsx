import { schemaFromData, create, renderFormElement } from './common';
import { MarkdownProps } from '../markdown_view';

export default {
  title: 'Vanilla/Markdown'
};

const createControl = create<MarkdownProps>('Markdown');

const data = {
  name: 'Tomas'
};

const schema = schemaFromData(data);

export const View = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createControl({ value: 'My *name* is **${name}**' }, { label: 'Name' }),
    schema,
    data
  });

export const Empty = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createControl({ value: undefined }, { label: 'Name' }),
    schema,
    data
  });
