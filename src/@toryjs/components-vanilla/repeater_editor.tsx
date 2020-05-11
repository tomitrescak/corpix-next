// import * as React from 'react';

// import { FormComponentProps, EditorComponent } from '@toryjs/form';
// import { RepeaterView, RepeaterProps } from './repeater_view';
// import { observer } from 'mobx-react';
// import {
//   prop,
//   propGroup,
//   boundProp,
//   DynamicComponent,
//   TemplateEditor,
//   createEditorContainer
// } from '@toryjs/ui';
// import { createIcon } from './common';

// const templates = [
//   { text: 'Component View', value: 'component' },
//   { text: 'View Template', value: 'view' },
//   { text: 'Edit Template', value: 'edit' }
// ];
// const RepeaterComponent = (props: FormComponentProps<RepeaterProps>) => {
//   return (
//     <DynamicComponent {...props}>
//       <TemplateEditor {...props} extra={props.extra} Component={RepeaterView} options={templates} />
//     </DynamicComponent>
//   );
// };

// RepeaterComponent.displayName = 'RepeaterComponent';

// const RepeaterEditorWrapper = observer(RepeaterComponent);
// RepeaterEditorWrapper.displayName = 'RepeaterEditor';

// const RepeaterEditorView = createEditorContainer(RepeaterEditorWrapper);

// export const RepeaterEditor: EditorComponent = {
//   Component: RepeaterEditorView,
//   title: 'Repeater',
//   control: 'Repeater',
//   group: 'Layout',
//   icon: createIcon('form', 'Repeater'),
//   bound: true,
//   valueProvider: 'value',
//   props: propGroup('Repeater', {
//     allowAdd: prop({ type: 'boolean' }),
//     allowEdit: prop({ type: 'boolean' }),
//     value: boundProp(),
//     template: prop({
//       control: 'Select',
//       default: 'component',
//       props: {
//         options: templates
//       }
//     })
//   }),
//   defaultChildren: [
//     { control: 'Container', elements: [], props: { editorLabel: 'View Template' } },
//     { control: 'Container', elements: [], props: { editorLabel: 'Edit Template' } }
//   ]
//   // handlers: {
//   //   onAdd: {}
//   // }
// };
