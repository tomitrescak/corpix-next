import { createControl } from './link.test';
import { renderForm } from './common';

export default {
  title: 'Vanilla/Link'
};

const elements = [
  createControl({ url: '/target', text: 'Link to Localhost', target: '__empty' }),
  createControl({ url: 'mailto:me', text: 'Mail' })
];

export const view = () => renderForm({ elements });
