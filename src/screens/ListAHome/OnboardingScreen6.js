import React, {useState, useEffect} from 'react';

import Base from './Base';

import {Input} from '../../components';

const OnboardingScreen6 = () => {
  const [title, setTitle] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    setData({title});
  }, [title]);

  return (
    <Base index={6} isComplete={!!data.title} data={data} title="Let's give your place a title.">
      <Input
        placeholder="Eg. Beautiful 3 bedroom flat"
        type="text"
        value={title}
        onChange={setTitle}
      />
    </Base>
  );
};

export default OnboardingScreen6;
