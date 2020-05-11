import React from 'react';

import { BoundProp } from '@toryjs/form';
import { tryInterpolate, Text, resolveComponentProps, ToryComponent } from '@toryjs/ui';
import marked from 'marked';

export type MarkdownProps = {
  value: BoundProp;
};

export const MarkdownComponent: ToryComponent<MarkdownProps> = props => {
  const { value = '', ...componentProps } = resolveComponentProps(props);

  let parsedText = '';
  try {
    parsedText = tryInterpolate(value.replace(/`/g, '\\`'), props.owner);
  } catch (ex) {
    parsedText = '<b style="color: red">Error: </b>' + ex.message;
  }
  return <Text {...componentProps} dangerouslySetInnerHTML={{ __html: marked(parsedText) }} />;
};
