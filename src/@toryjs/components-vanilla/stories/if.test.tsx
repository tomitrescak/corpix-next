import React from 'react';
import { testRender } from './common';

import { Exists } from './if.stories';
import { evaluate } from '../if_view';

describe('Vanilla > If', () => {
  it('renders different container based on the condition', async () => {
    const root = testRender(<Exists />);

    let control = root.getByLabelText('Has Surename');
    expect(control).toHaveTextContent('False');

    control = root.getByLabelText('Has Name');
    expect(control).toHaveTextContent('True');
  });

  it('evaluate function check different properties', () => {
    expect(evaluate({ exists: true }, {}, 'name')).toBe(true);
    expect(evaluate({ exists: true }, {}, 0)).toBe(true);
    expect(evaluate({ exists: true }, {}, '')).toBe(false);
    expect(evaluate({ exists: true }, {}, null)).toBe(false);

    expect(evaluate({ notExists: true }, {}, 'name')).toBe(false);
    expect(evaluate({ notExists: true }, {}, 0)).toBe(false);
    expect(evaluate({ notExists: true }, {}, '')).toBe(true);
    expect(evaluate({ notExists: true }, {}, null)).toBe(true);

    expect(evaluate({ equal: '3' }, {}, '3')).toBe(true);
    expect(evaluate({ equal: '3' }, {}, 3)).toBe(true);
    expect(evaluate({ equal: '3' }, {}, '4')).toBe(false);

    expect(evaluate({ notEqual: '3' }, {}, '3')).toBe(false);
    expect(evaluate({ notEqual: '3' }, {}, 3)).toBe(false);
    expect(evaluate({ notEqual: '3' }, {}, '4')).toBe(true);

    expect(evaluate({ biggerThan: '3' }, {}, 4)).toBe(true);
    expect(evaluate({ biggerThan: '3' }, {}, 3)).toBe(false);

    expect(evaluate({ biggerOrEqualThan: '3' }, {}, 4)).toBe(true);
    expect(evaluate({ biggerOrEqualThan: '3' }, {}, 3)).toBe(true);
    expect(evaluate({ biggerOrEqualThan: '3' }, {}, 2)).toBe(false);

    expect(evaluate({ smallerThan: '3' }, {}, 2)).toBe(true);
    expect(evaluate({ smallerThan: '3' }, {}, 3)).toBe(false);

    expect(evaluate({ smallerOrEqualThan: '3' }, {}, 2)).toBe(true);
    expect(evaluate({ smallerOrEqualThan: '3' }, {}, 3)).toBe(true);
    expect(evaluate({ smallerOrEqualThan: '3' }, {}, 4)).toBe(false);

    expect(evaluate({ expression: '$age > value' }, { age: 30 }, 2)).toBe(true);
    expect(evaluate({ expression: '$age > value' }, { age: 30 }, 40)).toBe(false);
  });
});
