import { observable } from 'mobx';
import { debounce } from '@toryjs/ui';

import { UndoManager, transaction } from '../undo-manager/manager';
import { JSONSchema } from '../json_schema';
import { buildJs, buildValue } from '../utilities/dataset_utilities';
import { Validator } from '../validation/validator';

const validator = new Validator({ breakOnFirstError: false });

export class DataSet<T = Any> {
  // [k: string]: any;

  @observable dirty = false;
  errors = observable.map({});
  validateBounceTime = 1000;

  undoManager: UndoManager;
  schema: JSONSchema;
  parent: DataSet | undefined;

  keys: string[];

  constructor(schema: JSONSchema, parent?: DataSet, undoManager?: UndoManager) {
    this.schema = schema;
    this.parent = parent;
    this.undoManager = undoManager || new UndoManager();
    this.keys = Object.keys(this.schema.properties!);
  }

  // PROPERTIES

  get js() {
    return this.toJS();
  }

  // TRANSACTIONS

  // setValue(key: keyof T, value: Any): void;
  // setValue(key: string, value: Any): void;
  @transaction
  setValue(key: Any, value: Any): void {
    const { owner, path } = this.resolvePath(key);
    const resolvedValue = buildValue(owner.getSchema(path), value, owner);
    this.undoManager.dataSet(owner, path, resolvedValue);
  }

  setError(key: keyof T, error: string | Any) {
    this.errors.set(key as string, error);
  }

  @transaction
  setDirty(value: boolean) {
    const root = this.getRoot();
    if (root != this) {
      root.setDirty(value);
    } else {
      this.undoManager.set(this, 'dirty', value);
    }
  }

  // GETTERS

  getDataSet(key: keyof T): DataSet {
    return this.getValue(key);
  }

  getValue(key: keyof T): Any;
  getValue(key: string): Any;
  getValue(key: Any): Any {
    const { owner, path } = this.resolvePath(key);
    return owner.getItem(path);
  }

  getError(key: keyof T): string;
  getError(key: string): string;
  getError(key: keyof Any): string {
    return this.errors.get(key);
  }

  getSchema(key: keyof T): JSONSchema {
    return this.schema.properties![key as string];
  }

  getRoot(): DataSet {
    if (this.parent == null) {
      return this;
    }
    return this.parent.getRoot();
  }

  validate(): boolean {
    return validator.validateDataSet(this);
  }

  clearErrors() {
    this.errors.clear();
    for (let key of Object.keys(this.schema.properties!)) {
      let value = (this as Any)[key];
      if (value instanceof DataSet) {
        value.clearErrors();
      }
    }
  }

  // ARRAY ACTIONS

  buildArrayValue = (path: Any, value: Any): Any =>
    buildValue(this.getSchema(path).items!, value, this);

  @transaction
  addRow(key: keyof T, row: Any) {
    this.undoManager.push(this.getItem(key as Any), this.buildArrayValue(key, row));
  }

  @transaction
  insertRow(key: keyof T, index: number, row: Any) {
    this.undoManager.insert(this.getItem(key as Any), this.buildArrayValue(key, row), index);
  }

  @transaction
  removeRow(key: keyof T, row: Any) {
    this.undoManager.removeByValue(this.getItem(key as Any), row);
  }

  @transaction
  removeRowByIndex(key: keyof T, index: number) {
    this.undoManager.removeByIndex(this.getItem(key as Any), index);
  }

  @transaction
  swapRows(key: keyof T, from: number, to: number) {
    this.undoManager.swap(this.getItem(key as Any), from, to);
  }

  // UTILITY

  resolvePath(path: string): { owner: DataSet; path: string } {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let owner = this;
    while (path.indexOf('.') > 0) {
      let first: Any = path.substring(0, path.indexOf('.'));
      owner = owner.getValue(first);
      path = path.substring(path.indexOf('.') + 1);
    }
    return { owner, path };
  }

  toJS() {
    const result: Any = {};
    for (let key of this.keys) {
      result[key] = buildJs(this.getItem(key));
    }
    return result;
  }

  private getItem(key: string) {
    return (this as Any)[key];
  }
}
