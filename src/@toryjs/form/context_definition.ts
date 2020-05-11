export interface ToryFormContext {
  providers?: Any;
  authorisation?: {
    user?: {
      id: string;
      roles: string[];
    };
  };
}
