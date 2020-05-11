import React from 'react';
import { ToryComponent, resolveComponentProps, createComponents } from '@toryjs/ui';

export type HtmlFormProps = {
  onSubmit: string | React.FormEventHandler | Any;
};

export const HtmlFormComponent: ToryComponent<HtmlFormProps> = props => {
  const componentProps = resolveComponentProps(props);

  return <form {...componentProps}>{createComponents(props)}</form>;
};
