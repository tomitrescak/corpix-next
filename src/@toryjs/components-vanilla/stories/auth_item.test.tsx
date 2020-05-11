import React from 'react';
import { render } from '@testing-library/react';

import { view as View } from './auth_item.stories';

describe('Auth Item', () => {
  it('renders only authorised nodes', () => {
    const root = render(<View />);

    expect(root.queryByText('Admin Invisible')).not.toBeInTheDocument();
    expect(root.getByText('User Visible')).toBeInTheDocument();
  });
});
