// import * as React from 'react';

// import { FormComponentProps, EditorComponent } from '@toryjs/form';

// import { observer } from 'mobx-react';
// import { GridChildProps, GridProps, GridView } from './grid_view';
// import {
//   DropCellProps,
//   DropCell,
//   propGroup,
//   Context,
//   DynamicComponent,
//   ContextType,
//   prop,
//   stylingProps
// } from '@toryjs/ui';

// import { LayoutProps, generateEmptyCells, adjustPosition } from './helpers/grid';
// import { showHandles, timeHideHandles } from './helpers/drag_drop_boundary';
// import { createIcon } from './common';

// function drop(_e: React.DragEvent, props: DropCellProps, context: ContextType): boolean {
//   dragLeave(_e, props);

//   const item = context.editor.dragItem;
//   if (item == null) {
//     return false;
//   }

//   // make visible again
//   if (item && item.node) {
//     item.node.style.display = 'flex';
//     item.node.style.visibility = 'visible';
//     item.node.style.height = '';
//   }

//   context.editor.dragItem = undefined;

//   let sourceElement = item.element!;
//   let targetElement = props.formElement;

//   // OPTION 1: We are dropping on the existing element
//   if (targetElement && targetElement.control !== 'EditorCell') {
//     return false;
//   }

//   // OPTION 2: We are dropping existing element on empty cell
//   else if (sourceElement) {
//     const column = adjustPosition(
//       props,
//       context,
//       item.position!,
//       sourceElement,
//       props.formElement,
//       props.parentFormElement
//       // false
//     );
//     // const column = props.formElement.props.column;
//     if (column === -1) {
//       return false;
//     }
//     sourceElement.props.setValue('row', props.formElement.props.row);
//     sourceElement.props.setValue('column', column);
//     // we can grab by left part or right part
//   }
//   // OPTION 3: We are dropping new item on empty cell
//   else if (props.parentFormElement) {
//     let width = 1;
//     props.parentFormElement.addElement({
//       props: {
//         ...item.props,
//         label: item.label || '',
//         value:
//           item.source || item.schema
//             ? { source: item.source, sourceId: item.schema ? item.schema.uid : undefined }
//             : undefined,
//         control: item.control || item.name,
//         row: props.formElement.props.row,
//         column: props.formElement.props.column,
//         gridWidth: width
//       },
//       control: item.control || item.name!,
//       elements: item.defaultChildren
//     });
//     sourceElement = props.parentFormElement.elements[props.parentFormElement.elements.length - 1];
//   }
//   return false;
// }

// const hovers: {
//   [index: string]: {
//     current: any;
//     elements: HTMLDivElement[];
//   };
// } = {};

// function dragOver(e: React.DragEvent, props: any, context: ContextType) {
//   const config = hovers[props.id];
//   if (config.current === e.currentTarget) {
//     return;
//   }

//   // clear previous
//   for (let hover of config.elements) {
//     hover.style.background = '';
//   }
//   config.elements = [];
//   config.current = e.currentTarget;

//   // find all elements
//   const dragItem = context.editor.dragItem;
//   if (!dragItem) {
//     return;
//   }
//   const width = dragItem.element ? dragItem.element.props.gridWidth : 1;
//   const startColumn =
//     dragItem.position === 'left' || dragItem.position == null
//       ? props.formElement.props.column
//       : props.formElement.props.column - width + 1;

//   for (let i = 0; i < width; i++) {
//     const position = `div[data-position="${props.id}-${props.formElement.props.row}-${startColumn +
//       i}"]`;
//     const element: HTMLDivElement | null = document.querySelector(position);

//     if (element) {
//       config.elements.push(element);
//       element.style.background = '#999';
//     }
//   }
// }

// function dragLeave(_e: any, props: any) {
//   const config = hovers[props.id];
//   for (let hover of config.elements) {
//     hover.style.background = '';
//   }
//   config.elements = [];
// }

// const EditorCell = (props: DropCellProps) => {
//   const config = hovers[props.id];

//   if (!config) {
//     hovers[props.id] = { elements: [], current: null };
//   }
//   // create hover function

//   return (
//     <DropCell
//       {...props}
//       drop={drop}
//       position={`${props.id}-${props.formElement.props.row}-${props.formElement.props.column}`}
//       // hover={hover}
//       mouseOver={showHandles}
//       mouseOut={timeHideHandles}
//       hover={dragOver}
//       dragLeave={dragLeave}
//     />
//   );
// };

// EditorCell.displayName = 'EditorCell';

// export const GridEditorComponent: React.FC<FormComponentProps<GridProps, GridChildProps> &
//   LayoutProps> = props => {
//   const context = React.useContext(Context);
//   const controls = generateEmptyCells(context, props, props.formElement, 'EditorCell');

//   // we replace the form element with the new one
//   return (
//     <DynamicComponent {...props}>
//       <GridView {...props} EditorCell={EditorCell} controls={controls} />
//     </DynamicComponent>
//   );
// };

// GridEditorComponent.displayName = 'GridEditorComponent';

// export const GridEditor: EditorComponent = {
//   Component: observer(GridEditorComponent),
//   control: 'Grid',
//   icon: createIcon('grid-view', 'Grid'),
//   title: 'Grid',
//   group: 'Layout',
//   defaultProps: {
//     rows: 1,
//     columns: 1,
//     gap: '6px'
//   },
//   childProps: propGroup('Grid Layout', {
//     row: prop({
//       documentation: 'Row of the grid (1 ..)',
//       props: { inputLabel: 'row' },
//       tuple: 'Position',
//       type: 'number'
//     }),
//     column: prop({
//       documentation: 'Column of the grid (1 ..)',
//       props: { inputLabel: 'col' },
//       tuple: 'Position',
//       type: 'number'
//     }),
//     gridWidth: prop({
//       documentation: 'Width of the control in number of grid cells.',
//       tuple: 'Dimension',
//       props: { inputLabel: 'w' },
//       type: 'number'
//     }),
//     gridHeight: prop({
//       documentation: 'Height of the control in number of grid cells.',
//       tuple: 'Dimension',
//       props: { inputLabel: 'h' },
//       type: 'number'
//     }),
//     alignSelf: prop({
//       control: 'Select',
//       documentation: `Aligns item vertically.<br>
//         <ul>
//         <li><i>Start (default)</i>: item is packed toward the top</li>
//         <li><i>End:</i> item is packed toward the bottom</li>
//         <li><i>Center</i>: item is centered</li>
//         <li><i>Stretch</i>: item fills the whole height of the cell/li>
//         </ul>
//         Information taken from <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">this guide</a> for more details`,
//       group: 'Basic',
//       type: 'string',
//       props: {
//         options: [
//           { text: 'Start', value: 'flex-start' },
//           { text: 'End', value: 'flex-end' },
//           { text: 'Center', value: 'center' },
//           { text: 'Stretch', value: 'stretch' }
//         ]
//       }
//     }),
//     justifySelf: prop({
//       control: 'Select',
//       documentation: `Aligns a grid item inside a cell along the inline (row) axis (as opposed to align-self which aligns along the block (column) axis). This value applies to a grid item inside a single cell.<br>
//         <ul>
//         <li><i>Start (default)</i>: aligns the grid item to be flush with the start edge of the cell</li>
//         <li><i>End:</i> aligns the grid item to be flush with the end edge of the cell</li>
//         <li><i>Center</i>: aligns the grid item in the center of the cell</li>
//         <li><i>Stretch</i>: fills the whole width of the cell (this is the default)/li>
//         </ul>
//         Information taken from <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">this guide</a> for more details`,
//       group: 'Basic',
//       type: 'string',
//       props: {
//         options: [
//           { text: 'Start', value: 'flex-start' },
//           { text: 'End', value: 'flex-end' },
//           { text: 'Center', value: 'center' },
//           { text: 'Stretch', value: 'stretch' }
//         ]
//       }
//     })
//   }),
//   props: {
//     ...propGroup('Grid', {
//       alignItems: prop({
//         control: 'Select',
//         documentation: `Aligns grid items vertically.<br>
//           <ul>
//           <li><i>Start (default)</i>: items are packed toward the top</li>
//           <li><i>End:</i> items are packed toward the bottom</li>
//           <li><i>Center</i>: items are centered</li>
//           <li><i>Stretch</i>: items fill the whole height of the cell/li>
//           </ul>
//           Information taken from <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">this guide</a> for more details`,
//         group: 'Basic',
//         type: 'string',
//         props: {
//           options: [
//             { text: 'Start', value: 'flex-start' },
//             { text: 'End', value: 'flex-end' },
//             { text: 'Center', value: 'center' },
//             { text: 'Stretch', value: 'stretch' }
//           ]
//         }
//       }),
//       gap: prop({
//         control: 'Select',
//         documentation: 'Spacing between cells',
//         group: 'Basic',
//         props: {
//           options: [
//             {
//               text: 'None',
//               value: '0px'
//             },
//             {
//               text: 'Tiny',
//               value: '3px'
//             },
//             {
//               text: 'Small',
//               value: '6px'
//             },
//             {
//               text: 'Normal',
//               value: '12px'
//             },
//             {
//               text: 'Big',
//               value: '18px'
//             },
//             {
//               text: 'Huge',
//               value: '24px'
//             }
//           ]
//         },
//         type: 'string'
//       }),
//       justifyItems: prop({
//         control: 'Select',
//         documentation: `Aligns grid items horizontally.<br>
//           <ul>
//           <li><i>Start (default)</i>: items are packed toward the start line</li>
//           <li><i>End:</i> items are packed toward the end line</li>
//           <li><i>Center</i>: items are centered along the line</li>
//           <li><i>Stretch</i>: items fill the whole width of the cell/li>
//           </ul>
//           Information taken from <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">this guide</a> for more details`,
//         group: 'Basic',
//         type: 'string',
//         props: {
//           label: 'Justify Content',
//           options: [
//             { text: 'Start', value: 'flex-start' },
//             { text: 'End', value: 'flex-end' },
//             { text: 'Center', value: 'center' },
//             { text: 'Stretch', value: 'stretch' }
//           ]
//         }
//       }),
//       rows: prop({
//         documentation: 'Number of grid rows',
//         group: 'Dimensions',
//         props: {
//           inputLabel: 'rows'
//         },
//         tuple: 'Size',
//         type: 'number'
//       }),
//       columns: prop({
//         documentation: 'Number of grid columns',
//         group: 'Dimensions',
//         props: {
//           inputLabel: 'cols'
//         },
//         tuple: 'Size',
//         type: 'number'
//       }),
//       rowSize: prop({
//         documentation: 'Default height of extra rows (e.g. 100px)',
//         group: 'Dimensions',
//         props: {
//           inputLabel: 'rows'
//         },
//         tuple: 'Width',
//         type: 'number'
//       }),
//       columnSize: prop({
//         documentation: 'Default width of extra columns (e.g. 100px)',
//         group: 'Dimensions',
//         props: {
//           inputLabel: 'cols'
//         },
//         tuple: 'Width',
//         type: 'number'
//       }),
//       templateRows: prop({
//         documentation: `Row Template. For example:
//         <pre>10px auto 1fr</pre> will define a grid with three rows.
//         First row will be 10px high. Second row will automatically adjust its height.
//         And third column will fill the visible height.`,
//         group: 'Templates',
//         props: { label: 'Template Rows' },
//         type: 'number'
//       }),
//       templateColumns: prop({
//         documentation: `Column template. For example:
//         <pre>10px auto 1fr</pre> will define a grid with three columns.
//         First columns will be 10px wide. Second column will automatically adjust its size.
//         And third column will fill the visible width.`,
//         group: 'Templates',
//         props: { label: 'Template Column' },
//         type: 'number'
//       })
//     }),
//     ...propGroup('Read-Only Grid', {
//       rowsReadOnly: prop({
//         documentation: 'Number of grid rows in read only mode',
//         group: 'Read-Only',
//         props: {
//           inputLabel: 'rows'
//         },
//         tuple: 'Size',
//         type: 'number'
//       }),
//       columnsReadOnly: prop({
//         documentation: 'Number of grid columns in read only mode',
//         group: 'Read-Only',
//         props: {
//           inputLabel: 'cols'
//         },
//         tuple: 'Size',
//         type: 'number'
//       }),
//       templateRowsReadOnly: prop({
//         documentation: 'Row template for read only mode (e.g. 10px auto 1fr)',
//         group: 'Read-Only',
//         props: { label: 'Row Template' },
//         type: 'number'
//       }),
//       templateColumnsReadOnly: prop({
//         documentation: 'Column template for read only mode (e.g. 10px auto 1fr)',
//         group: 'Read-Only',
//         props: { label: 'Column Template' },
//         type: 'number'
//       })
//     }),
//     ...stylingProps
//   }
// };
