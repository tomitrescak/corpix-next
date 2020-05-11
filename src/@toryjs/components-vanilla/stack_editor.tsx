// import React from 'react';
// import { EditorComponent, FormComponentProps } from '@toryjs/form';

// import {
//   propGroup,
//   prop,
//   gapProp,
//   DropComponentEditor,
//   createEditorContainer,
//   stylingProps
// } from '@toryjs/ui';
// import { StackView, StackProps } from './stack_view';
// import { createIcon } from './common';

// const StackEditorComponent: React.FC<FormComponentProps<StackProps>> = props => (
//   <DropComponentEditor {...props} Component={StackView} layout={props.formElement.props.layout} />
// );

// StackEditorComponent.displayName = 'StackEditor';

// const StackEditorWrapper = createEditorContainer(StackEditorComponent);
// StackEditorWrapper.displayName = 'StackEditorWrapper';

// export const StackEditor: EditorComponent = {
//   Component: StackEditorWrapper,
//   control: 'Stack',
//   icon: createIcon('align-center', 'Stack'),
//   title: 'Stack Layout',
//   group: 'Layout',
//   defaultProps: {
//     layout: 'column'
//   },
//   props: {
//     ...propGroup('Stack', {
//       layout: prop({
//         documentation: 'Items can either be stacked in rows or columns',
//         label: 'Layout',
//         control: 'Select',
//         type: 'string',
//         props: {
//           options: [
//             { text: 'Rows', value: 'row' },
//             { text: 'Columns', value: 'column' }
//           ]
//         }
//       }),
//       final: prop({
//         type: 'boolean',
//         documentation:
//           'Prohibits adding new elements to the stack. This is used mostly in editor for visual appeal.'
//       }),
//       gap: gapProp({
//         documentation: 'Spacing between cells'
//       }),
//       padding: gapProp({
//         documentation: 'Cell padding',
//         label: 'Padding'
//       })
//     }),
//     ...propGroup('Styling', {
//       ...stylingProps,
//       fontSize: prop(),
//       fontFamily: prop(),
//       type: prop({
//         control: 'Select',
//         props: {
//           options: [
//             { text: 'Heading 1', value: 'h1' },
//             { text: 'Heading 2', value: 'h2' },
//             { text: 'Heading 3', value: 'h3' },
//             { text: 'Heading 4', value: 'h4' },
//             { text: 'Heading 5', value: 'h5' },
//             { text: 'Body', value: 'span' }
//           ]
//         }
//       })
//     })
//   }
// };
