import React, {useState, useEffect} from 'react';

import Base from './Base';

import {Input} from '../../components';

const OnboardingScreen6 = props => {
  const {
    route: {params: {title} = {title: ''}},
  } = props;

  const [value, setValue] = useState(title);
  const [data, setData] = useState({title});

  useEffect(() => {
    setData({title: value});
  }, [value]);

  return (
    <Base
      index={6}
      isComplete={data.title.length > 3}
      data={data}
      title="Let's give your place a title.">
      <Input
        placeholder="Eg. Beautiful 3 bedroom flat"
        type="text"
        value={value}
        onChange={setValue}
      />
    </Base>
  );
};

export default OnboardingScreen6;
