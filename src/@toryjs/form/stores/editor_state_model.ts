import { SchemaModel } from './schema_model';
import { FormModel } from './form_model';
import { transaction } from '../undo-manager/manager';
import { DataSet } from './dataset_model';
import { JSONSchema } from '../json_schema';
import { observable } from 'mobx';

const stateModelSchema: JSONSchema = {
  type: 'object',
  properties: {
    selectedSchema: { type: 'custom' },
    selectedElement: { type: 'custom' },
    selectedComponent: { type: 'custom' },
    leftPane: { type: 'string' }
  }
};

export class StateModel extends DataSet {
  // leftPane: prop('outline'),
  @observable _selectedSchema?: SchemaModel;
  @observable _selectedElement?: FormModel;
  @observable _selectedComponent?: FormModel;
  @observable _leftPane = 'outline';

  // CONTRUCTOR

  constructor(parent: DataSet) {
    super(stateModelSchema, parent);
  }

  //#region PROPERTIES
  get selectedSchema() {
    return this._selectedSchema;
  }

  set selectedSchema(value: SchemaModel | undefined) {
    this.setRawValue('_selectedSchema', value);
  }

  get selectedElement() {
    return this._selectedElement;
  }

  set selectedElement(value: FormModel | undefined) {
    this.setRawValue('_selectedElement', value);
  }

  get selectedComponent() {
    return this._selectedComponent;
  }

  set selectedComponent(value: FormModel | undefined) {
    this.setRawValue('_selectedComponent', value);
  }

  get leftPane() {
    return this._leftPane;
  }

  set leftPane(value: string | undefined) {
    this.setRawValue('_leftPane', value);
  }

  //#endregion Properties

  //#region TRANSACTIONS

  @transaction selectElement(element?: FormModel) {
    if (!(element instanceof FormModel)) {
      return;
    }

    if (element.control === 'Container') {
      element = element.parentElement;
    }

    if (this.selectedElement != null) {
      this.selectedElement.isSelected = false;
    }
    if (this.selectedSchema != null) {
      this.selectedSchema.isSelected = false;
    }

    // select schema
    if (element) {
      let schema = element.componentProps.value
        ? element.componentProps.value.sourceSchema
        : element.componentProps.checked
        ? element.componentProps.checked.sourceSchema
        : undefined;
      this.selectedSchema = schema || undefined;

      if (this.selectedSchema != null) {
        this.selectedSchema.isSelected = true;
      }
    }

    // select element

    this.selectedElement = element || undefined;

    if (this.selectedElement != null) {
      this.selectedElement.isSelected = true;
    }
  }

  @transaction
  selectComponent(element?: FormModel) {
    this.selectedComponent = element;
  }

  @transaction
  selectSchema(schema?: SchemaModel) {
    if (this.selectedElement != null) {
      this.selectedElement.isSelected = false;
    }
    if (this.selectedSchema != null) {
      this.selectedSchema.isSelected = false;
    }

    this.selectedElement = undefined;
    this.selectedSchema = schema;

    if (this.selectedSchema != null) {
      this.selectedSchema.isSelected = true;
    }
  }

  @transaction
  deleteActiveElement() {
    if (this.selectedElement) {
      this.selectedElement.parentElement.removeElement(this.selectedElement);
    }
    this.selectedElement = undefined;
  }

  @transaction
  deleteActiveSchema() {
    if (this.selectedSchema && this.selectedSchema.parentSchema) {
      this.selectedSchema.parentSchema.removeSchema(this.selectedSchema);
    }
    this.selectedSchema = undefined;
  }

  //#endregion Transactions
}
