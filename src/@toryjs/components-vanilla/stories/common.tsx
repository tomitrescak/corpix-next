import { render } from '@testing-library/react';

import { catalogue as componentCatalogue } from '../catalogue';
import { catalogueEditor as editorCatalogue } from '../catalogue_editor';

import {
  createEditorComponentsRenderer,
  createFormEditorRenderer,
  createFormElementEditorRenderer
} from '@toryjs/testing-tools/editor';

import {
  createFormElementRenderer,
  createFormRenderer,
  TestProperties
} from '@toryjs/testing-tools/view';
import { FormElement } from '@toryjs/form';
import { ContainerProps, CommonComponentProps } from '@toryjs/form/form_definition';
import { JSONSchema } from '@toryjs/form/json_schema';

export function create<P>(control: string) {
  return function (
    componentProps: Partial<P & CommonComponentProps & { css: string }> = {},
    containerProps: Partial<ContainerProps> = {},
    elements?: FormElement[],
    uid = '1'
  ): FormElement<P> {
    return {
      uid,
      control,
      componentProps: componentProps as Any,
      containerProps: containerProps as Any,
      elements
    };
  };
}

export function createText(text: string, label?: string) {
  return {
    uid: 'Text' + text + label,
    control: 'Text',
    componentProps: { value: text },
    containerProps: { label }
  };
}

export function debug(root: Any) {
  root.debug(undefined, undefined, { highlight: false });
}

export { fireEvent } from '@testing-library/react';

export { createForm } from '@toryjs/testing-tools/view';

export const renderEditorComponents = createEditorComponentsRenderer(
  componentCatalogue,
  editorCatalogue
);
export const renderFormEditor = createFormEditorRenderer(componentCatalogue, editorCatalogue);
export const renderFormElementEditor = createFormElementEditorRenderer(
  componentCatalogue,
  editorCatalogue
);

export const renderForm = createFormRenderer(componentCatalogue);
export const renderFormElement = createFormElementRenderer(componentCatalogue);

export function testElement(options: TestProperties) {
  const result = render(renderFormElement(options));
  const original = result.debug;
  result.debug = (a, b, c) => original(a, b, { highlight: false, ...c });
  return result;
}

export function testForm(options: TestProperties) {
  const result = render(renderForm(options));
  const original = result.debug;
  result.debug = (a, b, c) => original(a, b, { highlight: false, ...c });
  return result;
}

export function testRender(element: Any) {
  const result = render(element);
  const original = result.debug;
  result.debug = (a, b, c) => original(a, b, { highlight: false, ...c });
  return result;
}

export function schemaFromData(data: Any): JSONSchema {
  const schema: JSONSchema = { type: 'object', properties: {} };
  for (let key of Object.keys(data)) {
    if (typeof data[key] == 'string') {
      schema.properties![key] = { type: 'string' };
    } else if (typeof data[key] == 'number') {
      schema.properties![key] = { type: 'number' };
    } else if (typeof data[key] == 'boolean') {
      schema.properties![key] = { type: 'boolean' };
    } else if (Array.isArray(data[key])) {
      schema.properties![key] = { type: 'array', items: { type: 'string' } };
    }
  }
  return schema;
}

export function dataSchemaFromData(data: Any) {
  return {
    data,
    schema: schemaFromData(data)
  };
}

export function mockFetchResolve(data: Any, func: Function) {
  const g: Any = window;
  g.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve(data)
    });
  return func();
}

export function mockFetchReject(error: Any, func: Function) {
  const g: Any = window;
  g.fetch = () => Promise.reject(error);
  return func();
}
