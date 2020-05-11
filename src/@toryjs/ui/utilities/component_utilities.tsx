import React from 'react';
import { DynamicComponent } from '../components/dynamic_component';
import { FormComponentProps, BoundProp, CommonComponentProps, FormElement } from '@toryjs/form';

import { handle, getPropValue } from './data_utilities';
import names from 'classnames';

export { default as names } from 'classnames';

type Resolved<T> = {
  [P in keyof T]: T[P] extends BoundProp<infer U> ? U : T[P];
};

export function resolveProps<T>(
  props: FormComponentProps<T>
): Required<FormComponentProps<Resolved<T>>> {
  if (props.dynamicProps!.length === 0) {
    return props as Any;
  }

  return { ...props, componentProps: resolveComponentProps(props) } as Any;
}

export function resolveComponentProps<T>(
  props: FormComponentProps<T>
): Resolved<T> & CommonComponentProps {
  if (props.dynamicProps!.length === 0) {
    return props.componentProps as Any;
  }

  const componentProps: Any = { ...props.componentProps };

  for (const key of props.dynamicProps!) {
    if (key === 'style') {
      continue;
    }
    // console.log('Resolving dynamic prop: ' + key);
    componentProps[key] = getPropValue(props, componentProps[key], props.formElement);
  }
  return componentProps;
}

const eventReg = /^on[A-Z]/;

/**
 * Combines events and executes both if event was defined both in element and in component props
 * @param props
 * @param context
 */
export function combineProps(props: FormComponentProps, dynamicClassName?: string) {
  const { formElement, componentProps, containerProps, ...rest } = props as Any;
  const result: Any = { ...containerProps, ...formElement.componentProps, ...componentProps };
  const dynamicProps: string[] = [];

  // replace all base events so that any even coming from formComponent or component is executed
  for (const key of Object.keys(result)) {
    if (eventReg.test(key)) {
      result[key] = (e: React.SyntheticEvent) => {
        // execute component event
        if (componentProps && componentProps[key]) {
          componentProps[key](e);
        }

        // execute form component event
        if (containerProps && containerProps[key]) {
          containerProps[key](e);
        }

        // execute handler
        if (formElement.componentProps && formElement.componentProps[key]) {
          handle({
            handlers: props.handlers,
            prop: formElement.componentProps[key],
            handleName: undefined,
            owner: props.owner,
            props: props,
            formElement: props.formElement,
            args: {
              e
            }
          });
        }
      };
    } else if (typeof result[key] === 'object' && !Array.isArray(result[key])) {
      dynamicProps.push(key);
    }
  }

  // common props hold what should every control have

  const style = combine(
    containerProps?.style,
    formElement.componentProps.style,
    componentProps?.style
  );
  if (style) {
    result.style = style;
  }

  const className =
    names(
      containerProps?.className,
      formElement.componentProps.className,
      componentProps?.className,
      dynamicClassName
    ) || undefined;
  if (className) {
    result.className = className;
  }

  if (result.css) {
    delete result.css;
  }

  // OPTIMISATION STEP
  return { ...rest, formElement, componentProps: result, dynamicProps };
}

const empty = {};

export function createComponent(props: FormComponentProps, formElement?: FormElement) {
  return (
    <DynamicComponent
      {...props}
      componentProps={empty}
      formElement={formElement || props.formElement}
    />
  );
}

type Props = {
  EmptyCell?: Any;
};

export function createComponents<T>(
  props: FormComponentProps<T & CommonComponentProps> & Props
): Any {
  if (!props.formElement.elements || props.formElement.elements.length === 0) {
    // editor specific render
    if (props.EmptyCell) {
      return <props.EmptyCell {...props} className={props.componentProps?.className} />;
    }
    return null;
  }

  // common render
  return props.formElement.elements.map((e, i) => (
    <DynamicComponent key={i} {...props} formElement={e} componentProps={{}} />
  ));
}

// ##### PRIVATE

function combine(...objects: Any[]) {
  const result = objects.reduce((prev, next) => Object.assign(prev, next), {});
  return Object.keys(result).length > 0 ? result : undefined;
}

function addClassName(props: FormComponentProps<Any>, className: string) {
  return names(props.componentProps?.className, className);
}

function addStyle(props: FormComponentProps<Any>, style: Any) {
  return { ...props.componentProps?.style, ...style };
}

function addEvents(props: FormComponentProps, events: Any) {
  if (!events) {
    return undefined;
  }
  for (const key of Object.keys(events)) {
    if ((props.componentProps as Any)[key]) {
      events[key] = (e: Any) => {
        events[key](e);
        (props.componentProps as Any)(e);
      };
    }
  }
  return events;
}

type ExtendedProps = {
  className?: string;
  style?: Any;
  onClick?: React.MouseEventHandler<Any>;
  onMouseOver?: React.MouseEventHandler<Any>;
  onMouseOut?: React.MouseEventHandler<Any>;
};

function addProps<T>(props: FormComponentProps<T>, extraProps: ExtendedProps): T & ExtendedProps {
  const { className, style, ...rest } = extraProps;
  var componentProps: Any = { ...props.componentProps, ...addEvents(props, rest) };
  if (className) {
    componentProps.className = addClassName(props, className);
  }
  if (style) {
    componentProps.style = addStyle(props, style);
  }
  return componentProps;
}

const commonKeys = ['id', 'data-control', 'style', 'className'];
export function extractProps<T, U extends keyof T>(
  obj: T,
  keys: U[]
): Pick<T, U> & CommonComponentProps {
  const result: Any = {};
  const workKeys = keys.length ? keys.concat(commonKeys as Any) : commonKeys;
  for (const key of workKeys) {
    if ((obj as Any)[key]) {
      result[key] = (obj as Any)[key];
    }
  }
  return result;
}

function removeProps<T, U extends keyof T>(obj: T, keys: U[]): Omit<T, U> {
  if (!keys || keys.length === 0) {
    return obj;
  }
  return Object.keys(obj).reduce((newObject: Any, key) => {
    if (keys.indexOf(key as Any) === -1) newObject[key] = (obj as Any)[key];
    return newObject;
  }, {});
}
