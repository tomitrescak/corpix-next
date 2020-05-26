import { DataSet } from './dataset_model';
import { observable } from 'mobx';
import { FormElement, ContainerProps } from '../form_definition';
import { transaction } from '../undo-manager/manager';
import { JSONSchema, schemaOfContainerProps, schemaOfFormModel } from '../json_schema';
import { SchemaUseReference } from './schema_reference';
import { PropModel } from './prop_model';
import { buildPropsDataModel } from '../builders/props_builder';

type SchemaLookup = (control: string) => JSONSchema;

export class FormModel<P = Any> extends DataSet<FormModel<Any>> {
  uid: string;
  control: string;
  tuple?: string;
  group?: string;
  bound?: boolean;
  @observable componentProps: DataSet<P> & { [index: string]: PropModel };
  @observable containerProps: DataSet<ContainerProps>;
  @observable elements: FormModel<Any>[] = [];
  @observable components: FormModel<Any>[] = [];

  @observable readonly documentation?: string;
  @observable private _isSelected: boolean;

  private _schemaLookup?: SchemaLookup;
  private _schemaReferences?: SchemaUseReference[];

  // CONSTRUCTOR

  constructor(form: FormElement, parent: DataSet, schemaLookup?: SchemaLookup) {
    super(schemaOfFormModel, parent);

    this._schemaLookup = schemaLookup;
    this._isSelected = false;

    this.uid = form.uid;
    this.control = form.control;
    this.tuple = form.tuple;
    this.group = form.group;
    this.bound = form.bound;

    this.parent = parent;
    this.documentation = form.documentation;

    if (this.parent == null || !(this.parent instanceof FormModel)) {
      this._schemaReferences = [];
    }

    this.containerProps = buildPropsDataModel(form.containerProps, schemaOfContainerProps, this);

    if (form.components) {
      this.components = form.components.map(e => new FormModel(e, this));
    } else {
      this.components = [];
    }
    if (form.elements) {
      this.elements = form.elements.map(e => new FormModel(e, this));
    } else {
      this.elements = [];
    }

    this.componentProps = buildPropsDataModel(
      form.componentProps,
      this.schemaLookup(this.control),
      this
    );
  }

  // PROPERTIES

  get rootForm(): FormModel {
    return this.parent == null || !(this.parent instanceof FormModel) ? this : this.parent.rootForm;
  }

  get parentElement(): FormModel {
    if (this.parent != null && this.parent instanceof FormModel) {
      return this.parent;
    }
    throw new Error('There is no parent form');
  }

  get schemaLookup(): SchemaLookup {
    return this.rootForm._schemaLookup!;
  }

  get schemaReferences(): SchemaUseReference[] {
    return this.rootForm._schemaReferences!;
  }

  get isSelected() {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this.setRawValue('_isSelected' as Any, value);
  }

  // TRANSACTIONS

  @transaction
  changeParent(newParent: FormModel, index?: number) {
    if (this.parent == null) {
      return;
    }
    // remove from current
    this.parentElement.removeElement(this);

    // add to new parent
    if (index != null) {
      newParent.removeRowByIndex('elements', index);
    } else {
      newParent.addRow('elements', this);
    }
    this.parent = newParent;
  }

  @transaction
  addSchemaReference(reference: SchemaUseReference) {
    this.addRawRow('schemaReferences', reference);
  }

  @transaction
  removePropReferences(prop: PropModel) {
    const invalidReferences = this.schemaReferences.filter(f => f.prop == prop);
    for (let reference of invalidReferences) {
      this.removeRow('schemaReferences', reference);
    }
  }

  @transaction
  removeElementReferences(element: FormModel) {
    const invalidReferences = this.schemaReferences.filter(f => f.element == element);
    for (let reference of invalidReferences) {
      this.removeRow('schemaReferences', reference);
    }
  }

  @transaction
  addComponent(element: FormElement): FormModel {
    return this.addRow('components', new FormModel(element, this));
  }

  @transaction
  removeComponent(element: FormModel<Any>) {
    this.rootForm.removeElementReferences(element);
    const index = this.elements.findIndex(e => e === element);
    this.removeRowByIndex('components', index);
  }

  @transaction
  addElement(element: FormElement) {
    this.addRow('elements', new FormModel(element, this));
  }

  @transaction
  insertElement(index: number, element: FormElement) {
    this.insertRow('elements', index, new FormModel(element, this));
  }

  @transaction
  removeElement(element: FormModel<Any>) {
    // remove from references
    this.rootForm.removeElementReferences(element);

    const index = this.elements.findIndex(e => e === element);
    this.removeRowByIndex('elements', index);
  }

  @transaction
  removeElementByIndex(index: number) {
    // remove from references
    const element = this.elements[index];
    this.rootForm.removeElementReferences(element);
    this.removeRowByIndex('elements', index);
  }

  @transaction
  replaceElement(index: number, element: FormElement) {
    const newElement = new FormModel(element, this, this.schemaLookup);
    this.replaceRow('elements', index, newElement);
  }

  // UTILITIES

  findElementById(id: string): FormModel | undefined {
    if (this.uid === id) {
      return this;
    }
    if (this.elements != null) {
      for (let element of this.elements) {
        const child = element.findElementById(id);
        if (child) {
          return child;
        }
      }
    }
    return undefined;
  }

  toJS(): FormElement {
    return super.toJS();
  }
}
