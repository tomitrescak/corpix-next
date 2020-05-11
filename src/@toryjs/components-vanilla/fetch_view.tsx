import * as React from 'react';

import { FormComponentProps } from '@toryjs/form';
import { createComponents, simpleHandle, tryInterpolate } from '@toryjs/ui';

import { observer } from 'mobx-react';
import { Text } from 'evergreen-ui';

export type FetchProps = {
  url: string;
  resultRoot: string;
  target: string;
  propTarget: string;
  loadingText: string;
  onResult: string;
  onError: string;
  onSubmit: string;
  fakeData: string;
  options: string;
  receivedData: Any;
  apiData: Any;
};

export class SimpleData {
  constructor(private data: any) {}

  resolve(path: string, data: any): any {
    if (path.indexOf('.') === -1) {
      return data[path];
    }
    const name = path.substring(0, path.indexOf('.'));
    const rest = path.substring(path.indexOf('.') + 1);

    if (this.data[name] == null) {
      return null;
    }
    return this.resolve(rest, this.data[name]);
  }

  getValue(path: string) {
    return this.resolve(path, this.data);
  }
}

const FetchComponent: React.FC<FormComponentProps<FetchProps>> = props => {
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState<Any>(null);

  const {
    owner,
    formElement: {
      componentProps: {
        url,
        loadingText,
        target,
        onError,
        onResult,
        onSubmit,
        options,
        resultRoot,
        className,
        style
      }
    }
  } = props;

  let parsedUrl = onSubmit ? simpleHandle(props, onSubmit, context) : '';
  try {
    parsedUrl = tryInterpolate(url, props.owner);
  } catch (ex) {
    setError(`Error parsing url: ${ex.message}`);
  }

  React.useEffect(() => {
    let fetchOptions: any = {};
    if (options) {
      try {
        fetchOptions = JSON.parse(options);
      } catch (ex) {
        setError(`Error parsing options: ${ex.message}`);
        return;
      }
    }
    fetch(parsedUrl, fetchOptions)
      .then(response => {
        response.json().then(rawData => {
          let data = resultRoot ? rawData[resultRoot] : rawData;
          if (onResult) {
            data = simpleHandle(props, onResult, data);
          }
          if (target) {
            owner.setValue(target, data);
          }
          setData(data);
        });
      })
      .catch(error => {
        if (onError) {
          simpleHandle(props, onError, { error });
        }
        setError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, parsedUrl]);

  if (error) {
    return (
      <Text className={className} style={style}>
        {typeof error === 'object' ? JSON.stringify(error) : error}
      </Text>
    );
  }

  if (!data) {
    return (
      <Text className={className} style={style}>
        {loadingText || 'Loading ...'}
      </Text>
    );
  }

  let dataProps = { ...props };
  if (!target) {
    dataProps.owner = new SimpleData(data) as Any;
  }
  return createComponents(dataProps);
};

export const FetchView = observer(FetchComponent);
