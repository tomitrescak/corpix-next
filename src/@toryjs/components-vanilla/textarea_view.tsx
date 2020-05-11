// import * as React from 'react';

// import { observer } from 'mobx-react';
// import { FormComponentProps } from '@toryjs/form';

// import { DynamicComponent, processControl, getValues } from '@toryjs/ui';
// import { ReactComponent } from './common';
// import { ReadonlyInput } from './control_text_view';

// const controlProps = ['placeholder', 'disabled'];

// type ComputeProps = { error?: string | null; value?: string };
// type Options = {
//   controlProps?: string[];
//   defaultProps?: any;
//   computeProps?: (props: ComputeProps) => any;
//   readOnlyControl?: React.ComponentType;
// };

// export function createTextAreaComponent(
//   component: ReactComponent,
//   options: Options = {
//     controlProps: controlProps
//   }
// ) {
//   const BaseTextAreaComponent: React.FC<FormComponentProps> = observer(props => {
//     const { source, readOnly, error, value, handleChange } = processControl(props);
//     const [disabled] = getValues(props, 'disabled');

//     const computedProps = options.computeProps ? options.computeProps({ error }) : null;

//     return (
//       <React.Fragment>
//         <DynamicComponent
//           {...props}
//           {...options.defaultProps}
//           {...computedProps}
//           control={readOnly ? options.readOnlyControl || ReadonlyInput : component}
//           controlProps={controlProps}
//           name={source}
//           disabled={readOnly || !source || disabled}
//           error={error}
//           value={value || ''}
//           onChange={handleChange}
//           showError={true}
//         />
//       </React.Fragment>
//     );
//   });
//   return BaseTextAreaComponent;
// }

// export const TextAreaView = createTextAreaComponent('textarea');
