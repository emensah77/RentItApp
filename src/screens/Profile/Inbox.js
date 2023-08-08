import React, {useMemo, useEffect, useState, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import {StreamChat} from 'stream-chat';
import {useNavigation} from '@react-navigation/native';
import {STREAM_CHAT_KEY} from 'react-native-dotenv';

// import AppNotifications from '../../screens/AppNotifications/AppNotifications';

import {Page, Whitespace, Tabs, Divider, CardDisplay} from '../../components';

import * as Utils from '../../utils';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [notifications] = useState([
    // {
    //   id: 3,
    //   name: 'Hi!',
    //   location: '',
    //   description:
    //     "We'll send your $49.19 (USD) refund\nright away. It may take your bank 3-5\ndays to deposit it in your account",
    //   status: '',
    //   date: 'August 23, 2023',
    //   read: true,
    //   uri: '',
    // },
  ]);

  const navigation = useNavigation();

  const goToChat = useCallback(
    home_id => () => {
      navigation.push('Chat', {home_id});
    },
    [navigation],
  );

  const makeUri = useCallback(uri => ({uri}), []);

  const content = useMemo(
    () => [
      {
        title: 'Messages',
        content: messages.map(({id, name, location, description, status, date, read, uri}, i) => (
          <React.Fragment key={name}>
            <CardDisplay
              onPress={goToChat(id)}
              leftImageCircle={30}
              leftImageSrc={makeUri(uri)}
              name={name}
              location={location}
              description={description}
              status={status}
              date={date}
              bold={read}
            />
            {i !== messages.length - 1 ? <Divider small /> : null}
          </React.Fragment>
        )),
      },
      {
        title: 'Notifications',
        content: notifications.map(({name, location, description, status, date, read, uri}, i) => (
          <React.Fragment key={name}>
            <CardDisplay
              leftImageCircle={60}
              leftImageSrc={makeUri(uri)}
              name={name}
              location={location}
              description={description}
              status={status}
              date={date}
              bold={read}
            />
            {i !== messages.length - 1 ? <Divider small /> : null}
          </React.Fragment>
        )),
      },
    ],
    [goToChat, messages, notifications, makeUri],
  );

  useEffect(() => {
    const client = StreamChat.getInstance(STREAM_CHAT_KEY);

    (async () => {
      const user = auth().currentUser;

      const request = await fetch(
        'https://bnymw2nuxn6zstrhiiz4nibuum0zkovn.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.uid,
          }),
        },
      );
      const response = await request.json();

      await client
        .connectUser(
          {
            id: user.uid,
            name: user.displayName,
            image: user.userImg,
          },
          response.token,
        )
        .catch(console.error);

      const _channels = await client.queryChannels(
        {type: 'messaging', members: {$in: [user.uid]}},
        [{last_message_at: -1}],
        {
          watch: true,
          state: true,
          limit: 100,
          offset: 0,
        },
      );

      setMessages(
        _channels
          .filter(({state}) => !!state?.messageSets?.[0]?.messages?.reverse()?.[0]?.text)
          .map(({data, state}) => ({
            id: data?.home_id,
            name: data?.displayName,
            uri: data?.image,
            description: state?.messageSets?.[0]?.messages?.reverse()?.[0]?.text,
            date: Utils.formatDate(state?.messageSets?.[0]?.messages?.reverse()?.[0]?.updated_at),
            location: '',
            status: '',
            read: false,
          })),
      );
    })().catch(e => console.error('There was an issue loading the chat', e));

    return () => client.disconnectUser(1);
  }, []);

  return (
    <Page type="large" header="Inbox">
      <Whitespace marginTop={40} />

      <Tabs content={content} />
    </Page>
  );
};

export default Inbox;
