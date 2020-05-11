import { FormComponentProps, FormElement } from './form_definition';
import { ToryFormContext } from './context_definition';

type HandlerArgs<O = Any, ARGS = Any, P = Any, CTX = ToryFormContext> = {
  owner: O;
  props: FormComponentProps<P, O>;
  formElement: FormElement<P>;
  context: CTX;
  args: ARGS;
};

type Handler<O = Any, ARGS = Any, P = Any, CTX = ToryFormContext> = (
  args: Partial<HandlerArgs<O, ARGS, P, CTX>>
) => Any;

type ParseArgs = {
  current: Any;
  previous: Any;
};
export type ParseHandler<O, ARGS = {}> = Handler<O, ParseArgs & ARGS>;

type ValidateArgs = {
  value: Any;
  source: string;
};
export type ValidateHandler<O, ARGS = {}> = Handler<O, ValidateArgs & ARGS>;

export type Handlers<O, CTX = ToryFormContext> = {
  [index: string]: Handler<O, Any, Any, CTX>;
};
