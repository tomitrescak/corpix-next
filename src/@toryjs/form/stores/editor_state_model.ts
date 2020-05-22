import { undoable } from '../utilities/decorators';
import { SchemaModel } from './schema_model';
import { FormModel } from './form_model';
import { transaction } from '../undo-manager/manager';
import { DataSet } from './dataset_model';
import { JSONSchema } from '../json_schema';

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
  @undoable selectedSchema?: SchemaModel;
  @undoable selectedElement?: FormModel;
  @undoable selectedComponent?: FormModel;
  @undoable leftPane = 'outline';

  // TRANSACTIONS

  constructor(parent: DataSet) {
    super(stateModelSchema, parent);
  }

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
    if (this.selectedSchema && this.selectedSchema.parent) {
      this.selectedSchema.parentSchema.removeSchema(this.selectedSchema);
    }
    this.selectedSchema = undefined;
  }
}
