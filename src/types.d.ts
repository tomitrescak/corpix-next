declare module 'micro-cors';
declare module 'classnames';
declare module 'marked';

type Condition = {
  condition: boolean;
};

type ForProps<T> = {
  of: Array<T>;
  body: (item: T, index?: number) => Any;
};

declare const Choose: React.FC;
declare const When: React.FC<Condition>;
declare const Otherwise: React.FC;
declare const If: React.FC<Condition>;
declare const For: React.FC<ForProps>;

declare type Any = any;
