import { DataSet } from './dataset_model';
import {
  JSONSchema,
  JSONSchema7Type,
  JSONSchema7TypeName,
  schemaOfJsonSchema
} from '../json_schema';
import { observable, toJS } from 'mobx';
import { transaction } from '../undo-manager/manager';

const arrays = ['allOf', 'anyOf', 'oneOf'];
const objects = ['properties', 'definitions'];

export class SchemaModel extends DataSet<SchemaModel> {
  static schemaKeys: string[] = Object.keys(schemaOfJsonSchema.properties!).filter(
    k => k != 'items' && arrays.indexOf(k) === -1 && objects.indexOf(k) === -1
  );

  // inherited

  parent: SchemaModel | undefined;

  // Schema Properties

  // private

  @observable _properties?: { [key: string]: SchemaModel };
  @observable _definitions?: { [key: string]: SchemaModel };
  @observable _allOf?: SchemaModel[];
  @observable _anyOf?: SchemaModel[];
  @observable _oneOf?: SchemaModel[];
  @observable reference?: SchemaModel;

  // public

  uid?: string;
  @observable not?: SchemaModel;
  @observable items?: SchemaModel;
  @observable required?: string[];

  @observable expression?: string;
  @observable validationExpression?: string;
  @observable validationGroup?: string;

  @observable type?: JSONSchema7TypeName;
  @observable enum?: JSONSchema7Type[];
  @observable const?: JSONSchema7Type;

  @observable $ref?: string;
  @observable multipleOf?: number;
  @observable maximum?: number;
  @observable exclusiveMaximum?: number;
  @observable minimum?: number;
  @observable exclusiveMinimum?: number;

  @observable maxLength?: number;
  @observable minLength?: number;
  @observable pattern?: string;

  @observable maxItems?: number;
  @observable minItems?: number;
  @observable uniqueItems?: boolean;

  @observable errorMessage?: string;
  @observable format?: string;

  @observable title?: string;
  @observable description?: string;
  @observable default?: JSONSchema7Type;
  @observable readOnly?: boolean;
  @observable writeOnly?: boolean;

  // CONTRUCTOR

  constructor(schema: JSONSchema, parent?: SchemaModel) {
    super(schemaOfJsonSchema, parent);

    this.parent = parent;

    // init definitions, we need to do this first as children will ask for them
    if (schema.definitions) {
      this.constructObjects(schema, 'definitions');
    }

    // resolve references
    if (schema.$ref) {
      this.reference = this.rootSchema.definitions![schema.$ref?.split('/')[2]];
      if (!this.reference) {
        console.log('Could not find a definition for: ' + schema.$ref);
        return;
      }
    }

    const keys = Object.keys(schema) as Array<keyof JSONSchema>;
    for (let key of keys) {
      if (schema[key] != null) {
        // arrays
        if (key === 'anyOf' || key === 'allOf' || key === 'oneOf') {
          this.constructArray(schema, key);
        }
        // objects
        else if (key === 'properties') {
          this.constructObjects(schema, 'properties');
        } else if (key === 'items') {
          this.items = new SchemaModel(schema.items!, this);
        } else if (key !== 'definitions') {
          this.setItem(key, schema[key]);
        }
      }
    }
  }

  // PROPERTIES

  get owner(): SchemaModel {
    if (this.reference) {
      return this.reference;
    }
    return this;
  }

  get rootSchema(): SchemaModel {
    return this.parent == null || !(this.parent instanceof SchemaModel)
      ? this
      : this.parent.rootSchema;
  }

  get properties() {
    return this.owner._properties;
  }

  get definitions() {
    return this.owner._definitions;
  }

  get allOf() {
    return this.owner._allOf;
  }

  get anyOf() {
    return this.owner._anyOf;
  }

  get oneOf() {
    return this.owner._oneOf;
  }

  // TRANSACTIONS

  @transaction
  addProperty(schema: JSONSchema) {
    if (this._properties == null) {
      this._properties = {};
    }
    this.undoManager.set(this.properties!, schema.title!, new SchemaModel(schema, this));
  }

  @transaction
  removeSchema(element: SchemaModel) {
    for (let key of Object.keys(this.properties!)) {
      if (this._properties![key] === element) {
        this.undoManager.set(this.properties!, key!, null);
        return;
      }
    }

    for (let key of Object.keys(this.definitions!)) {
      if (this._properties![key] === element) {
        this.undoManager.set(this.properties!, key!, null);
        return;
      }
    }
  }

  @transaction
  addRequired(name: string) {
    if (this.owner.required == null) {
      this.owner.setValue('required', [name]);
      return;
    }
    this.owner.addRow('required', name);
  }

  @transaction
  removeRequired(name: string) {
    this.owner.removeRow('required', name);
  }

  @transaction
  changeParent(newParent: SchemaModel) {
    if (this.parent == null) {
      return;
    }
    // remove from current
    this.parent.removeSchema(this);

    let collection = newParent.type === 'array' ? newParent.items : newParent;

    // make sure that item has properties initialised
    if (collection!.properties == null) {
      collection!._properties = {};
    }

    this.undoManager.set(collection!.properties!, this.title!, this);
    this.parent = newParent;
  }

  // UTILITIES

  // getProperty(name: string) {
  //   if (this.properties == null) {
  //     return null;
  //   }
  //   return this.properties[name];
  // }

  getValue(key: Any): Any {
    if (key === 'title' || key === 'uid' || key === '$ref' || key === '$import') {
      return this.getItem(key);
    }
    return this.owner.getItem(key);
  }

  toJS() {
    const result: Any = {};

    // add common values

    for (let key of SchemaModel.schemaKeys) {
      result[key] = toJS(this.getItem(key));
    }

    // resolve required, remove orphaned values
    if (result.required) {
      const keys = Object.keys(this.properties || {});
      for (let i = result.required.length - 1; i >= 0; i--) {
        if (keys.indexOf(result.required[i]) === -1) {
          result.required.splice(i, 1);
        }
      }
    }

    // remove empty values
    for (let key of Object.keys(result)) {
      if (result[key] == null || result[key].length === 0) {
        delete result[key];
      }
    }

    // this is where reference ends
    if (this.reference) {
      result.$ref = `#/definitions/${this.reference.title}`;
      return result;
    }

    // add properties and definitions
    objects.map(o => {
      const obj: { [index: string]: SchemaModel } = (this.owner as Any)[o];
      if (obj != null) {
        const map: Any = {};
        for (let key of Object.keys(obj)) {
          if (obj[key]) {
            map[obj[key].title!] = obj[key].toJS();
          }
        }
        if (Object.keys(map).length > 0) {
          result[o] = map;
        }
      }
    });

    // recreate all conditional collections
    arrays.map(a => {
      const obj: SchemaModel[] = (this.owner as Any)[a];
      if (obj != null && obj.length > 0) {
        result[a] = obj.map(o => o.toJS());
      }
    });

    // add the array items
    if (this.owner.items) {
      result.items = this.owner.items.toJS();
    }

    return result;
  }

  // PRIVATE HELPERS

  private constructObjects(schema: JSONSchema, key: 'properties' | 'definitions') {
    let map: Any = {};
    for (let childKey of Object.keys(schema[key]!)) {
      map[childKey] = new SchemaModel(schema[key]![childKey], this);
    }
    this.setItem('_' + key, map);
  }

  private constructArray(schema: JSONSchema, key: 'anyOf' | 'allOf' | 'oneOf') {
    this.setItem(
      '_' + key,
      schema[key]!.map((s: JSONSchema) => new SchemaModel(s, this))
    );
  }
}

export function buildSchema(schemaDefinition: JSONSchema) {
  return new SchemaModel(schemaDefinition);
}
