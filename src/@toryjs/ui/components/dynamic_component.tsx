import React from 'react';

import { Tooltip, Icon } from 'evergreen-ui';
import { observer } from 'mobx-react';
import { ClassNames } from '@emotion/core';

import { FormComponentProps, CommonComponentProps } from '@toryjs/form';
import { getContainerValue, sourceOfValueProp } from '../utilities/data_utilities';
import { combineProps, createComponents } from '../utilities/component_utilities';

import { ErrorView } from './error_view';
import { Label, Error } from './dynamic_component.styles';
import { styled } from '../utilities/styled';

type ToryComponentDefinition<T> = {
  component: React.FC<FormComponentProps<T>>;
  componentProps: (props: FormComponentProps<T>) => Partial<T>;
};

export type ToryComponent<T, U = {}> =
  | React.FC<FormComponentProps<T> & U>
  | ToryComponentDefinition<T & CommonComponentProps>;

export type ControlProps = FormComponentProps & {
  containerProps: Any;
  css?: string;
  children?: Any;
};

const inline = `
  display: flex;
  align-items: center;
  label: Inline;
`;

function renderLabel(
  props: FormComponentProps,
  before: string | undefined,
  label: string,
  documentation?: string
) {
  return (
    <Label is="label" before={before} htmlFor={props.formElement.uid}>
      {label}
      <If condition={documentation != null && !props.readOnly}>
        <Tooltip
          content={
            <span
              style={{ color: 'white' }}
              dangerouslySetInnerHTML={{ __html: documentation! }}
            ></span>
          }
          showDelay={300}
        >
          <Icon icon="info-sign" className="noPrint" />
        </Tooltip>
      </If>
    </Label>
  );
}

function renderControl(controlDefinition: Any, props: ControlProps) {
  // With Dynamic style
  if (props.css) {
    const originalControlDefinition = controlDefinition;
    const StyledDefinition = () => (
      <ClassNames>
        {({ css }) => {
          const className = css([props.css]);
          const combined = combineProps(props, className);
          return React.createElement(
            originalControlDefinition || 'div',
            combined,
            createComponents(props)
          );
        }}
      </ClassNames>
    );
    controlDefinition = StyledDefinition;
  }

  // without fynamic style
  const combined = combineProps(props);
  return React.createElement(controlDefinition || 'div', combined, createComponents(props));
}

function renderError(props: FormComponentProps) {
  return (
    <ErrorView
      inline={props.formElement.containerProps.inline}
      owner={props.owner}
      source={sourceOfValueProp(props.formElement)}
    />
  );
}

export const DynamicComponentInner: React.FC<FormComponentProps> = props => {
  const formElement = props.formElement;

  const hide = getContainerValue(props, 'hidden', false);

  // check whether we will render this component
  if (hide || !formElement || formElement.control === 'EditorCell') {
    return null;
  }

  if (props.catalogue.components[formElement.control] === undefined) {
    return <Error>Component does not exist: &quot;{formElement.control}&quot;</Error>;
  }

  const label = getContainerValue(props, 'label');
  const { documentation, labelPosition = 'before' } = formElement.containerProps;
  const readOnly = props.readOnly || getContainerValue(props, 'readOnly', false);
  let controlDefinition = props.catalogue.components[formElement.control];
  if (controlDefinition.component) {
    var componentProps = controlDefinition.componentProps(props);
    controlDefinition = controlDefinition.component;
  }

  // decides whether a binding helper is displayed
  const hasContainer = label || props.children;

  // create container styles and combine props
  const id = props.formElement.uid;
  const containerProps: Any = {
    'data-control': props.formElement.control,
    id
  };
  if (formElement.containerProps.style) {
    containerProps.style = formElement.containerProps.style;
  }
  if (formElement.containerProps.className) {
    containerProps.className = formElement.containerProps.className;
  }

  // create styled version of the control
  if (hasContainer) {
    const Container = styled.div`
      ${formElement.containerProps.css}
      ${props.formElement.containerProps.inline ? inline : ''}
    `;

    return (
      <Container {...containerProps} id={undefined}>
        {label && labelPosition === 'before' && renderLabel(props, 'before', label, documentation)}
        {renderControl(controlDefinition, {
          ...props,
          componentProps,
          containerProps: { id },
          readOnly,
          uid: props.formElement.uid,
          css: props.formElement.componentProps.css
        })}
        {label && labelPosition === 'after' && renderLabel(props, undefined, label, documentation)}
        {renderError(props)}
      </Container>
    );
  }

  return (
    <>
      {renderControl(controlDefinition, {
        ...props,
        componentProps,
        containerProps,
        readOnly,
        css:
          (props.formElement.containerProps.css || '') +
          (props.formElement.componentProps.css || '')
      })}
      {renderError(props)}
    </>
  );
};

DynamicComponentInner.displayName = 'DynamicComponent';
export const DynamicComponent = observer(DynamicComponentInner);
