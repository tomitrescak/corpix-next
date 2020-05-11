import { FormComponentProps } from '../form_definition';

function validate(this: FormComponentProps, ...props: string[]) {
  if (props.length % 3 > 0) {
    throw new Error(
      'Incorrect validation parameters.\nExpected triplets of "name, expression, errorMessage"'
    );
  }

  let result = true;
  for (let i = 0; i < props.length / 3; i++) {
    this.owner.setError(props[i * 3], '');
    if (!safeEval(this, `this.owner.${props[i * 3]} ${props[i * 3 + 1]}`)) {
      this.owner.setError(props[i * 3], props[i * 3 + 2]);
      result = false;
    }
  }

  if (result === false) {
    throw new Error('Validation Error');
  }

  return result;
}

export function safeEval(t: any, expression: string, value: any = null, parameterName = 'value') {
  if (
    expression &&
    expression.trim().indexOf('\n') === -1 &&
    expression.indexOf(';') === -1 &&
    !expression.trim().startsWith('return')
  ) {
    expression = 'return ' + expression;
  }

  // check all accessors
  const variableAccesses = expression.matchAll(/(\$)([a-zA-Z][\w_]*)/g);
  const keys = Object.keys(t || '{}')
    .concat(['parent'])
    .filter(f => f[0] !== '$' && f[0] !== '_' && f !== 'undoManager');
  for (const match of variableAccesses) {
    if (keys.indexOf(match[2]) === -1) {
      const message = `${match[2]} does not exist in your dataset. Available keys are: <ul>${keys
        .sort()
        .map(key => `<li>${key}</li>`)
        .join('\n')}</ul>`;
      throw new Error(message);
    }
  }
  expression = expression.replace(/\$([a-zA-Z]+)/g, 'this.$1');

  // eslint-disable-next-line no-new-func
  const f = new Function(
    parameterName,
    'validate',
    'eval',
    'global',
    'window',
    'document',
    'setTimeout',
    'setInterval',
    'Object',
    // 'console',
    'XMLHttpRequest',
    'Function',
    expression
  );
  try {
    return f.call(t, value, validate.bind(t));
  } catch (ex) {
    if (ex.message !== 'Validation Error') {
      throw ex;
    }
  }
}
