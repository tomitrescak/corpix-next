import { DataSet } from './dataset_model';
import { SchemaModel } from './schema_model';
import { computed, observable } from 'mobx';
import { transaction } from '../undo-manager/manager';
import { FormModel } from './form_model';
import { BoundProp } from '../form_definition';
import { schemaOfProp, JSONSchema } from '../json_schema';
import { buildValue } from '../utilities/dataset_utilities';
import { EditorProjectModel } from './editor_project_model';

type PropType = 'source' | 'handler' | 'value' | 'dynamicHandler';

export class PropModel extends DataSet<PropModel> {
  @observable private _sourceSchema?: SchemaModel;
  @observable private _handler?: string;
  @observable private _dynamicHandler?: string;
  @observable private _value?: string;

  _type: PropType = null as Any;
  parentForm: FormModel;

  // CONTRUCTOR

  constructor(prop: BoundProp, schema: JSONSchema, parent: FormModel) {
    super(schemaOfProp(schema.type!), parent);

    this.parentForm = parent;

    if (prop == null || typeof prop !== 'object') {
      this._type = 'value';
      this.value = prop;
      return;
    } else if (prop.sourceId) {
      this._type = 'source';
      this.sourceSchema = this.rootProject.schema.findSchema(prop.sourceId);
      this.parentForm.addSchemaReference({
        schema: this.sourceSchema!,
        element: this.parentForm,
        prop: this
      });
    } else if (prop.handler) {
      this._type = 'handler';
      this.handler = prop.handler;
    } else if (prop.dynamicHandler) {
      this._type = 'dynamicHandler';
      this.dynamicHandler = prop.dynamicHandler;
    } else {
      this._type = 'value';
    }
  }

  // PROPERTIES

  get rootProject(): EditorProjectModel {
    return this.getRoot() as EditorProjectModel;
  }

  @computed
  get source(): string | undefined {
    if (this.sourceSchema == null) {
      return undefined;
    }
    let path = this.sourceSchema.title;
    let parent = this.sourceSchema.parentSchema;
    while (parent != null && parent.parentSchema != null) {
      // we ignore top level definitions
      if (
        parent.parentSchema.definitions &&
        parent.parentSchema.definitions[parent.title] === parent
      ) {
        break;
      }

      path = parent.title + '.' + path;
      parent = parent.parentSchema;
    }
    return path;
  }

  get type() {
    return this._type;
  }

  set type(type: PropType) {
    if (this.type === type) {
      return;
    }
    this.setRawValue('_type', type);
    this.sourceSchema = undefined;
    this.handler = undefined;
    this.value = undefined;

    this.parentForm.removePropReferences(this);
  }

  //#region Undoable Properties

  get sourceSchema() {
    return this._sourceSchema;
  }

  set sourceSchema(value: SchemaModel | undefined) {
    this.setRawValue('_sourceSchema', value);
  }

  get handler() {
    return this._handler;
  }

  set handler(value: string | undefined) {
    this.setRawValue('_handler', value);
  }

  get dynamicHandler() {
    return this._dynamicHandler;
  }

  set dynamicHandler(value: string | undefined) {
    this.setRawValue('_dynamicHandler', value);
  }

  get value() {
    return this._value;
  }

  set value(value: string | undefined) {
    this.setRawValue('_value', value);
  }

  //#endregion

  // TRANSACTIONS

  @transaction
  setSource(schema: SchemaModel) {
    if (this.sourceSchema) {
      this.parentForm.removePropReferences(this);
    }
    if (!schema) {
      this.sourceSchema = undefined;
      return;
    }

    this.parentForm.rootForm.addSchemaReference({
      element: this.parentForm,
      prop: this,
      schema: schema
    });
    this.setRawValue('sourceSchema', schema);
  }

  @transaction
  setProp(value: Any) {
    let keys = Object.keys(value || {});

    if (value == null || (typeof value === 'object' && keys.length === 0)) {
      this.type = 'value';
      this.value = undefined;
    } else if (keys.indexOf('handler') >= 0 || this.type === 'handler') {
      this.type = 'handler';
      this.handler = value.handler || value;
    } else if (keys.indexOf('source') >= 0 || this.type === 'source') {
      this.type = 'source';
      this.setSource(value.source);
      // throw new Error('You need to set source using a defined method!')
    } else if (keys.indexOf('dynamicHandler') >= 0) {
      this.type = 'dynamicHandler';
      this.dynamicHandler = value.dynamicHandler;
      // throw new Error('You need to set source using a defined method!');
    } else if (this.type === 'dynamicHandler') {
      this.dynamicHandler = value;
    } else {
      this.type = 'value';
      // this.setValue('value', buildValue(this.schema, value))
      this.value = buildValue(this.schema, value);
    }
    return this;
  }

  // GETTERS

  toJS() {
    if (this.type === 'value') {
      return this.value;
    }
    if (this.type === 'source' && this.sourceSchema) {
      return {
        source: this.source,
        sourceId: this.sourceSchema.uid
      };
    }
    if (this.type === 'handler') {
      return { handler: this.handler };
    }
    if (this.type === 'dynamicHandler') {
      return { dynamicHandler: this.dynamicHandler };
    }
  }
}
