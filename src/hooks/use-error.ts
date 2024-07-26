import {useCallback, useEffect, useState} from 'react';
import {isEmpty} from 'lodash';

export default function useError(initial: string = '') {
  const [value, setValue] = useState<{
    msg: string;
    bool: boolean;
  }>({
    msg: initial,
    bool: !isEmpty(initial),
  });

  useEffect(() => {
    setValue({
      msg: initial,
      bool: !isEmpty(initial),
    });
  }, [initial]);

  const set = useCallback((msg: string) => {
    setValue({msg: msg, bool: true});
  }, []);

  const clear = useCallback(() => {
    setValue({msg: '', bool: false});
  }, []);

  return {
    value,
    set,
    clear,
  };
}
