import React from 'react';

import { FormComponentProps, BoundType } from '@toryjs/form';
import { ToryComponent, resolveComponentProps, sourceOfValueProp, valueOfProp } from '@toryjs/ui';
import { observer } from 'mobx-react';

export type CheckBoxProps = {
  checked: BoundType<boolean>;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export function parseChecked(checked: Any, value?: string) {
  if (Array.isArray(checked.items)) {
    return checked.items.indexOf(value) >= 0;
  }
  return checked;
}

export function onChangeHandler(props: FormComponentProps<CheckBoxProps>) {
  return function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checkedSource = props.formElement.componentProps.checked.source;
    if (checkedSource == null) {
      console.error('You need to bind this control!');
      return;
    }
    const schema = props.owner.getSchema(checkedSource);
    if (schema.type === 'array') {
      const checked = e.currentTarget.checked;
      if (checked) {
        props.owner.addRow(checkedSource, props.formElement.componentProps.value);
      } else {
        props.owner.removeRow(checkedSource, props.formElement.componentProps.value);
      }
    } else {
      props.owner.setValue(valueOfProp(props, 'checked'), e.currentTarget.checked);
    }
  };
}

export const CheckboxUnchecked: React.FC = props => (
  <svg
    {...props}
    data-role="checkbox"
    data-checked="false"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="#425A70"
  >
    <path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" />
  </svg>
);
export const CheckboxChecked: React.FC = props => (
  <svg
    {...props}
    data-role="checkbox"
    data-checked="true"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    color="#425A70"
    fill="#425A70"
  >
    <path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z" />
  </svg>
);

export const ReadonlyCheckbox: React.FC<FormComponentProps<CheckBoxProps>> = props => {
  const { value, checked, ...componentProps } = resolveComponentProps(props);
  if (checked) {
    return <CheckboxChecked {...componentProps} />;
  }
  return <CheckboxUnchecked {...componentProps} />;
};

export const Checkbox: React.FC<FormComponentProps<CheckBoxProps>> = props => {
  if (props.reportOnly) {
    return <ReadonlyCheckbox {...props} />;
  }

  const { value, checked, ...componentProps } = resolveComponentProps(props);

  return (
    <input
      type="checkbox"
      disabled={props.readOnly}
      checked={parseChecked(checked, value)}
      {...componentProps}
    />
  );
};

export const CheckboxView: ToryComponent<CheckBoxProps> = {
  component: observer(Checkbox),
  componentProps(props) {
    return {
      onChange: onChangeHandler(props)
    };
  }
};
