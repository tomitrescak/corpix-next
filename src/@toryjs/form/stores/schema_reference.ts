import { PropModel } from './prop_model';
import { SchemaModel } from './schema_model';
import { FormModel } from './form_model';

export type SchemaUseReference = {
  prop?: PropModel;
  schema: SchemaModel;
  element?: FormModel;
};
