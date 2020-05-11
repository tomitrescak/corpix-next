import React from 'react';
import { FormComponentProps, BoundProp } from '@toryjs/form';
import { tryInterpolate, getValue, styled, Link as RouterLink } from '@toryjs/ui';
import { observer } from 'mobx-react';
import { Text } from 'evergreen-ui';
import { ToryComponent, resolveComponentProps } from '@toryjs/ui';

/* =========================================================
    Text
   ======================================================== */

export type TextProps = {
  value: BoundProp;
  emptyLabel?: boolean;
  type?: string;
};

export const TextViewComponent: ToryComponent<TextProps> = props => {
  const { type, value, emptyLabel, ...commonProps } = resolveComponentProps(props);
  let resolved = !value || value.indexOf('${') === -1 ? value : tryInterpolate(value, props.owner);

  return (
    <Text
      is={type || 'span'}
      dangerouslySetInnerHTML={{ __html: resolved }}
      {...commonProps}
    ></Text>
  );
};

TextViewComponent.displayName = 'Text';
export const TextView = observer(TextViewComponent);

export const RichTextView = TextView;

/* =========================================================
    Image
   ======================================================== */

export type ImageProps = {
  src?: string;
  alt: string;
};

export const Image: ToryComponent<ImageProps> = props => {
  const commonProps = resolveComponentProps(props);
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...commonProps} />;
};

export const ImageView = observer(Image);

/* =========================================================
    LINK
   ======================================================== */

export type LinkProps = {
  text: string;
  url: string;
  target: string;
};

export const Link: React.FC<FormComponentProps<LinkProps>> = props => {
  const { url, text, target, ...commonProps } = resolveComponentProps(props);
  const link = tryInterpolate(url, props.owner);
  const isMailLink = link.indexOf('mailto') === 0;

  return React.createElement(
    isMailLink ? 'a' : RouterLink,
    {
      to: isMailLink ? undefined : link,
      href: isMailLink ? link : undefined,
      target,
      ...commonProps
    },
    tryInterpolate(text, props.owner) || '[Link]'
  );
};

export const LinkView = observer(Link);

/* =========================================================
    LINK SELECTOR
   ======================================================== */

export type LinkSelectorProps = {
  source: BoundProp;
  target: string;
  text: string;
  onClick: React.MouseEventHandler;
};

const Pointer = styled.span`
  cursor: pointer;
`;

const LinkSelectorComponent: React.FC<FormComponentProps<LinkSelectorProps>> = props => {
  const { text, ...commonProps } = resolveComponentProps(props);
  return <Pointer {...commonProps}>{tryInterpolate(text || '', props.owner)}</Pointer>;
};

export const LinkSelectorView = {
  component: observer(LinkSelectorComponent),
  componentProps(props: FormComponentProps<LinkSelectorProps>) {
    return {
      onClick() {
        props.owner.setValue(props.formElement.componentProps.target, getValue(props, 'source'));
      }
    };
  }
};
