import React from 'react';

// import { docsGroup, TestComponent } from '@toryjs/editor';
import { createForm, TestProperties } from './view';

export function createEditorComponentsRenderer(componentCatalogue: Any, editorCatalogue: Any) {
  function renderTestEditor(props: TestProperties) {
    // return (
    //   <TestComponent
    //     catalogue={componentCatalogue}
    //     catalogueEditor={editorCatalogue}
    //     form={createForm(props.elements || [props.element!])}
    //     schema={props.schema}
    //     showEditor={true}
    //     handlers={props.handlers}
    //     data={props.data}
    //   />
    // );
    return <div>Implement Editor Renderer</div>;
  }
  renderTestEditor.displayName = 'TestEditor';
  return renderTestEditor;
}

/**
 * Used to create an editor from passed form element
 * @param componentCatalogue
 * @param editorCatalogue
 */
export function createFormElementEditorRenderer(componentCatalogue: Any, editorCatalogue: Any) {
  return function renderEditor(props: TestProperties) {
    return renderFullEditor({ ...props, componentCatalogue, editorCatalogue });
  };
}

/**
 * Used to create an editor generating a full form for the passed components
 * @param componentCatalogue
 * @param editorCatalogue
 */
export function createFormEditorRenderer(componentCatalogue: Any, editorCatalogue: Any) {
  return function renderEditor(props: TestProperties) {
    return renderFullEditor({
      ...props,
      componentCatalogue,
      editorCatalogue,
      element: createForm(props.elements || [props.element!])
    });
  };
}

function renderFullEditor(props: TestProperties) {
  // const Editor = docsGroup({
  //   catalogue: props.componentCatalogue,
  //   editorCatalogue: props.editorCatalogue,
  //   handlers: props.handlers,
  //   form: props.element!,
  //   schema: props.schema,
  //   hideViews: [],
  //   height: '100%',
  //   style: 'height: 100%',
  //   data: props.data,
  //   // theme: 'light',
  //   types: props.types
  // });

  // return <Editor form={props.element!} schema={props.schema} data={props.data} />;
  return <div>Implement Full editor</div>;
}

renderFullEditor.displayName = 'TestEditor';
