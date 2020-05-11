import React from 'react';

import { observer } from 'mobx-react';
import { Option } from '@toryjs/form';
import { setValue, resolveComponentProps, ToryComponent, Text, styled } from '@toryjs/ui';
import { BoundType } from '@toryjs/form/form_definition';

export type RadioProps = {
  options: Option[];
  vertical: boolean;
  value: BoundType;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const ReportRadio: ToryComponent<RadioProps> = props => {
  const { options, value, vertical, ...componentProps } = resolveComponentProps(props);
  const selected = value ? options.find(o => o.value === value) : null;
  return <Text {...componentProps}>{selected?.label}</Text>;
};

export const Radio: ToryComponent<RadioProps> = props => {
  if (props.reportOnly) {
    return <ReportRadio {...props} />;
  }

  const {
    options,
    vertical,
    onChange,
    value,
    style,
    className,
    ...componentProps
  } = resolveComponentProps(props);

  return (
    <div
      {...componentProps}
      style={{ display: props.formElement.componentProps.vertical ? '' : 'flex' }}
    >
      {options.map((item: Option) => (
        <RadioGroup key={item.value || '---'} style={style} className={className}>
          <input
            type="radio"
            onChange={onChange}
            id={item.value}
            value={item.value}
            checked={value === item.value}
            disabled={props.readOnly}
          />
          <Text is="label" htmlFor={item.value}>
            {item.label}
          </Text>
        </RadioGroup>
      ))}
    </div>
  );
};

export const RadioView: ToryComponent<RadioProps> = {
  component: observer(Radio),
  componentProps(props) {
    return {
      onChange(e) {
        setValue(props, e.currentTarget.value);
      }
    };
  }
};
