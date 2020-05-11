import * as React from 'react';

import { BoundType } from '@toryjs/form';
import InputMask from 'react-input-mask';

import { parse, parseISO, format } from 'date-fns';

import { ToryComponent, resolveComponentProps, Text, setValue } from '@toryjs/ui';
import { observer } from 'mobx-react';

export type MaskedProps = {
  mask: string;
  placeholder: string;
  dateFormat: string;
  local: boolean;
  value: BoundType;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const backupDate = new Date(1980, 1, 23);

export const MaskedInput: ToryComponent<MaskedProps> = props => {
  let {
    dateFormat,
    local,
    value,
    placeholder,
    mask,
    onChange,
    ...componentProps
  } = resolveComponentProps(props);

  if (dateFormat) {
    value = local
      ? format(parse(value, dateFormat, backupDate), dateFormat)
      : format(parseISO(value), dateFormat);
  }

  if (props.reportOnly) {
    return <Text {...componentProps}>{value}</Text>;
  }

  return (
    <InputMask
      {...componentProps}
      mask={mask}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={props.readOnly}
    />
  );
};

export const MaskedView: ToryComponent<MaskedProps> = {
  component: observer(MaskedInput),
  componentProps(props) {
    return {
      onChange(e) {
        setValue(props, e.currentTarget.value);
      }
    };
  }
};
