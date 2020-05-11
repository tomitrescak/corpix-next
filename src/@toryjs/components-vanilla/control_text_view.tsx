import React from 'react';
import { resolveComponentProps, styled } from '@toryjs/ui';
import { FormComponentProps } from '@toryjs/form';

const ReadOnlyControl = styled.span`
  margin: 8px 0px 12px 0px;
`;

type ReadOnlyProps = FormComponentProps & {
  value: Any;
};

export const ReadonlyInput: React.FC<ReadOnlyProps> = props => {
  const { style, className } = resolveComponentProps(props);
  return (
    <ReadOnlyControl style={style} className={className}>
      {props.value}
    </ReadOnlyControl>
  );
};
