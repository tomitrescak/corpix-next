import * as React from 'react';

import { safeEval, BoundType } from '@toryjs/form';
import { getValue, createComponents, ToryComponent, Text } from '@toryjs/ui';
import { observer } from 'mobx-react';

export type IfProps = {
  exists?: boolean;
  notExists?: boolean;
  biggerThan?: string;
  biggerOrEqualThan?: string;
  smallerThan?: string;
  smallerOrEqualThan?: string;
  equal?: string;
  notEqual?: string;
  expression?: string;
  value?: BoundType;
};

export function evaluate(props: IfProps, owner: Any, value: Any) {
  if (props.exists) {
    return value != null && value !== '';
  } else if (props.notExists) {
    return value == null || value === '';
  } else if (props.equal) {
    return isNaN(props.equal as Any)
      ? value === props.equal
      : parseFloat(value) === parseFloat(props.equal);
  } else if (props.notEqual) {
    return isNaN(props.notEqual as Any)
      ? value !== props.notEqual
      : parseFloat(value) !== parseFloat(props.notEqual);
  } else if (props.biggerThan) {
    return value > parseFloat(props.biggerThan);
  } else if (props.biggerOrEqualThan) {
    return value >= parseFloat(props.biggerOrEqualThan);
  } else if (props.smallerThan) {
    return value < parseFloat(props.smallerThan);
  } else if (props.smallerOrEqualThan) {
    return value <= parseFloat(props.smallerOrEqualThan);
  } else if (props.expression) {
    return safeEval(owner, props.expression, value);
  }
}

export const If: ToryComponent<IfProps> = controlProps => {
  const { formElement, owner } = controlProps;
  const { componentProps: props } = formElement;

  const value = getValue(controlProps);
  try {
    var isTrue = evaluate(props, owner, value);
  } catch (ex) {
    return <Text>Error: {ex.message}</Text>;
  }

  return createComponents({
    ...controlProps,
    formElement: formElement.elements![isTrue ? 0 : 1]
  });
};

export const IfView = observer(If);
