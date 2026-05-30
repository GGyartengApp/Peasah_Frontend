import { useRef, useState } from 'react';

export function useFormField(initial = '') {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);

  const set = (val: string) => {
    setValue(val);
    ref.current = val;
  };

  return { value, set, ref };
}