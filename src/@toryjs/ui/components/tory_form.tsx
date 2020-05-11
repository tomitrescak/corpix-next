import React from 'react';

import { Handlers, JSONSchema, DataSet, FormElement, ToryFormContext } from '@toryjs/form';
import { DynamicComponent } from './dynamic_component';
import { Context, context } from '../context/form_context';

type Props = {
  form: FormElement;
  schema: JSONSchema;
  owner: DataSet;
  catalogue: Any;
  handlers: Handlers<Any, Any>;
  context?: ToryFormContext;
  readOnly?: boolean;
  reportOnly?: boolean;
};

export const ToryForm: React.FC<Props> = props => {
  if (!props.form) {
    return <div>Form has no form model ...</div>;
  }

  const currentContext = props.context || context;

  return (
    <Context.Provider context={currentContext}>
      <DynamicComponent {...props} context={currentContext} formElement={props.form} />
    </Context.Provider>
  );
};

ToryForm.displayName = 'ToryForm';
