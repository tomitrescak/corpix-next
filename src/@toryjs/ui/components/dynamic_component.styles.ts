import { styled } from '../utilities/styled';
import { Text } from 'evergreen-ui';

type LabelProps = {
  breaking?: string;
  before?: string;
};

export const Label = styled(Text)<LabelProps>`
  margin-top: 3px;
  margin-bottom: 3px;
  display: block;
  font-weight: bold;

  margin-left: ${props => (props.before ? '0px' : '')};
  margin-right: ${props => (!props.before ? '4px' : '')};
`;

export const Error = styled(Text)`
  background: red;
  padding: 3px;
  border-radius: 3px;
  font-weight: bold;
  color: white;
`;
