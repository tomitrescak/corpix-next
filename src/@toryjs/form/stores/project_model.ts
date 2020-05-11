import { observable, action } from 'mobx';
import { JSONSchema } from '../json_schema';
import { FormElement } from '../form_definition';
import { DataSet } from './dataset_model';

type UndoAction<T = Any> = {
  target: T;
  key: keyof T;
  redoValue: Any;
  undoValue: Any;
};

type UndoArrayAction = {
  target: Array<Any>;
  action: 'add' | 'insert' | 'set' | 'remove';
  index: number;
  value: Any;
};

type Transaction = {
  uid: number;
  previous: Transaction | null;
  next: Transaction | null;
  queue: Array<UndoAction | UndoArrayAction>;
};

class UndoManager {
  static startHead = { uid: 0, previous: null, next: null, queue: [] };

  uid = 1;
  head: Transaction = UndoManager.startHead;
  transaction: Transaction | null = null;

  clear() {
    this.head = UndoManager.startHead;
  }

  startTransaction() {
    if (this.transaction) {
      return -1;
    }
    const newTransaction = { uid: this.uid++, queue: [], previous: this.head, next: null };
    this.head.next = newTransaction;
    this.head = newTransaction;
    return newTransaction.uid;
  }

  endTransaction(uid: number) {
    if (this.transaction?.uid === uid) {
      this.transaction = null;
    }
  }

  @action
  set<T>(target: T, key: keyof T, value: Any) {
    this.transaction?.queue.push({ target, key, redoValue: value, undoValue: target[key] });
    target[key] = value;
  }

  undo() {}

  redo() {}
}

export const undoManager = new UndoManager();

function transaction(target: Any, propertyKey: string, descriptor: PropertyDescriptor) {
  let originalMethod = descriptor.value;
  //wrapping the original method
  descriptor.value = function (...args: any[]) {
    const transactionId = undoManager.startTransaction();
    let result = originalMethod.apply(this, args);
    undoManager.endTransaction(transactionId);
    return result;
  };
}

export class ProjectModel {
  @observable dirty = false;
  @observable dataset: DataSet;

  schema: JSONSchema;
  form: FormElement;

  constructor(form: FormElement, schema: JSONSchema, dataset: DataSet) {
    this.form = form;
    this.schema = schema;
    this.dataset = dataset;

    undoManager.clear();
  }

  @transaction
  setData(data: DataSet) {
    undoManager.set(this, 'dataset', data);
  }

  @transaction
  setDirty(value: boolean) {
    this.dirty = value;
  }
}
