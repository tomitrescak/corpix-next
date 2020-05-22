import { JSONSchema } from '../json_schema';
import { DataSet } from '../stores/dataset_model';
import { observable, decorate } from 'mobx';
import { buildValue } from '../utilities/dataset_utilities';

// STANDARD BUILDER

const datasets: Array<{ schema: JSONSchema; DataSet: Any }> = [];
export function buildDataSet<T = Any>(schema: JSONSchema) {
  let res = datasets.find(c => c.schema === schema);
  if (res != null) {
    return res.DataSet;
  }

  class ExtendedDataSet extends DataSet<T> {
    constructor(obj: T, parent: DataSet) {
      super(schema, parent);
      if (obj == null) {
        return;
      }
      for (let key of Object.keys(schema.properties!)) {
        (this as Any)[key] = buildValue(schema.properties![key], (obj as Any)[key], this);
      }
    }
  }

  const observables: any = {};
  if (schema.properties) {
    for (let key of Object.keys(schema.properties!)) {
      observables[key] = observable;
    }
  }
  decorate(ExtendedDataSet, observables);

  datasets.push({ schema, DataSet: ExtendedDataSet });
  return ExtendedDataSet;
}

export function buildDataModel<T>(
  data: T,
  schema: JSONSchema,
  parent?: DataSet | undefined
): DataSet<T> & Readonly<T> {
  const CustomDataset = buildDataSet(schema);
  return new CustomDataset(data, parent);
}
