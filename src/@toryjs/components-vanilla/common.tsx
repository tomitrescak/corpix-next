import React from 'react';
import { Icon, IconName } from 'evergreen-ui';

export type ReactComponent = string | React.ComponentType<any>;

export function createIcon(name: IconName, control: string) {
  return {
    universal: <Icon icon={name} title={control} />
  };
}
