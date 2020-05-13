import { DataSet } from './dataset_model';
import { JSONSchema } from '../json_schema';
import { observable } from 'mobx';

export class SchemaModel extends DataSet<JSONSchema> {
  @observable reference?: SchemaModel;

  // PROPERTIES

  get owner(): Schema {
    if (this.reference) {
      return this.reference.current;
    }
    return this;
  }

  // UTILITIES
}
