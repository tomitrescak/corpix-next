// import * as React from 'react';

// import { observer } from 'mobx-react';
// import { DataSet, FormComponentProps, FormElement, BoundProp, ArraySet } from '@toryjs/form';

// import {
//   handle,
//   css,
//   valueSource,
//   handlerValue,
//   Context,
//   createComponents,
//   getValue,
//   DynamicComponent
// } from '@toryjs/ui';
// import { Button } from 'evergreen-ui';
// // import { i18n } from 'config/i18n';

// const noItems = css`
//   margin: 6px 0px 12px 0px;
// `;

// export const repeaterAddButton = css`
//   margin-top: 12px !important;
// `;

// type RowProps = FormComponentProps<RepeaterProps> & {
//   data: DataSet;
//   index: number;
//   selectedIndex: number;
//   select: (index: number) => void;
//   editorTemplate: FormElement | null;
//   viewTemplate: FormElement | null;
// };

// class RepeaterRow extends React.PureComponent<RowProps> {
//   static contextType = Context;

//   handlers = {
//     ...this.props.handlers,
//     deleteRow: () => {
//       const arrayOwner = getValue(this.props, this.context) as ArraySet;

//       if (handlerValue(this.props.formElement.props.value)) {
//         handle(
//           this.props.handlers,
//           this.props.formElement.props.onDelete,
//           this.props.owner,
//           this.props,
//           this.context,
//           this.props.data
//         );
//       } else {
//         arrayOwner.removeRow(this.props.data);
//       }
//     },
//     editRow: () => {
//       this.props.select(this.props.index);
//     }
//   };
//   render() {
//     let template =
//       this.props.index === this.props.selectedIndex
//         ? this.props.editorTemplate
//         : this.props.viewTemplate;

//     if (!template) {
//       throw new Error('Template does not exist!');
//     }

//     // we only make clickable props if the view template differs from edit template
//     return createComponents(
//       {
//         catalogue: this.props.catalogue,
//         className: this.props.className,
//         dataProps: this.props.dataProps,
//         extra: this.props.extra,
//         formElement: template,
//         readOnly: this.props.readOnly,
//         uid: this.props.uid,
//         owner: this.props.data,
//         handlers: this.handlers
//       }
//       // template,
//       // this.context
//       // '',
//       // this.props.extra
//     );
//   }
// }

// RepeaterRow.displayName = 'RepeaterRow';

// export type RepeaterProps = {
//   allowEdit: boolean;
//   allowAdd: boolean;
//   value: BoundProp;
//   onDelete: string;
//   onAdd: string;
// };

// export type State = {
//   selectedIndex: number;
// };

// class RepeaterComponent extends React.Component<FormComponentProps<RepeaterProps>, State> {
//   static contextType = Context;

//   state = { selectedIndex: -1 };

//   addRow() {
//     const arrayOwner = getValue(this.props, this.context) as ArraySet;
//     arrayOwner.addDefaultRow();
//   }

//   render(): JSX.Element {
//     const { formElement, owner } = this.props;
//     const { allowAdd } = formElement.props;
//     const boundSource = valueSource(formElement);
//     const listOwner: ArraySet = getValue(this.props, this.context);
//     const list = listOwner ? listOwner.items : [];
//     let viewTemplate =
//       formElement.elements && formElement.elements.length > 0 ? formElement.elements[0] : null;
//     let editorTemplate =
//       formElement.elements && formElement.elements.length > 1 ? formElement.elements[1] : null;

//     if (!boundSource) {
//       return <div>Please bind the repeater to an array source</div>;
//     }

//     return (
//       <DynamicComponent {...this.props}>
//         {list == null || list.length === 0 ? (
//           <div className={noItems}>{`This collection contains no items ...`}</div>
//         ) : (
//           list.map((listItemDataSet: DataSet, i) => (
//             <RepeaterRow
//               index={i}
//               key={i + Date.now()}
//               owner={owner}
//               formElement={formElement}
//               data={listItemDataSet}
//               extra={this.props.extra}
//               handlers={this.props.handlers}
//               readOnly={this.props.readOnly}
//               catalogue={this.props.catalogue}
//               editorTemplate={editorTemplate}
//               viewTemplate={viewTemplate || editorTemplate}
//               selectedIndex={this.state.selectedIndex}
//               select={index => this.setState({ selectedIndex: index })}
//             />
//           ))
//         )}
//         {allowAdd && !this.props.readOnly && <Button onClick={this.addRow}>{`Add Record`}</Button>}
//         {/* <ErrorView owner={owner} source={boundSource} pointing="left" /> */}
//       </DynamicComponent>
//     );
//   }
// }

// RepeaterComponent.displayName = 'RepeaterComponent';

// export const RepeaterView = observer(RepeaterComponent);
