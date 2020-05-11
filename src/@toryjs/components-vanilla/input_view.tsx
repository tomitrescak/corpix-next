import React from 'react';

import { observer } from 'mobx-react';

import { ToryComponent, resolveComponentProps, setValue, Text } from '@toryjs/ui';
import { BoundType } from '@toryjs/form';

export type InputProps = {
  placeholder: string;
  value: BoundType;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const Input: ToryComponent<InputProps> = props => {
  const componentProps = resolveComponentProps(props);

  if (props.reportOnly) {
    return <Text {...componentProps}>{componentProps.value}</Text>;
  }

  return <input {...componentProps} disabled={props.readOnly} />;
};

export const InputView: ToryComponent<InputProps> = {
  component: observer(Input),
  componentProps(props) {
    return {
      onChange(e) {
        setValue(props, e.currentTarget.value);
      }
    };
  }
};
