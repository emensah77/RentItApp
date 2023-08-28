import React, {useMemo, useEffect, useState, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StreamChat} from 'stream-chat';
import {useNavigation} from '@react-navigation/native';
import {STREAM_CHAT_KEY} from 'react-native-dotenv';

import {
  Page,
  Whitespace,
  Tabs,
  Divider,
  CardDisplay,
  PageSpinner,
  Container,
  Typography,
} from '../../components';

import * as Utils from '../../utils';

const Inbox = () => {
  const user = auth().currentUser;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState({});
  const [notifications, setNotifications] = useState([
    // Use for testing ONLY!
    // {
    //   postId: 3,
    //   title: 'Hi!',
    //   // location: '',
    //   description:
    //     "We'll send your $49.19 (USD) refund\nright away. It may take your bank 3-5\ndays to deposit it in your account",
    //   // status: '',
    //   createdAt: 'August 23, 2023',
    //   read: true,
    //   image: 'https://d1mgzi0ytcdaf9.cloudfront.net/public/1cc4cc8e-d5b5-4e80-a378-00d038a31e58',
    // },
  ]);

  const navigation = useNavigation();

  const goToChat = useCallback(
    (home_id, channel_id, members) => async () => {
      await client.disconnectUser(1);
      navigation.push('Chat', {home_id, channel_id, members});
    },
    [navigation, client],
  );

  const makeUri = useCallback(uri => ({uri}), []);

  const content = useMemo(
    () => [
      {
        title: `Messages${
          messages.filter(item => item.read === false).length > 0
            ? ` (${messages.filter(item => item.read === false).length})`
            : ''
        }`,
        content: loading ? (
          <PageSpinner />
        ) : messages.length === 0 ? (
          <Typography>No messages to see yet.</Typography>
        ) : (
          messages.map(
            (
              {channel_id, home_id, members, name, location, description, status, date, read, uri},
              i,
            ) => (
              <React.Fragment key={channel_id}>
                <CardDisplay
                  onPress={goToChat(home_id, channel_id, members)}
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
            ),
          )
        ),
      },
      {
        title: `Notifications${
          notifications.filter(item => item.read === false).length > 0
            ? ` (${notifications.filter(item => item.read === false).length})`
            : ''
        }`,
        content: loading ? (
          <PageSpinner />
        ) : notifications.length === 0 ? (
          <Typography>No notifications to see yet.</Typography>
        ) : (
          notifications.map(
            ({noticeId, postId, description, title, createdAt, read, image}, i) =>
              !!(image && description && title) && (
                <React.Fragment key={`${noticeId}${postId}`}>
                  <CardDisplay
                    leftImageCircle={40}
                    leftImageSrc={makeUri(image)}
                    name={title}
                    // location={location}
                    // status={title}
                    description={description}
                    date={Utils.formatDate(createdAt)}
                    bold={read}
                  />

                  {i !== notifications.length - 1 ? <Divider small /> : null}
                </React.Fragment>
              ),
          )
        ),
      },
    ],
    [loading, messages, notifications, goToChat, makeUri],
  );

  const loadNotifications = useCallback(() => {
    if (!user?.uid) {
      return;
    }

    setLoading(true);

    firestore()
      .collection('users')
      .doc(user?.uid)
      // Use for testing ONLY!
      // .doc('S1e9IadGFJRPaDIe8nb0AszDPMx1')
      .collection('notifications')
      .onSnapshot(querySnapshot => {
        setNotifications(querySnapshot.docs.map(doc => ({noticeId: doc.id, ...doc.data()})));
      });

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [user]);

  const clear = useCallback(() => {
    firestore()
      .collection('users')
      .doc(user?.uid)
      // Use for testing ONLY!
      // .doc('S1e9IadGFJRPaDIe8nb0AszDPMx1')
      .collection('notifications')
      .get()
      .then(async snapshot => {
        snapshot.docs.forEach(async doc => {
          return doc.ref.delete();
        });
        setTimeout(loadNotifications, 1000);
      })
      .catch(console.error);
  }, [user, loadNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const _client = StreamChat.getInstance(STREAM_CHAT_KEY || '');

    (async () => {
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

      await _client
        .connectUser(
          {
            id: user.uid,
            name: user.displayName,
            image: user.userImg,
          },
          response.token,
        )
        .catch(console.error);

      const _channels = await _client.queryChannels(
        {type: 'messaging', members: {$in: [user.uid]}},
        [{last_message_at: -1}],
        {
          watch: true,
          state: true,
          limit: 100,
          offset: 0,
        },
      );

      setClient(_client);
      setMessages(
        _channels
          .filter(({state}) => !!state?.messageSets?.[0]?.messages?.reverse()?.[0]?.text)
          .map(({id: channel_id, data, state}) => ({
            home_id: data?.home_id,
            channel_id,
            members: Object.keys(state.members || {}),
            messaging_id: state?.messageSets?.[0]?.messages[0].id,
            name: data?.displayName || data?.fname || data?.lname,
            uri: data?.image,
            description: state?.messageSets?.[0]?.messages?.[0]?.text,
            date: Utils.formatDate(state?.messageSets?.[0]?.messages?.[0]?.updated_at),
            location: '',
            status: '',
            read: state.read[user.uid].unread_messages > 0,
          })),
      );
    })().catch(e => console.error('There was an issue loading the chat', e));

    // channel.countUnread();
    // channel.countUnreadMentions();

    return () => _client.disconnectUser(1);
  }, [user]);

  return (
    <Page type="large" header="Inbox">
      <Container type="right-60" onPress={clear}>
        <Container type="top-40">
          <Typography type="levelTwoThick">Clear</Typography>
        </Container>
      </Container>

      <Whitespace marginTop={40} />

      <Tabs content={content} />
    </Page>
  );
};

export default Inbox;
