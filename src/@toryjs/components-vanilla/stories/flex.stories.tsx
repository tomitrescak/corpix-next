import { renderFormElement, mockFetchResolve, mockFetchReject } from './common';

import { create, testElement } from './common';
import { FlexProps } from '../flex_view';
import { FormElement } from '@toryjs/form';
import { TextProps } from '../text_view';

export default {
  title: 'Vanilla/Flex'
};

const createControl = create<FlexProps>('Flex');

const elements: FormElement<TextProps>[] = [
  {
    control: 'Text',
    uid: '1',
    componentProps: {
      value: 'Text 1',
      style: {
        background: 'red',
        flex: 1
      }
    },
    containerProps: {}
  },
  {
    control: 'Text',
    uid: '2',
    componentProps: {
      value: 'Text 2',
      style: {
        background: 'green',
        flex: 1
      }
    },
    containerProps: {}
  },
  {
    control: 'Text',
    uid: '3',
    componentProps: {
      value: 'Text 3',
      style: {
        background: 'blue',
        flex: 2
      }
    },
    containerProps: {}
  }
];

export const Horizontal = () =>
  renderFormElement({
    element: createControl({}, { label: 'Horizontal' }, elements, 'flex')
  });

export const HorizontalGap = () =>
  renderFormElement({
    element: createControl(
      { gap: '8px', justifyContent: 'space-between', style: { background: 'yellow' } },
      {},
      elements
    )
  });

export const Vertical = () =>
  renderFormElement({
    element: createControl({ layout: 'column' }, { label: 'Vertical' }, elements)
  });
