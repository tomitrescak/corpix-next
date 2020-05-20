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

  schema: JSONSchema;
  parent: DataSet<T> | undefined;

  keys: string[];
  um?: UndoManager;

  constructor(schema: JSONSchema, parent?: DataSet<T>) {
    this.schema = schema;
    this.parent = parent;
    this.keys = Object.keys(this.schema.properties!);
  }

  // PROPERTIES

  get js() {
    return this.toJS();
  }

  get undoManager(): UndoManager {
    if (this.um == null) {
      if (this.parent != null) {
        this.um = this.parent.undoManager;
      } else {
        this.um = new UndoManager();
      }
    }
    return this.um;
  }

  // TRANSACTIONS

  // setValue(key: keyof T, value: Any): void;
  // setValue(key: string, value: Any): void;
  @transaction
  setValue(key: Any, value: Any): void {
    const { owner, path } = this.resolvePath(key);
    const resolvedValue = buildValue(owner.getSchema(path), value, owner);
    this.undoManager.set(owner, path as Any, resolvedValue);
  }

  @transaction
  mapSetValue(key: Any, mapKey: string, value: Any): void {
    const { owner, path } = this.resolvePath(key);
    this.undoManager.mapSet(owner.getItem(path), mapKey, value);
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

  // NON TRANSACTIONED SETTERS

  setError(key: keyof T, error: string | Any) {
    this.errors.set(key as string, error);
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

  protected getItem(key: string) {
    return (this as Any)[key];
  }

  protected setItem(key: string, value: Any) {
    return ((this as Any)[key] = value);
  }
}
