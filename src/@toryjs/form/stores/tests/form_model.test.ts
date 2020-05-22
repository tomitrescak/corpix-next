import { JSONSchema } from '../../json_schema';
import { FormElement } from '../../form_definition';
import { buildEditorProject } from '../editor_project_model';
import { buildProject } from '../project_model';

const elementSchema = (props: Any = {}): JSONSchema => ({
  type: 'object',
  // properties: {
  //   uid: { type: 'string' },
  //   control: { type: 'string' },
  //   documentation: { type: 'string' },
  //   componentProps: { type: 'object', properties: { ...props } },
  //   containerProps: schemaOfContainerProps,
  //   sourceRef: { type: 'string' }
  // }
  properties: { ...props }
});

describe('Form Model', () => {
  const exampleForm: FormElement = {
    uid: '1',
    control: 'Form',
    documentation: 'Hello World',
    components: [
      {
        control: 'Form',
        uid: 'c1'
      }
    ],
    elements: [
      {
        uid: '2',
        control: 'Stack',
        elements: [
          {
            uid: '3',
            control: 'Text',
            componentProps: { text: 'Hello' }
          },
          {
            uid: '4',
            control: 'Select',
            componentProps: { value: { source: 'category', sourceId: 'catId' } },
            containerProps: { label: 'Ahoy' }
          }
        ]
      },
      {
        uid: '5',
        control: 'Text'
      }
    ]
  };

  const dataSchema: JSONSchema = {
    type: 'object',
    properties: {
      category: { type: 'string', uid: 'catId', title: 'category' },
      personal: {
        type: 'object',
        uid: 'nid',
        title: 'personal',
        properties: {
          name: { type: 'string', title: 'name' }
        }
      }
    }
  };

  const defaultSchema = elementSchema();
  const textSchema = elementSchema({
    text: { type: 'string' },
    value: { type: 'object' }
  });
  const selectSchema = elementSchema({
    value: { type: 'object' }
  });

  const schemaLookup = (control: string) => {
    switch (control) {
      case 'Form':
      case 'Stack':
        return { ...defaultSchema };
      case 'Text':
        return { ...textSchema };
      case 'Select':
        return { ...selectSchema };
    }
    throw new Error('Not implemented: ' + control);
  };

  it('creates json version of the form', () => {
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);

    console.log(JSON.stringify(form.toJS(), null, 2));
    expect(form.toJS()).toEqual(exampleForm);
  });

  it('findElementById: finds elements by id', () => {
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    expect(form.components).toHaveLength(1);

    // check elements
    expect(form.findElementById('5')?.control).toBe('Text');
    expect(form.findElementById('1')?.control).toBe('Form');
  });

  it('uses prop helper to access atomic props', () => {
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    expect(form.elements[0].elements[0].componentProps.getValue('text')).toBe('Hello');
    expect(form.elements[0].elements[0].componentProps.text).toBe('Hello');
  });

  it('validates prop values', () => {
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);

    const el = form.elements[0].elements[0];
    el.componentProps.setValue('text', 1);
    el.componentProps.validate();

    expect(el.componentProps.text).toBe(1);
    expect(el.componentProps.getError('text')).toBe('Expected type string but found type integer');
  });

  it('can change element to a new parent', () => {
    const schemaLookup = () => defaultSchema;
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    const rootElement = form;

    expect(rootElement.elements[0].elements).toHaveLength(2);
    expect(rootElement.elements[0].elements[0].uid).toBe('3');
    expect(rootElement.elements[1].elements).toHaveLength(0);

    // ACT

    rootElement.elements[0].elements[0].changeParent(rootElement.elements[1]);

    // ASSERT
    expect(rootElement.elements[0].elements).toHaveLength(1);
    expect(rootElement.elements[0].elements[0].uid).toBe('4');
    expect(rootElement.elements[1].elements).toHaveLength(1);
    expect(rootElement.elements[1].elements[0].uid).toBe('3');
  });

  it('can undo and redo', () => {
    const schemaLookup = () =>
      elementSchema({
        title: { type: 'string' }
      });

    const parts = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    const { form, undoManager } = parts;
    const rootElement = form;

    rootElement.setValue('documentation', 'old');
    expect(rootElement.documentation).toBe('old');
    rootElement.setValue('documentation', 'new');
    expect(rootElement.getValue('documentation')).toBe('new');

    // ASSERT ON ROOT

    undoManager.undo();
    expect(rootElement.getValue('documentation')).toBe('old');
    undoManager.redo();
    expect(rootElement.getValue('documentation')).toBe('new');

    // ASSERT ON PROPS

    rootElement.componentProps.setValue('title', 'old');
    expect(rootElement.componentProps.getValue('title')).toBe('old');
    rootElement.componentProps.setValue('title', 'new');
    expect(rootElement.componentProps.title).toBe('new');
    undoManager.undo();
    expect(rootElement.componentProps.title).toBe('old');

    // ASSERT ON CHILDREN

    rootElement.elements[0].setValue('documentation', 'old');
    rootElement.elements[0].setValue('documentation', 'new');
    undoManager.undo();
    expect(rootElement.elements[0].getValue('documentation')).toBe('old');
  });

  /* =========================================================
      PROPS
     ======================================================== */

  it('uses prop helper to access complex props', () => {
    const project = buildProject(exampleForm, dataSchema, {});

    const valueProp = project.form.elements![0].elements![1].componentProps.value;
    // expect(valueProp.type).toBe('source');
    // expect(valueProp.sourceRef!.current.uid).toBe('catId');
    expect(valueProp.source).toBe('category');
  });

  it('allows props to use direct access to .props accessor via proxy', () => {
    const project = buildEditorProject(exampleForm, dataSchema, schemaLookup);

    const element = project.form.elements[0].elements[1];
    expect(element.componentProps.value.source).toEqual('category');

    element.componentProps.setValue('value', { source: project.schema.properties!.personal });
    expect(element.componentProps.value.source).toEqual('personal');
  });

  it('changes the number of references when element is deleted', () => {
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    expect(form.schemaReferences).toHaveLength(1);
    form.removeElement(form.elements[0].elements[1]);
    expect(form.schemaReferences).toHaveLength(0);
  });

  it('changes the number of references when prop type changes', () => {
    const { form } = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    expect(form.schemaReferences).toHaveLength(1);

    form.elements[0].elements[1].componentProps.setValue('value', { handler: 'handler' }); //.changeType('value');
    expect(form.schemaReferences).toHaveLength(0);
  });

  it('changes the number of references when source type changes', () => {
    const { form, schema, undoManager } = buildEditorProject(exampleForm, dataSchema, schemaLookup);
    const element = form.elements[0].elements[1];

    const personal = schema.properties!.personal;
    const category = schema.properties!.category;

    expect(form.schemaReferences.filter(s => s.schema === category)).toHaveLength(1);

    element.componentProps.setValue('value', { source: personal });

    expect(form.schemaReferences.filter(s => s.schema === category)).toHaveLength(0);
    expect(form.schemaReferences.filter(s => s.schema === personal)).toHaveLength(1);

    expect(element.componentProps.value.source).toBe('personal');

    // NOW TEST THE UNDO FLOW

    undoManager.undo();

    expect(form.schemaReferences.filter(s => s.schema === category)).toHaveLength(1);
    expect(form.schemaReferences.filter(s => s.schema === personal)).toHaveLength(0);

    expect(element.componentProps.value.source).toBe('category');
  });

  it('when a schema is reparented, a new path is automatically calculated', () => {
    const { form, schema } = buildEditorProject(exampleForm, dataSchema, schemaLookup);

    const element = form.elements[0].elements[1]!;
    // console.log(valueProp)

    expect(element.componentProps.value.source).toBe('category');

    const schemaFrom = schema.properties!.category;
    const schemaTo = schema.properties!.personal;

    schemaFrom?.changeParent(schemaTo!);

    expect(element.componentProps.value.type).toBe('source');
    expect(element.componentProps.value.source).toBe('personal.category');
  });

  it('allows to add a new control', () => {
    const { form, undoManager } = buildEditorProject(exampleForm, dataSchema, schemaLookup);

    form.addComponent({ control: 'Form', uid: '11', componentProps: {} });
    expect(form.components[1].uid).toBe('11');

    form.components[1].setValue('documentation', 'AAA');
    expect(form.components[1].documentation).toBe('AAA');

    undoManager.undo();

    expect(form.components[1].documentation).toBeUndefined();
  });

  // it('sets and unsets selected element', () => {
  //   const schemaLookup = () => defaultSchema;
  //   const { form, undoManager } = buildForm(exampleForm, schemaLookup);

  //   form.selectElement(form.rootElement.elements[0]);
  //   expect(form.selectedElement).toBe(form.rootElement.elements[0]);
  // });
});
