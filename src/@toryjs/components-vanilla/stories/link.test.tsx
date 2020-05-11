import { create, testElement } from './common';
import { LinkProps } from '../text_view';

export const createControl = create<LinkProps>('Link');

describe('Vanilla > Link', () => {
  it('renders link with target', () => {
    const controlDefinition = createControl({ target: '__empty', url: '/target', text: 'Link' });
    const root = testElement({ element: controlDefinition });

    const img = root.getByText('Link');
    expect(img).toHaveAttribute('href', '/target');
    expect(img).toHaveAttribute('target', '__empty');
  });

  it('renders link with mailto', () => {
    const controlDefinition = createControl({ url: 'mailto:me', text: 'Mail' });
    const root = testElement({ element: controlDefinition });

    const img = root.getByText('Mail');
    expect(img).toHaveAttribute('href', 'mailto:me');
  });
});
