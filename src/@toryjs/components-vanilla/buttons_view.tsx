import React from 'react';
import { observer } from 'mobx-react';

import { ToryComponent, resolveProps } from '@toryjs/ui';
import { BoundProp } from '@toryjs/form';

export type ButtonProps = {
  onClick?: Any;
  text?: BoundProp<string>;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

export const Button: ToryComponent<ButtonProps> = props => {
  const {
    reportOnly,
    readOnly,
    componentProps: { text, ...componentProps }
  } = resolveProps(props);
  if (reportOnly) {
    return null;
  }
  return (
    <button {...componentProps} disabled={readOnly}>
      {text || '[Button]'}
    </button>
  );
};

export const ButtonView = observer(Button);
