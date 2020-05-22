import { observable } from 'mobx';
import { JSONSchema } from '../json_schema';
import { FormElement } from '../form_definition';
import { DataSet } from './dataset_model';
import { buildDataModel } from '../builders/dataset_builder';
import { resolveSchemaReferences } from '../utilities/model_utilities';

const projectSchema: JSONSchema = {
  type: 'object',
  properties: {
    dataset: { type: 'custom' },
    form: { type: 'custom' }
  }
};

export class ProjectModel extends DataSet {
  @observable dataset: DataSet;
  form: FormElement;

  constructor(form: FormElement, schema: JSONSchema, data: Any) {
    super(projectSchema, undefined);

    this.form = form;
    this.dataset = buildDataModel(data, schema, this);
    this.undoManager.clear();
  }

  // @transaction
  // setData(data: DataSet) {
  //   undoManager.set(this, 'dataset', data);
  // }
}

export function buildProject<T = Any>(
  formDefinition: FormElement,
  schemaDefinition: JSONSchema,
  data: T = {} as Any
) {
  resolveSchemaReferences(schemaDefinition, schemaDefinition);
  schemaDefinition.$resolved = true;

  return new ProjectModel(formDefinition, schemaDefinition, data);
}
