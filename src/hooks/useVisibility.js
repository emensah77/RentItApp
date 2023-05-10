import {useCallback, useMemo, useState} from 'react';

const useVisibility = initialState => {
  const [visible, setVisible] = useState(initialState || false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const toggleVisibility = useCallback(() => setVisible(v => !v), []);

  return useMemo(
    () => ({
      visible,
      show,
      hide,
      toggleVisibility,
    }),
    [show, hide, visible, toggleVisibility],
  );
};

export default useVisibility;
