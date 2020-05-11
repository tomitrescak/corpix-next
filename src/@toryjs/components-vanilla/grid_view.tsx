// import * as React from 'react';

// import { FormElement, FormComponentProps } from '@toryjs/form';

// import { DynamicComponent, getValue, getPropValue } from '@toryjs/ui';
// import { observer } from 'mobx-react';
// import { BoundProp } from '@toryjs/form';

// export type Props = {
//   EditorCell?: React.ComponentType<any>;
//   controls?: FormElement[];
// };

// export type GridProps = {
//   rows?: number;
//   rowsReadOnly?: BoundProp<number>;
//   templateRows?: BoundProp;
//   templateRowsReadOnly?: BoundProp;
//   columns?: number;
//   columnsReadOnly?: BoundProp<number>;
//   templateColumns?: BoundProp;
//   templateColumnsReadOnly?: BoundProp;
//   columnSize?: BoundProp;
//   rowSize?: BoundProp;
//   alignItems?: BoundProp;
//   justifyItems?: BoundProp;
//   gap?: BoundProp;
// };

// export type GridChildProps = {
//   gridWidth?: BoundProp<number>;
//   gridHeight?: BoundProp<number>;
//   row?: BoundProp<number>;
//   column?: BoundProp<number>;
//   justifySelf?: BoundProp;
//   alignSelf?: BoundProp;
// };

// export function sortGrid(props: FormComponentProps) {
//   return function (a: FormElement<GridChildProps>, b: FormElement<GridChildProps>) {
//     return getPropValue(props, a, context, 'row') < getPropValue(props, b, context, 'row')
//       ? -1
//       : getPropValue(props, a, context, 'row') > getPropValue(props, b, context, 'row')
//       ? 1
//       : getPropValue(props, a, context, 'column') < getPropValue(props, b, context, 'column')
//       ? -1
//       : 1;
//   };
// }

// export function createColumnStyles(
//   props: FormComponentProps,
//   formElement: FormElement<GridChildProps>
// ) {
//   return {
//     gridColumn: `${getPropValue(props, formElement, context, 'column')} / span ${getPropValue(
//       props,
//       formElement,
//       context,
//       'gridWidth',
//       1
//     )}`,
//     gridRow: `${getPropValue(props, formElement, context, 'row')} / span ${
//       getPropValue(props, formElement, context, 'gridHeight') || 1
//     }`,
//     justifySelf: getPropValue(props, formElement, context, 'justifySelf'),
//     alignSelf: getPropValue(props, formElement, context, 'alignSelf')
//   };
// }

// export function createGridStyles(
//   props: FormComponentProps<GridProps>,
//   context: ContextType,
//   readOnly: boolean
// ) {
//   let gridTemplateColumns = (readOnly && getValue(props, context, 'templateColumnsReadOnly')
//     ? getValue(props, context, 'templateColumnsReadOnly')
//     : getValue(props, context, 'templateColumns')
//     ? getValue(props, context, 'templateColumns')
//     : `repeat(${
//         readOnly && getValue(props, context, 'columnsReadOnly')
//           ? getValue(props, context, 'columnsReadOnly')
//           : getValue(props, context, 'columns', 1)
//       }, 1fr)`) as string;

//   let gridTemplateRows = (readOnly && getValue(props, context, 'templateRowsReadOnly')
//     ? getValue(props, context, 'templateRowsReadOnly')
//     : getValue(props, context, 'templateRows')
//     ? getValue(props, context, 'templateRows')
//     : `repeat(${
//         readOnly && getValue(props, context, 'rowsReadOnly')
//           ? getValue(props, context, 'rowsReadOnly')
//           : getValue(props, context, 'rows') || 1
//       }, auto)`) as string;

//   return {
//     display: 'grid',
//     position: 'relative',
//     gridTemplateColumns,
//     gridTemplateRows,
//     gridAutoColumns: getValue(props, context, 'columnSize') || '20px',
//     gridAutoRows: getValue(props, context, 'rowSize') || '20px',
//     alignItems: getValue(props, context, 'alignItems'),
//     justifyItems: getValue(props, context, 'justifyItems'),
//     gridGap: getValue(props, context, 'gap')
//   };
// }

// export const Grid: React.FC<FormComponentProps<GridProps, GridChildProps> & Props> = props => {
//   const controls: FormElement<GridChildProps>[] = props.formElement.elements || [];
//   const { EditorCell, className, ...rest } = props;
//   const context = React.useContext(Context);
//   return (
//     <DynamicComponent
//       {...rest}
//       className={className}
//       style={createGridStyles(props, context, !!props.readOnly)}
//     >
//       {(props.controls || controls).map((element, i) =>
//         EditorCell ? (
//           <EditorCell
//             {...rest}
//             id={props.formElement.uid}
//             key={i}
//             style={createColumnStyles(props, element, context)}
//             formElement={element}
//             parentFormElement={props.formElement}
//           >
//             {props.catalogue.createComponent(props, element, context)}
//           </EditorCell>
//         ) : (
//           <div key={i} style={createColumnStyles(props, element, context)}>
//             {props.catalogue.createComponent(props, element, context)}
//           </div>
//         )
//       )}
//     </DynamicComponent>
//   );
// };

// Grid.displayName = 'Grid';

// export const GridView = observer(Grid);
