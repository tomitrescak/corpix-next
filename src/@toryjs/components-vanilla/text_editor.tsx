// import * as React from 'react';

// import { ImageProps, Link, TextView, TextProps, ImageView, LinkSelectorView } from './text_view';
// import { FormComponentProps, EditorComponent } from '@toryjs/form';
// import { observer } from 'mobx-react';
// import {
//   propGroup,
//   prop,
//   boundProp,
//   getValue,
//   Context,
//   DynamicComponent,
//   stylingProps,
//   fontProps
// } from '@toryjs/ui';
// import { createIcon } from './common';

// /* =========================================================
//     Text
//    ======================================================== */

// const TextEditorComponent: React.FC<FormComponentProps<TextProps>> = props => {
//   const context = React.useContext(Context);
//   if (!getValue(props, context)) {
//     return <DynamicComponent {...props}>[Text]</DynamicComponent>;
//   }
//   return <TextView {...props} />;
// };

// export const TextEditor: EditorComponent = {
//   Component: observer(TextEditorComponent),
//   title: 'Text',
//   control: 'Text',
//   group: 'Form',
//   icon: createIcon('font', 'Text'),
//   props: {
//     ...propGroup('Text', {
//       value: boundProp({
//         documentation: 'Text to display',
//         props: { display: 'group', label: 'Value', editorLabel: 'Text' },
//         control: 'Textarea'
//       })
//     }),
//     ...propGroup('Styling', {
//       ...fontProps,
//       ...stylingProps
//     })
//   }
// };

// export const RichTextEditor: EditorComponent = {
//   Component: observer(TextEditorComponent),
//   title: 'Rich Text',
//   control: 'RichText',
//   group: 'Form',
//   icon: createIcon('font', 'Text'),
//   props: {
//     ...propGroup('Text', {
//       value: boundProp({
//         documentation: 'Text to display',
//         props: { display: 'group', label: 'Rich Text', editorLabel: 'Text' },
//         control: 'Rtf'
//       })
//     }),
//     ...propGroup('Styling', {
//       ...fontProps,
//       ...stylingProps
//     })
//   }
// };

// /* =========================================================
//     IMAGE
//    ======================================================== */

// const ImageEditorComponent = (props: FormComponentProps<ImageProps>) => {
//   let context = React.useContext(Context);
//   let src = getValue(props, context, 'src');
//   if (!src) {
//     return <DynamicComponent {...props}>[Image]</DynamicComponent>;
//   }
//   return <ImageView {...props} />;
// };

// ImageEditorComponent.displayName = 'ImageEditor';

// export const ImageEditor: EditorComponent = {
//   Component: observer(ImageEditorComponent),
//   title: 'Image',
//   control: 'Image',
//   group: 'Form',
//   icon: createIcon('media', 'Image'),
//   props: propGroup('Image', {
//     alt: boundProp({
//       props: { label: 'Alternative Text' }
//     }),
//     src: boundProp(),
//     imageWidth: boundProp(),
//     imageHeight: boundProp()
//   })
// };

// /* =========================================================
//     Link
//    ======================================================== */

// export const LinkEditor: EditorComponent = {
//   Component: observer(Link),
//   title: 'Link',
//   control: 'Link',
//   group: 'Form',
//   icon: createIcon('link', 'Link'),
//   props: propGroup('Link', {
//     url: prop({
//       documentation:
//         // eslint-disable-next-line no-template-curly-in-string
//         'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.'
//     }),
//     text: prop({
//       documentation:
//         // eslint-disable-next-line no-template-curly-in-string
//         'You can interpolate values using "${}" notation. For example "This is my ${name}", where <i>name</i> is a value from the dataset.'
//     }),
//     target: prop({
//       control: 'Select',
//       props: {
//         options: [
//           { text: 'None', value: '' },
//           {
//             text: 'New Window',
//             value: '__blank'
//           },
//           {
//             text: 'Current Page',
//             value: '_self'
//           }
//         ]
//       }
//     })
//   })
// };

// /* =========================================================
//     Link Selector
//    ======================================================== */

// export const LinkSelectorEditor: EditorComponent = {
//   Component: LinkSelectorView,
//   title: 'Selector',
//   control: 'LinkSelector',
//   icon: createIcon('selection', 'Selector'),
//   props: {
//     ...propGroup('Selector', {
//       text: boundProp({ control: 'Textarea', documentation: 'Text of the link' }),
//       source: boundProp({
//         documentation: 'This value is stored to the target.'
//       }),
//       target: boundProp({
//         documentation: 'Dataset path to store the value'
//       })
//     })
//   }
// };
