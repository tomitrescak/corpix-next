import * as React from 'react';

import { observer } from 'mobx-react';

import { ToryComponent, resolveComponentProps, Text } from '@toryjs/ui';
import { safeEval } from '@toryjs/form';

export type FormulaProps = {
  formula: string;
};

const FormulaComponent: ToryComponent<FormulaProps> = props => {
  const { formula, ...commonProps } = resolveComponentProps(props);
  let value;

  try {
    value = safeEval(props.owner, formula, props.owner);

    if (value != null && typeof value == 'object') {
      value = '[Object Results are not allowed]';
    }
  } catch (ex) {
    return ex.message;
  }

  return (
    <Text {...commonProps}>
      {value == null ? (props.catalogue.isEditor ? '#Formula' : '') : value}
    </Text>
  );
};

export const FormulaView = observer(FormulaComponent);
