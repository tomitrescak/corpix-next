import { JSONSchema } from '../json_schema';

export class DataSet<T = Any> {
  setValue(key: keyof T | null | undefined, value: Any) {
    //
  }
  getValue(key: keyof T): Any {
    //
  }
  getError(key: keyof T): string {
    return '';
  }
  getSchema(key: keyof T): JSONSchema {
    return null as Any;
  }
  setError(key: keyof T, error: string) {
    //
  }
  addRow(key: keyof T, row: Any) {
    //
  }
  removeRow(key: keyof T, row: Any) {
    //
  }
}
