import { observable, action } from 'mobx';
import { JSONSchema } from '../json_schema';
import { FormElement } from '../form_definition';
import { DataSet } from './dataset_model';
import { transaction, UndoManager } from '../undo-manager/manager';
import { buildDataModel } from './dataset_builder';

export class ProjectModel extends DataSet {
  @observable dirty = false;
  @observable dataset: DataSet;

  form: FormElement;

  constructor(form: FormElement, schema: JSONSchema, data: Any) {
    super(schema, undefined, new UndoManager());

    this.form = form;
    this.dataset = buildDataModel(data, schema, this);
  }

  // @transaction
  // setData(data: DataSet) {
  //   undoManager.set(this, 'dataset', data);
  // }

  @transaction
  setDirty(value: boolean) {
    this.dirty = value;
  }
}
