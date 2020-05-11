import React from 'react';

import { observer } from 'mobx-react';
import { DataSet, FormElement } from '@toryjs/form';
import { styled } from '../utilities/styled';
import { Icon, minorScale } from 'evergreen-ui';

type ErrorProps = {
  owner: DataSet;
  control?: FormElement;
  source?: string;
  style?: Any;
  newLine?: boolean;
  inline?: boolean;
};

export const StyledErrorLabel = styled.label`
  background-color: #e74c3c;
  /* font-weight: bold; */
  color: white !important;
  margin: 6px 0px;
  border-radius: 4px;
  position: relative;
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 4px;
  opacity: 0.7;

  > * {
    font-weight: bold;
    padding: 4px;
    color: white !important;
  }

  :before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #e74c3c;
    border-width: 6px;
    margin-left: -6px;
  }

  label: StyledErrorLabel;
`;

export const ErrorView = observer(({ owner, source }: ErrorProps) => {
  if (!owner.getError || !source) {
    return null;
  }

  const error: string | null | undefined = source && owner.getError(source);

  if (!error) {
    return null;
  }
  return (
    <div style={{ display: 'inline-block' }}>
      <StyledErrorLabel>
        <Icon icon="warning-sign" color="white" size={16} marginRight={minorScale(1)} /> {error}
      </StyledErrorLabel>
    </div>
  );
});

ErrorView.displayName = 'ErrorView';
