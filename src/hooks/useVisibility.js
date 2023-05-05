import {useCallback, useMemo, useState} from 'react';

const useVisibility = initialState => {
  const [visible, setVisible] = useState(initialState || false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible(v => !v), []);

  return useMemo(
    () => ({
      visible,
      show,
      hide,
      toggle,
    }),
    [show, hide, visible, toggle],
  );
};

export default useVisibility;
