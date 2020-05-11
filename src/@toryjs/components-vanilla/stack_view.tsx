import * as React from 'react';

import { observer } from 'mobx-react';

import { FormComponentProps } from '@toryjs/form';
import { resolveComponentProps, createComponents, styled } from '@toryjs/ui';

export type StackProps = {
  layout: 'row' | 'column';
  gap: string;
  padding: string;
  final: boolean;
};

const StackComponent: React.FC<FormComponentProps<StackProps>> = props => {
  const componentProps = resolveComponentProps(props);

  const Stack = styled.div`
    align-items: center;
    display: ${componentProps.layout === 'row' ? 'flex' : 'block'};
    > * {
      padding: ${componentProps.padding};
      margin: ${componentProps.gap};
    }
    label: Stack;
  `;

  return <Stack>{createComponents(props)}</Stack>;
};

export const StackView = observer(StackComponent);
