import { UndoManager, transaction } from '../../undo-manager/manager';
import { observable, autorun } from 'mobx';

describe('UndoManager', () => {
  it('undoes single action', () => {
    const obj = {
      name: 'Tomas'
    };
    const undoManager = new UndoManager();
    const t = undoManager.startTransaction();
    undoManager.set(obj, 'name', 'Valeria');
    undoManager.endTransaction(t);

    expect(obj.name).toBe('Valeria');

    undoManager.undo();

    expect(obj.name).toBe('Tomas');
  });

  it('undoes multiple actions with transactioned notifications', () => {
    const obj = {
      name: 'Tomas'
    };
    const undoManager = new UndoManager();
    const t = undoManager.startTransaction();
    undoManager.set(obj, 'name', 'Valeria');
    undoManager.set(obj, 'name', 'Vittoria');
    undoManager.set(obj, 'name', 'Dario');
    undoManager.endTransaction(t);

    // big transaction

    expect(obj.name).toBe('Dario');
    undoManager.undo();
    expect(obj.name).toBe('Tomas');
    undoManager.redo();
    expect(obj.name).toBe('Dario');
  });

  it('allows to use transaction decorator for transactions', () => {
    class Test {
      undoManager = new UndoManager();
      name = '';

      @transaction
      setName(value: string) {
        this.undoManager.set(this, 'name', value);
      }
    }
    const test = new Test();
    test.setName('Tomas');
    test.setName('Valeria');
    test.setName('Vittoria');

    // big transaction

    expect(test.name).toBe('Vittoria');
    test.undoManager.undo();
    expect(test.name).toBe('Valeria');
    test.undoManager.undo();
    expect(test.name).toBe('Tomas');
    test.undoManager.undo();
    expect(test.name).toBe('');
    test.undoManager.redo();
    expect(test.name).toBe('Tomas');
    test.undoManager.redo();
    expect(test.name).toBe('Valeria');

    // Modify queue
    test.setName('Dario');
    test.undoManager.redo();
    expect(test.name).toBe('Dario');
    test.undoManager.undo();
    test.undoManager.redo();
    expect(test.name).toBe('Dario');

    // Clear
    test.undoManager.clear();
    test.undoManager.undo();
    expect(test.name).toBe('Dario');
  });

  class TestTransaction {
    undoManager = new UndoManager();
    @observable name = '';
    @observable age = 0;

    @transaction
    setName(value: string) {
      this.undoManager.set(this, 'name', value);
    }

    @transaction
    setAge(value: number) {
      this.undoManager.set(this, 'age', value);
    }

    @transaction
    setPerson(name: string, age: number) {
      this.setName(name);
      this.setAge(age);
    }
  }

  it('allows to nest transactions', () => {
    const test = new TestTransaction();
    test.setPerson('Tomas', 40);
    test.setPerson('Valeria', 25);

    expect(test.name).toBe('Valeria');
    expect(test.age).toBe(25);

    test.undoManager.undo();

    expect(test.name).toBe('Tomas');
    expect(test.age).toBe(40);
  });

  it('undo redo runs as mobx transaction', () => {
    const monitor = mock.fn();
    const test = new TestTransaction();

    autorun(
      () => {
        test.name;
        monitor();
      },
      { requiresObservable: true }
    );

    test.setPerson('Tomas', 40);
    test.setPerson('Valeria', 25);

    expect(monitor).toBeCalledTimes(3);

    test.undoManager.undo();

    // setting two value is only notified once
    expect(monitor).toBeCalledTimes(4);
  });
});
