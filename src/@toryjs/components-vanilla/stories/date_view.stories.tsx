import { renderFormElement, create } from './common';
import { DateProps } from '../date_view';

export default {
  title: 'Vanilla/Date View'
};

const createControl = create<DateProps>('Date');

export const NormalDate = () =>
  renderFormElement({
    element: createControl(
      { value: '23/02/1980 11:16', format: 'dd/MM/yyyy hh:mm', local: true },
      { label: 'Normal' }
    )
  });

export const IsoDate = () =>
  renderFormElement({
    element: createControl(
      { value: '1996-10-15T00:05:32.000Z', format: 'dd/MMM/yyyy hh:mm' },
      { label: 'ISO' }
    )
  });

export const InvalidDate = () =>
  renderFormElement({
    element: createControl(
      { value: '23/02/1980 11:16', format: 'dd/MM/yyyy hh:mm', local: false },
      { label: 'Normal' }
    )
  });
