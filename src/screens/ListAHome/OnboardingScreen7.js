import React, {useState, useEffect} from 'react';

import Base from './Base';

import {Input} from '../../components';

const OnboardingScreen7 = () => {
  const [description, setDescription] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    setData({description});
  }, [description]);

  return (
    <Base
      index={7}
      isComplete={!!data.description}
      data={data}
      title="Describe your home in detail.">
      <Input
        placeholder="Tell us about where your home is located,
        including landmarks and amenities available"
        type="text"
        value={description}
        onChange={setDescription}
        multiLine={2}
      />
    </Base>
  );
};

export default OnboardingScreen7;
