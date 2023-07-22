import React, {useState, useCallback} from 'react';

import Base from './Base';
import PhoneNumber from '../Authentication/PhoneNumber';

const OnboardingScreen14 = () => {
  const [data, setData] = useState({});

  const onChangeData = useCallback(phoneNumber => {
    setData({phoneNumber});
  }, []);

  return (
    <Base
      index={14}
      total={17}
      isComplete={!!data.phoneNumber}
      data={data}
      title="What's your phone number?"
      label="We will call to verify the number">
      <PhoneNumber inline onChangeData={onChangeData} />
    </Base>
  );
};

export default OnboardingScreen14;
