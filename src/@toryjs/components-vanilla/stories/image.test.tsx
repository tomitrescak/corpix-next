import { create, testElement } from './common';
import { ImageProps } from '../text_view';

export const createControl = create<ImageProps>('Image');

describe('Vanilla > Image', () => {
  it('renders with source and alt', () => {
    const controlDefinition = createControl({ src: 'imgSrc', alt: 'imgAlt' });
    const root = testElement({ element: controlDefinition });
    const img = root.getByAltText('imgAlt');
    expect(img).toHaveAttribute('src', 'imgSrc');
  });

  it('renders with label', () => {
    const controlDefinition = createControl({ src: 'imgSrc' }, { label: 'Image' });
    const root = testElement({ element: controlDefinition });
    expect(root.getByLabelText('Image')).toBeInTheDocument();
  });
});
