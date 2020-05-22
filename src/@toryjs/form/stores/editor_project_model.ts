import { resolveSchemaReferences } from '../utilities/model_utilities';
import { FormElement } from '../form_definition';
import { JSONSchema } from '../json_schema';
import { undoable } from '../utilities/decorators';
import { SchemaModel } from './schema_model';
import { FormModel } from './form_model';
import { DataSet } from './dataset_model';
import { transaction } from '../undo-manager/manager';
import { StateModel } from './editor_state_model';
import { buildDataModel } from '../builders/dataset_builder';

type SchemaLookup = (control: string) => JSONSchema;

const editorProjectSchema: JSONSchema = {
  type: 'object',
  properties: {
    dataset: { type: 'custom' },
    form: { type: 'custom' },
    schema: { type: 'custom' },
    state: { type: 'custom' }
  }
};

export class EditorProjectModel extends DataSet<EditorProjectModel> {
  @undoable dataset: DataSet;

  form: FormModel;
  schema: SchemaModel;
  state: StateModel;

  // undoManager: { undo(): void; redo(): void } = null as Any;

  constructor(form: FormElement, schema: JSONSchema, data: Any, schemaLookup: SchemaLookup) {
    super(editorProjectSchema);

    this.schema = new SchemaModel(schema, this);
    this.form = new FormModel(form, this, schemaLookup);
    this.state = new StateModel(this);
    this.dataset = buildDataModel(data, schema, this);

    if (this.form != null && this.form.components != null) {
      if (this.form.components!.length > 0) {
        this.state.selectedComponent = this.form.components[0];
      }
    }
  }

  // TRANSACTIONS

  @transaction
  convertComponentToElement() {
    const current = this.state.selectedElement;
    if (!current || !current.parent) {
      return;
    }
    const parent = current.parentElement;
    if (!parent || !parent.elements) {
      return;
    }
    const page = this.form.components.find(p => p.uid === current.componentProps.pageId.value);
    const newComponent = page!.toJS();
    const index = parent.elements.indexOf(current as Any);

    parent.replaceElement(index, newComponent);
    this.state.selectElement(parent.elements[index]);
  }

  @transaction
  convertElementToComponent(name: string) {
    const current = this.state.selectedElement;
    if (!current || !current.parent) {
      return;
    }
    const parent = current.parentElement;
    if (!parent || !parent.elements) {
      return;
    }
    const newComponent = current.toJS();
    newComponent.containerProps.editorLabel = name;

    const index = parent.elements.indexOf(current as Any);
    const newModel = this.form!.addComponent(newComponent);

    const replacement: FormElement = {
      control: 'Form',
      uid: undefined as Any,
      componentProps: {
        pageId: newModel.uid
      },
      containerProps: {
        editorLabel: name
      }
    };
    parent.replaceElement(index, replacement);
    this.state.selectElement(parent.elements[index]);
  }

  // UTILITIES
}

export function buildEditorProject<T = Any>(
  formDefinition: FormElement,
  schemaDefinition: JSONSchema,
  data: T = {} as Any,
  schemaLookup: SchemaLookup
) {
  resolveSchemaReferences(schemaDefinition, schemaDefinition);
  schemaDefinition.$resolved = true;

  return new EditorProjectModel(formDefinition, schemaDefinition, data, schemaLookup);
}
