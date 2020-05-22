import { decorate, observable } from 'mobx';

import { DataSet } from '../stores/dataset_model';

export function undoable(target: any, propertyKey: string) {
  const newKey: Any = '_' + propertyKey;
  Object.defineProperty(target, propertyKey, {
    get: function () {
      return this[newKey];
    },

    set: function (this: DataSet, value) {
      this.setValue(newKey, value);
    }
  });

  decorate(target, {
    [newKey]: observable
  });
}
