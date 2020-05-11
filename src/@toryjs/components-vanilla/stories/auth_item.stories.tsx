import React from 'react';

import { Hello } from 'components/hello';

import { renderForm, renderFormEditor, create, createText } from './common';
import { AuthItemProps } from '../auth_item_view';
import { ToryFormContext } from '@toryjs/form';

export default {
  title: 'Vanilla/Auth Item'
};

const createElement = create<AuthItemProps>('AuthItem');

const elements = [
  createElement({ roles: ['Admin'] }, {}, [createText('Admin Invisible')]),
  createElement({ roles: ['User'] }, {}, [createText('User Visible')])
];

const context: ToryFormContext = {
  authorisation: { user: { id: '1', roles: ['User'] } }
};

export const view = () => renderForm({ elements, context });

export const editor = () => renderFormEditor({ elements });
