import {useCallback, useEffect, useState} from 'react';

/**
 * Custom hook to manage a boolean state with a toggle function.
 *
 * @param {boolean} [initial=false] - The initial state value.
 * @returns {object} The boolean state and a toggle function.
 * @returns {boolean} value - The current boolean state.
 * @returns {function} toggle - Function to toggle the boolean state.
 */
export default function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const toggle = useCallback((expected?: boolean) => {
    setValue(_value => {
      if (_value === expected) {
        return _value;
      }
      return !_value;
    });
  }, []);

  return {
    value,
    toggle,
  };
}
