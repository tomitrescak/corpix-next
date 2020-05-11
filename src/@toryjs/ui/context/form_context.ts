import React from 'react';
import { observable } from 'mobx';
import { ToryFormContext } from '@toryjs/form';

type User = {
  name: string;
  id: string;
  roles: string[];
  preferences: {
    signatureFont: string;
  };
};

export class FormContext implements ToryFormContext {
  authToken?: string;
  @observable authorisation?: { user?: User; logout?: Function } = {};
  providers: any = {};
}

export const context: FormContext = new FormContext();
export const Context = React.createContext(context);
