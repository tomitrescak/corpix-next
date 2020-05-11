import { renderFormElement } from './common';

import { create } from './common';
import { HtmlFormProps } from '../html_form_view';

export default {
  title: 'Vanilla/Html Form'
};

const createControl = create<HtmlFormProps>('HtmlForm');

const handlers = {
  logMessage({ args }: Any) {
    args.e.preventDefault();
    console.log('Submitted');
  }
};

export const Default = () =>
  renderFormElement({
    element: createControl({ onSubmit: 'logMessage' }, { label: 'Form' }, [
      {
        uid: 'button',
        control: 'Button',
        componentProps: { type: 'submit', text: 'Submit' },
        containerProps: {}
      }
    ]),
    handlers
  });
