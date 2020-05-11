import React from 'react';
import { testRender } from './common';

import { View } from './markdown.stories';

describe('Vanilla > Markdown', () => {
  it('checkbox renders with top label and allows click', () => {
    const root = testRender(<View />);

    expect(root.getByText('name')).toBeInTheDocument();
    expect(root.getByText('name').nodeName).toBe('EM');
    expect(root.getByText('Tomas')).toBeInTheDocument();
    expect(root.getByText('Tomas').nodeName).toBe('STRONG');
  });
});
