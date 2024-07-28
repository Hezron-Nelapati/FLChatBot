import {useCallback, useEffect, useState} from 'react';
import {isEmpty} from 'lodash';

/**
 * Custom hook to manage error state.
 *
 * @param {string} [initial=''] - The initial error message.
 * @returns {object} The error state and functions to set or clear the error.
 * @returns {object} value - The current error state with a message and a boolean flag.
 * @returns {function} set - Function to set the error message.
 * @returns {function} clear - Function to clear the error message.
 */
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
