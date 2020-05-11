import * as React from 'react';

import {
  ToryComponent,
  createComponents,
  resolveComponentProps,
  extractProps,
  styled
} from '@toryjs/ui';
import { observer } from 'mobx-react';

export type Props = {
  EmptyCell?: React.FC;
};

export type FlexProps = {
  gap: string;
  wrap: Any;
  layout: Any;
  justifyContent: string;
  alignItems: string;
  alignContent: string;
};

const FlexComponent: ToryComponent<FlexProps, Props> = props => {
  const componentProps = extractProps(resolveComponentProps(props), []);

  const Flex = styled.div`
    > * {
      margin: ${props.formElement.componentProps.gap};
    }

    display: flex;
    flex-wrap: ${props.formElement.componentProps.wrap};
    flex-direction: ${props.formElement.componentProps.layout};
    justify-content: ${props.formElement.componentProps.justifyContent};
    align-items: ${props.formElement.componentProps.alignItems};
    align-content: ${props.formElement.componentProps.alignContent};

    label: ${props.formElement.componentProps.layout === 'column' ? 'column-layout' : 'row-layout'};
  `;

  return <Flex {...componentProps}>{createComponents(props)}</Flex>;
};

export const FlexView: ToryComponent<FlexProps> = observer(FlexComponent);
