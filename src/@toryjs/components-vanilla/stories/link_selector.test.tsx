import { create, schemaFromData, fireEvent, testForm, testElement } from './common';
import { LinkSelectorProps, TextProps } from '../text_view';

export const createControl = create<LinkSelectorProps>('LinkSelector');
export const createText = create<TextProps>('Text');

const data = {
  fromName: 'Tomas Trescak',
  toName: ''
};
const schema = schemaFromData(data);

describe('Vanilla > Link Selector', () => {
  it('renders link with target', () => {
    const selector = createControl({
      text: 'Name',
      source: { source: 'fromName' },
      target: 'toName'
    });
    const text = createText({ value: { source: 'toName' } });
    const root = testForm({ elements: [selector, text], data, schema });

    expect(root.queryByText('Tomas Trescak')).not.toBeInTheDocument();

    const img = root.getByText('Name');
    fireEvent.click(img);

    // click loads the value from the document
    expect(root.getByText('Tomas Trescak')).toBeInTheDocument();
  });

  it('renders with label', () => {
    const controlDefinition = createControl({ text: 'name' }, { label: 'Selector' });
    const root = testElement({ element: controlDefinition });
    expect(root.getByLabelText('Selector')).toBeInTheDocument();
  });
});
