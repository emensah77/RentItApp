import React, {useState, useCallback} from 'react';
import {Pressable, View} from 'react-native';

import Container from './Container';
import Typography from './Typography';
import Whitespace from './Whitespace';

import {global} from '../assets/styles';

const Tabs = props => {
  const {content} = props;
  const [active, setActive] = useState(0);

  const change = useCallback(
    i => () => {
      setActive(i);
    },
    [],
  );

  return (
    <>
      <Container row type="flexStart">
        {content.map((item, i) => (
          <React.Fragment key={item.title}>
            <Pressable onPress={change(i)}>
              <Container type={i === active ? 'tab' : ''}>
                <Typography type={i === active ? 'tabText' : 'notice'}>{item.title}</Typography>
              </Container>
            </Pressable>

            <Whitespace marginLeft={28} />
          </React.Fragment>
        ))}
      </Container>

      {content.map((item, i) => (
        <View style={global.tabContent} key={item.title}>
          {i === active && item.content}
        </View>
      ))}
    </>
  );
};

export default Tabs;
