import { JSONSchema } from '../json_schema';
import { DataSet } from '../stores/dataset_model';
import { PropModel } from '../stores/prop_model';

// STANDARD BUILDER

const datasets: Array<{ schema: JSONSchema; DataSet: Any }> = [];

export function buildPropsDataSet<T = Any>(schema: JSONSchema) {
  let res = datasets.find(c => c.schema === schema);
  if (res != null) {
    return res.DataSet;
  }

  class ExtendedDataSet extends DataSet<T> {
    constructor(obj: T, parent: DataSet) {
      super(schema, parent);
      for (let key of Object.keys(schema.properties!)) {
        (this as Any)['_' + key] = new PropModel(
          obj ? (obj as Any)[key] : '',
          schema.properties![key],
          this.parent as Any
        );
      }
    }

    getValue(key: Any) {
      if (this.schema.properties![key]) {
        let prop = this.getProp(key);
        if (prop.value != null) {
          return prop.value;
        }
        return prop;
      }
    }

    setValue(key: Any, value: Any) {
      if (this.schema.properties![key]) {
        return this.getProp(key).setProp(value);
      }
    }

    getProp(key: string): PropModel {
      return (this as Any)['_' + key];
    }
  }

  for (let key of Object.keys(schema.properties!)) {
    Object.defineProperty(ExtendedDataSet.prototype, key, {
      get: function (this: ExtendedDataSet) {
        return this.getValue(key);
      }
      // set: function (this: ExtendedDataSet, value: Any) {
      //   this.setValue(key, value);
      // }
    });
  }

  datasets.push({ schema, DataSet: ExtendedDataSet });
  return ExtendedDataSet;
}

export function buildPropsDataModel<T>(
  data: T,
  schema: JSONSchema,
  parent?: DataSet | undefined
): DataSet<T> & Readonly<T> {
  const CustomDataset = buildPropsDataSet(schema);
  return new CustomDataset(data, parent);
}
