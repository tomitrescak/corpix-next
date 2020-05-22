import { action } from 'mobx';
import * as Actions from './undo_actions';
import { DataSet } from '../stores/dataset_model';

type Transaction = {
  uid: number;
  previous: Transaction | null;
  next: Transaction | null;
  queue: Actions.IHistoryAction[];
};

interface IUndoable {
  undoManager: UndoManager;
}

export function transaction(target: Any, propertyKey: string, descriptor: PropertyDescriptor) {
  let originalMethod = descriptor.value;
  //wrapping the original method
  descriptor.value = function (this: IUndoable, ...args: any[]) {
    const manager = this.undoManager;
    const transactionId = manager.startTransaction();
    let result = originalMethod.apply(this, args);
    manager.endTransaction(transactionId);
    return result;
  };
}

export class UndoManager {
  static startHead = { uid: 0, previous: null, next: null, queue: [] };

  uid = 1;
  head: Transaction = UndoManager.startHead;
  transaction: Transaction | null = null;

  // constructor() {
  //   console.log('New UndoManager');
  //   console.trace();
  // }

  clear() {
    this.head = UndoManager.startHead;
  }

  startTransaction() {
    if (this.transaction) {
      return -1;
    }
    const newTransaction = { uid: this.uid++, queue: [], previous: this.head, next: null };
    this.transaction = newTransaction;

    // console.log(`[${newTransaction.uid}]: Starting Transaction`);

    return newTransaction.uid;
  }

  endTransaction(uid: number) {
    if (this.transaction!.uid === uid) {
      this.head.next = this.transaction;
      this.head = this.transaction!;

      this.transaction = null;
      // console.log(`[${uid}]:  Finish`);
    }
  }

  set<T>(target: T, key: keyof T, value: Any) {
    this.transaction?.queue.push(new Actions.UndoAction(target, key, value, target[key]));
  }

  mapSet(target: Map<string, string>, key: string, value: Any) {
    this.transaction?.queue.push(new Actions.UndoMapAction(target, key, value, target.get(key)));
    target.set(key, value);
  }

  push<B>(target: Array<B>, value: B) {
    this.transaction?.queue.push(new Actions.UndoPushAction(target, value));
  }

  // pop(target: Array<Any>, value: Any) {
  //   this.transaction?.queue.push(new Actions.UndoPopAction(target, value));
  // }

  insert(target: Array<Any>, value: Any, index: number) {
    this.transaction?.queue.push(new Actions.UndoInsertAction(target, value, index));
  }

  replace(target: Array<Any>, value: Any, index: number) {
    this.transaction?.queue.push(new Actions.UndoReplaceAction(target, value, index));
  }

  removeByIndex(target: Array<Any>, index: number) {
    this.transaction?.queue.push(new Actions.UndoRemoveByIndexAction(target, index));
  }

  removeByValue(target: Array<Any>, value: Any) {
    this.transaction?.queue.push(new Actions.UndoRemoveAction(target, value));
  }

  swap(target: Array<Any>, from: number, to: number) {
    this.transaction?.queue.push(new Actions.UndoSwapAction(target, from, to));
  }

  @action
  undo() {
    for (let i = this.head.queue.length - 1; i >= 0; i--) {
      this.head.queue[i].undo();
    }

    if (this.head.previous) {
      this.head = this.head.previous;
    }
  }

  @action
  redo() {
    if (this.head.next) {
      this.head = this.head.next;
    }

    for (let item of this.head.queue) {
      item.redo();
    }
  }
}
