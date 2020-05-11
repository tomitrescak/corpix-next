import { schemaFromData, create, renderFormElement } from './common';
import { MaskedProps } from '../masked_view';

export default {
  title: 'Vanilla/Masked'
};

const createControl = create<MaskedProps>('MaskedInput');

const data = {
  zip: '',
  zipDone: '123-456'
};

const schema = schemaFromData(data);

export const Empty = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createControl({ mask: '999-999', value: { source: 'zip' } }, { label: 'Zip' }),
    schema,
    data
  });

export const Filled = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createControl({ mask: '999-999', value: { source: 'zipDone' } }, { label: 'Zip' }),
    schema,
    data
  });

export const Readonly = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createControl({ mask: '999-999', value: { source: 'zipDone' } }, { label: 'Zip' }),
    schema,
    data,
    readOnly: true
  });

export const Report = () =>
  renderFormElement({
    // eslint-disable-next-line no-template-curly-in-string
    element: createControl({ mask: '999-999', value: { source: 'zipDone' } }, { label: 'Zip' }),
    schema,
    data,
    reportOnly: true
  });
