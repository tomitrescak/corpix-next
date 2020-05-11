import React from 'react';
import { FormComponentProps, BoundProp } from '@toryjs/form';

import { resolveComponentProps, Text } from '@toryjs/ui';

import { parse, parseISO, format as formatDate } from 'date-fns';

export type DateProps = {
  value: BoundProp<string>;
  format: string;
  local: boolean;
};

const backupDate = new Date(1980, 1, 23);

export const DateView: React.FC<FormComponentProps<DateProps>> = props => {
  const { value, format, local, ...componentProps } = resolveComponentProps(props);

  let date: string | null = '';

  try {
    date = value
      ? local
        ? formatDate(parse(value, format, backupDate), format)
        : formatDate(parseISO(value), format)
      : null;
  } catch (ex) {
    try {
      date = formatDate(new Date(value), format);
    } catch {
      return <Text {...componentProps}>{`Invalid${local ? '' : ' Iso'} Date`}</Text>;
    }
  }

  return <Text {...componentProps}>{date || ''}</Text>;
};
