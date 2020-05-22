import { action } from 'mobx';

export interface IHistoryAction {
  undo(): void;
  redo(): void;
}

export class UndoAction<T = Any> implements IHistoryAction {
  constructor(
    private target: T,
    private key: keyof T,
    private redoValue: Any,
    private undoValue: Any
  ) {
    this.redo();
  }

  undo() {
    if (this.undoValue == null) {
      delete (this.target as Any)[this.key];
    } else {
      (this.target as Any)[this.key] = this.undoValue;
    }
  }

  redo() {
    (this.target as Any)[this.key] = this.redoValue;
  }
}

export class UndoMapAction implements IHistoryAction {
  constructor(
    private target: Map<Any, Any>,
    private key: string,
    private redoValue: Any,
    private undoValue: Any
  ) {}

  undo() {
    this.target.set(this.key, this.undoValue);
  }

  redo() {
    this.target.set(this.key, this.redoValue);
  }
}

export class UndoPushAction implements IHistoryAction {
  constructor(private target: Array<Any>, private value: Any) {
    this.redo();
  }

  undo() {
    this.target.pop();
  }

  redo() {
    this.target.push(this.value);
  }
}

export class UndoPopAction implements IHistoryAction {
  constructor(private target: Array<Any>, private value: Any) {
    this.redo();
  }

  undo() {
    this.target.push(this.value);
  }

  redo() {
    this.target.pop();
  }
}

export class UndoInsertAction implements IHistoryAction {
  constructor(private target: Array<Any>, private value: Any, private index: number) {
    this.redo();
  }

  undo() {
    this.target.splice(this.index, 1);
  }

  redo() {
    this.target.splice(this.index, 0, this.value);
  }
}

export class UndoReplaceAction implements IHistoryAction {
  originalValue: Any;

  constructor(private target: Array<Any>, private value: Any, private index: number) {
    this.redo();
  }

  undo() {
    this.target[this.index] = this.originalValue;
  }

  redo() {
    this.originalValue = this.target[this.index];
    this.target[this.index] = this.value;
  }
}

export class UndoRemoveByIndexAction implements IHistoryAction {
  private redoValue: Any;
  constructor(private target: Array<Any>, private index: number) {
    this.redo();
  }

  undo() {
    this.target.splice(this.index, 0, this.redoValue);
  }

  redo() {
    this.redoValue = this.target.splice(this.index, 1)[0];
  }
}

export class UndoRemoveAction implements IHistoryAction {
  private index: number;

  constructor(private target: Array<Any>, private value: Any) {
    this.index = this.target.indexOf(value);
    this.redo();
  }

  undo() {
    if (this.index >= 0) {
      this.target.splice(this.index, 0, this.value);
    }
  }

  redo() {
    if (this.index >= 0) {
      this.target.splice(this.index, 1);
    }
  }
}

export class UndoSwapAction implements IHistoryAction {
  constructor(private target: Array<Any>, private from: number, private to: number) {
    this.redo();
  }

  undo() {
    this.redo();
  }

  @action
  redo() {
    const to = this.target[this.to];
    this.target[this.to] = this.target[this.from];
    this.target[this.from] = to;
  }
}
