import * as React from 'react';

import { createComponents, ToryComponent } from '@toryjs/ui';
import { observer } from 'mobx-react';

export type AuthItemProps = {
  roles: string[];
  disable: boolean;
};

export const AuthItemView: ToryComponent<AuthItemProps> = props => {
  const { roles } = props.formElement.componentProps;

  if (props.context.authorisation == null) {
    return null;
  }

  if (
    !props.context.authorisation.user ||
    (roles &&
      roles.every((r: string) => !props.context.authorisation!.user!.roles.some(u => u === r)))
  ) {
    return null;
  }
  return createComponents(props);
};

export const AuthItem = observer(AuthItemView);
