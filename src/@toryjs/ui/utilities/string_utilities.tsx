import { DataSet } from '@toryjs/form';

// TODO: SECURITY : Might be issue

export function interpolate(str: string, params: any) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${str}\`;`)(...vals);
}

export function tryInterpolate(text: string, owner: DataSet) {
  if (owner == null) {
    return text;
  }
  try {
    return interpolate(text, owner);
  } catch (ex) {
    return 'Error: ' + ex.message;
  }
}
