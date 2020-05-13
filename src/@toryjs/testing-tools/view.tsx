import React from 'react';

import { FormElement, JSONSchema, buildProject, ToryFormContext } from '@toryjs/form';
import { ThemeProvider } from 'emotion-theming';
import { themes } from '@toryjs/editor/themes';
import { ToryForm } from '@toryjs/ui';

import { MemoryRouter } from 'react-router';

export type TestProperties = {
  element?: FormElement;
  elements?: FormElement[];
  schema?: JSONSchema;
  handlers?: Any;
  data?: Any;
  types?: Any[];
  componentCatalogue?: Any;
  editorCatalogue?: Any;
  readOnly?: boolean;
  reportOnly?: boolean;
  controls?: (owner: Any) => Any;
  context?: ToryFormContext;
};

export function createForm(elements: FormElement[]): FormElement {
  return {
    control: 'Form',
    uid: 'Form',
    componentProps: {},
    containerProps: {},
    elements: [
      {
        uid: 'Stack',
        control: 'Stack',
        componentProps: {
          layout: 'column',
          gap: '6px'
        },
        containerProps: {},
        elements
      }
    ]
  };
}

const TestFormRenderer = ({
  element,
  schema,
  readOnly,
  reportOnly,
  handlers,
  data,
  componentCatalogue,
  context,
  controls
}: TestProperties) => {
  schema = { type: 'object', properties: {}, ...schema };
  const formRef = React.useRef<HTMLDivElement>(null);
  const formModel = buildProject(element!, schema, data);

  return (
    // <SsrContext.Provider value={optionCache}>
    <MemoryRouter>
      <ThemeProvider theme={themes.light}>
        <div ref={formRef}>
          <ToryForm
            catalogue={componentCatalogue}
            form={element!}
            schema={schema}
            owner={formModel.dataset}
            handlers={handlers}
            readOnly={readOnly}
            reportOnly={reportOnly}
            context={context}
          />
          {controls && controls(formModel.dataset)}
        </div>
      </ThemeProvider>
    </MemoryRouter>
  );
};

TestFormRenderer.displayName = 'TestFormRenderer';

export function createFormRenderer(componentCatalogue: Any) {
  return function renderForm(testProps: TestProperties) {
    return renderFullForm({
      ...testProps,
      componentCatalogue,
      element: createForm(testProps.elements || [testProps.element!])
    });
  };
}

export function createFormElementRenderer(componentCatalogue: Any) {
  return function renderForm(testProps: TestProperties) {
    return renderFullForm({
      ...testProps,
      componentCatalogue: testProps.componentCatalogue || componentCatalogue
    });
  };
}

function renderFullForm(testProps: TestProperties) {
  testProps.schema = { type: 'object', ...testProps.schema };

  return <TestFormRenderer {...testProps} />;
}

renderFullForm.displayName = 'TestFullForm';
