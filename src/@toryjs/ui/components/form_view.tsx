import * as React from 'react';

import { FormElement, FormComponentProps } from '@toryjs/form';
import { observer } from 'mobx-react';
import { ToryComponent } from './dynamic_component';
import { simpleHandle } from '../utilities/data_utilities';
import { createComponents, resolveComponentProps } from '../utilities/component_utilities';

export interface IFieldOwner {
  elements?: FormElement[];
}

type Props = {
  onCreate?: string;
  pageId?: string;
};

const FormViewComponent: ToryComponent<Props> = props => {
  const { pageId, onCreate, ...componentProps } = resolveComponentProps(props);

  let { formElement, owner } = onCreate ? simpleHandle(props, onCreate) : props;

  if (pageId) {
    formElement = props.formElement.components!.find(p => p.uid === pageId);
    if (!formElement) {
      return <div {...componentProps}>Page &quot;{pageId}&quot; does not exist!</div>;
    }
  }

  if (!formElement || !formElement.elements) {
    return <div {...componentProps}>Form is empty ¯\_(ツ)_/¯</div>;
  }

  const childProps: FormComponentProps = {
    ...props,
    formElement,
    owner
  };

  return <div {...componentProps}>{createComponents(childProps)}</div>;
};

FormViewComponent.displayName = 'FormViewComponent';

export const Form = observer(FormViewComponent);
