import {
  FormComponentProps,
  BoundProp,
  BoundType,
  FormElement,
  safeEval,
  ContainerProps,
  Handlers,
  DataSet
} from '@toryjs/form';

export function getValue<P>(
  props: FormComponentProps<P>,
  propName: keyof P = 'value' as Any,
  defaultValue?: Any
): Any {
  return getPropValue(
    props,
    props.formElement.componentProps[propName],
    props.formElement,
    defaultValue
  );
}

export function getContainerValue<P>(
  props: FormComponentProps<P>,
  propName: keyof ContainerProps,
  defaultValue?: Any
): Any {
  return getPropValue(
    props,
    props.formElement.containerProps[propName],
    props.formElement,
    defaultValue
  );
}

export function getPropValue(
  props: FormComponentProps,
  prop: BoundProp,
  formElement: FormElement,
  defaultValue?: string
) {
  if (prop == null) {
    return defaultValue;
  }
  if (typeof prop !== 'object' || Array.isArray(prop)) {
    return prop;
  }
  if (prop.value != null) {
    console.log(prop.value);
    return prop.value;
  } else if (prop.handler) {
    return handle({
      handlers: props.handlers,
      prop,
      handleName: prop.handler,
      owner: props.owner,
      props,
      formElement: props.formElement,
      args: prop.args
    });
  } else if (prop.dynamicHandler) {
    try {
      return safeEval({ ...props, ...prop.args }, prop.dynamicHandler, props.owner);
    } catch (ex) {
      if ((formElement as Any).getValue) {
        (formElement as Any).getValue('props').setError(prop.name, ex.message);
      } else {
        console.error(ex);
      }
    }
  } else if (prop.source && props.owner) {
    return props.owner.getValue(prop.source);
  }
  // else if (prop.dataSource) {
  //   if (prop.source === 'dataPropFirst') {
  //     return props.dataProps && props.dataProps.first;
  //   } else if (prop.source === 'dataPropData') {
  //     return props.dataProps && props.dataProps.data;
  //   }
  // }
  return defaultValue === null ? '' : defaultValue;
}

export function setValue<C>(
  props: FormComponentProps<C>,
  value: any,
  propName: keyof C = 'value' as Any,
  path = ''
) {
  setPropValue(props, props.formElement.componentProps, props.owner, value, propName, path);
}

export function setPropValue<C>(
  props: FormComponentProps<Any>,
  source: C,
  owner: DataSet,
  value: any,
  propName: keyof C = 'value' as Any,
  path = ''
) {
  const prop: BoundProp = source[propName];
  if (prop == null) {
    return;
  }

  if (typeof prop !== 'object') {
    owner.setValue(propName!, value);
  } else {
    if (prop.parse) {
      handle({
        handlers: props.handlers,
        prop,
        handleName: prop.parse,
        owner: props.owner,
        props,
        formElement: props.formElement,
        args: {
          current: value,
          previous: getPropValue(props, source[propName], props.formElement)
        }
      });
      return;
    }

    // if (prop.validate) {
    //   let error = handle(props.handlers, prop.validate, props.owner, props, context, value);
    //   if (error) {
    //     return error;
    //   }
    // }

    if (prop.source) {
      if (prop.validate && !(props.handlers[prop.validate] as any)) {
        return;
      }
      owner.setValue(prop.source as keyof C, path ? { [path]: value } : value);
    } else if (prop.handler || prop.dynamicHandler) {
      handle({
        handlers: props.handlers,
        prop,
        handleName: prop.handler,
        owner: props.owner,
        props,
        formElement: props.formElement,
        args: value
      });
    }
  }
}

export function simpleHandle<T>(props: FormComponentProps, prop: BoundType | string, args?: Any) {
  prop = typeof prop === 'string' ? { handler: prop } : prop;
  return handle({
    handlers: props.handlers,
    formElement: props.formElement,
    owner: props.owner,
    prop,
    handleName: prop.handler,
    props,
    args
  });
}

type HandlerProps<T> = {
  handlers: Handlers<DataSet<T>> | null | undefined;
  prop: BoundType | string;
  handleName: string | undefined;
  owner: DataSet<T>;
  props: FormComponentProps<T>;
  formElement: FormElement<T>;
  args?: Any;
};

export function handle<T>({
  handlers,
  prop,
  handleName,
  owner,
  props,
  formElement,
  args
}: HandlerProps<T>) {
  prop = typeof prop === 'string' ? { handler: prop } : prop;
  handleName = handleName || prop.handler;

  if (prop.dynamicHandler) {
    try {
      safeEval(props, prop.dynamicHandler, props.owner);
    } catch (ex) {
      console.error(ex);
      alert('Error in dynamic handler: ' + ex.message);
    }
    return;
  }
  if (!handleName) {
    throw new Error('This is not a handled prop!');
  }
  if (!handlers) {
    throw new Error('No handlers defined for this project!');
  }
  if (!handlers[handleName!]) {
    // eslint-disable-next-line jsx-control-statements/jsx-jcs-no-undef
    console.error('Handler does not exist: ' + handleName);
    return;
  }
  return handlers && handlers[handleName]
    ? handlers[handleName]({ owner, props, formElement, args })
    : null;
}

/**
 * Returns the bound value of the prop, by default 'source'
 * @param source Props
 * @param propName Name of the property
 * @param type One of 'source' | 'value' | 'handler' = 'source'
 */
export function valueOfProp<C>(
  source: FormComponentProps<C>,
  propName: keyof C = 'value' as any,
  type: 'source' | 'value' | 'handler' = 'source'
) {
  return source.formElement.componentProps[propName]
    ? (source.formElement.componentProps[propName] as Any)[type]
    : null;
}

export function isNullOrEmpty(val: any) {
  return val === null || val === undefined || val === '';
}

/**
 * Value of the "source" property of the "value" prop
 * @param source
 */
export function sourceOfValueProp<C extends { value?: BoundType; checked?: BoundType }>(
  formElement: FormElement<C>
) {
  return formElement.componentProps.value?.source || formElement.componentProps.checked?.source;
}
