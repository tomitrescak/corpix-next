// import React from 'react';
// import { EditorComponent, FormComponentProps } from '@toryjs/form';
// import { prop, propGroup, createComponents } from '@toryjs/ui';
// import { AuthItem, AuthItemProps } from './auth_item_view';
// import { observer } from 'mobx-react';
// import { createIcon } from './common';

// export const AuthItemEditorComponent: React.FC<FormComponentProps<
//   AuthItemProps
// >> = observer(props =>
//   props.formElement.containerProps.disable ? (
//     <>{createComponents(props)}</>
//   ) : (
//     <AuthItem {...props} />
//   )
// );

// AuthItemEditorComponent.displayName = 'ApolloProviderEditor';

// export const AuthItemEditor: EditorComponent = {
//   provider: true,
//   Component: AuthItemEditorComponent,
//   title: 'Auth Item',
//   control: 'AuthItem',
//   icon: createIcon('lock', 'AuthItem'),
//   group: 'Web',
//   props: {
//     ...propGroup('Auth', {
//       disable: {
//         control: {
//           documentation:
//             'This is useful during testing when a mocked provider can be used instead.',
//           props: { label: 'Disable' },
//           group: 'Auth',
//           control: 'Checkbox'
//         },
//         schema: { type: 'boolean' }
//       }
//     }),
//     roles: prop({
//       control: 'Table',
//       display: 'group',
//       props: { text: 'Roles' },
//       type: 'array',
//       elements: [
//         {
//           control: 'Input',
//           props: {}
//         }
//       ],
//       items: { type: 'string' }
//     })
//   }
// };
