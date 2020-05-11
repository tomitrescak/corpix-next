// import React from 'react';

// import { EditorComponent, FormComponentProps } from '@toryjs/form';
// import { observer } from 'mobx-react';
// import { TextProps, MarkdownComponent } from './markdown_view';
// import { Context, getValue, DynamicComponent, propGroup, boundProp } from '@toryjs/ui';
// import { createIcon } from './common';

// const MarkdownEditorComponent: React.FC<FormComponentProps<TextProps>> = props => {
//   const context = React.useContext(Context);
//   if (!getValue(props, context)) {
//     return <DynamicComponent {...props}>[Markdown]</DynamicComponent>;
//   }
//   return <MarkdownComponent {...props} />;
// };

// export const MarkdownEditor: EditorComponent = {
//   Component: observer(MarkdownEditorComponent),
//   title: 'Markdown',
//   control: 'Markdown',
//   group: 'Form',
//   icon: createIcon('font', 'Markdown'),
//   props: propGroup('General', {
//     value: boundProp({
//       documentation: 'Markdown formatted text',
//       props: { label: 'Markdown', language: 'markdown', display: 'topLabel' },
//       control: 'Code'
//     })
//   })
// };
