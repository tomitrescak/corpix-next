import { DataSet } from './dataset_model';
import { observable } from 'mobx';
import { FormElement, ContainerProps } from '../form_definition';
import { transaction } from '../undo-manager/manager';
import { JSONSchema, schemaOfContainerProps } from '../json_schema';
import { buildDataModel } from './dataset_builder';

type SchemaLookup = (control: string) => JSONSchema;

export class FormModel<P = Any> extends DataSet<FormModel<Any>> {
  uid: string;
  control: string;
  tuple?: string;
  group?: string;
  bound?: boolean;
  @observable documentation?: string;
  @observable componentProps: DataSet<P>;
  @observable containerProps: DataSet<ContainerProps>;
  @observable elements: FormModel<Any>[] = [];
  @observable isSelected: boolean;

  parent: FormModel;

  private _schemaLookup?: SchemaLookup;

  // CONSTRUCTOR

  constructor(form: FormElement, parent: FormModel, schemaLookup?: SchemaLookup) {
    super({}, parent);

    this._schemaLookup = schemaLookup;

    this.uid = form.uid;
    this.control = form.control;
    this.tuple = form.tuple;
    this.group = form.group;
    this.bound = form.bound;
    this.documentation = form.documentation;
    this.componentProps = buildDataModel(form.componentProps, this.schemaLookup(this.control));
    this.containerProps = buildDataModel(form.containerProps, schemaOfContainerProps);
    this.isSelected = false;
    this.parent = parent;
  }

  // PROPERTIES

  get rootForm(): FormModel {
    return this.parent == null || !(this.parent instanceof FormModel) ? this : this.parent.rootForm;
  }

  get schemaLookup(): SchemaLookup {
    return this.rootForm._schemaLookup!;
  }

  // TRANSACTIONS

  @transaction
  changeParent(newParent: FormModel, index?: number) {
    if (this.parent == null) {
      return;
    }
    // remove from current
    this.parent.removeElement(this);

    // add to new parent
    if (index != null) {
      newParent.removeRowByIndex('elements', index);
    } else {
      newParent.addRow('elements', this);
    }
    this.parent = newParent;
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
  removeElement(element: FormElement) {
    // remove from references
    this.form.schemaReferences = this.form.schemaReferences.filter(f => f.element !== element);

    const index = this.elements.findIndex(e => e === element);
    this.elementsRefs!.splice(index, 1);
  }

  @transaction
  removeElementByIndex(index: number) {
    // remove from references
    const element = this.elements[index];
    this.form.schemaReferences = this.form.schemaReferences.filter(f => f.element !== element);
    this.elementsRefs!.splice(index, 1);
  }

  @transaction
  setSelected(selected: boolean) {
    this.isSelected = selected;
  }

  // UTILITIES

  toJS(): FormElement {
    return {
      uid: this.uid,
      control: this.control,
      tuple: this.tuple,
      group: this.group,
      bound: this.bound,
      documentation: this.documentation,
      componentProps: this.componentProps.toJS(),
      containerProps: this.containerProps.toJS(),
      elements: this.elements.map(e => e.toJS())
    };
  }
}
