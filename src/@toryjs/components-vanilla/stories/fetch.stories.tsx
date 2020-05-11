import { renderFormElement, mockFetchResolve, mockFetchReject } from './common';

import { create, testElement } from './common';
import { FetchProps } from '../fetch_view';

export default {
  title: 'Vanilla/Fetch'
};

const createControl = create<FetchProps>('Fetch');

const element = (props?: Partial<FetchProps>) =>
  createControl({ url: 'someUrl', ...props }, {}, [
    {
      control: 'Text',
      uid: 'name',
      componentProps: { value: { source: 'name' } },
      containerProps: { label: 'Name' }
    },
    {
      control: 'Text',
      uid: 'name',
      componentProps: { value: { source: 'address.street' } },
      containerProps: { label: 'Street' }
    }
  ]);

export const view = () =>
  mockFetchResolve(
    {
      name: 'Tomas',
      address: {
        street: 'Cadigal'
      }
    },
    () =>
      renderFormElement({
        element: element()
      })
  );

export const processResult = () =>
  mockFetchResolve(
    {
      name: 'Tomas',
      address: {
        street: 'Cadigal'
      }
    },
    () =>
      renderFormElement({
        element: element({ onResult: 'processResult' }),
        handlers: {
          processResult({ args }: Any) {
            debugger;
            return { ...args, name: 'Processed' };
          }
        }
      })
  );

export const error = () =>
  mockFetchReject({ message: 'Error Message' }, () =>
    renderFormElement({
      element: element()
    })
  );
