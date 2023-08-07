import React, {useState, useEffect} from 'react';

import Base from './Base';

import {Input} from '../../components';

const OnboardingScreen7 = props => {
  const {
    route: {params: {description} = {description: ''}},
  } = props;

  const [value, setValue] = useState(description);
  const [data, setData] = useState({description});

  useEffect(() => {
    setData({description: value});
  }, [value]);

  return (
    <Base
      index={7}
      isComplete={data.description.length > 3}
      data={data}
      title="Describe your home in detail.">
      <Input
        placeholder="Tell us about where your home is located,
        including landmarks and amenities available"
        type="text"
        value={value}
        onChange={setValue}
        multiLine={2}
      />
    </Base>
  );
};

export default OnboardingScreen7;
