import React, {useState, useEffect, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StreamChat} from 'stream-chat';
import {API, graphqlOperation} from 'aws-amplify';
import sha256 from 'sha256';
import {STREAM_CHAT_KEY} from 'react-native-dotenv';

import {getPost} from '../../graphql/queries';

import {
  Page,
  Whitespace,
  Input,
  Container,
  Divider,
  CardDisplay,
  Typography,
  PageSpinner,
  Loader,
} from '../../components';

import arrowLeft from '../../assets/images/arrow-left.png';
import menu from '../../assets/images/menu.png';
// import logo from '../../assets/images/logo.png';
import moon from '../../assets/images/moon.png';
import listing from '../../assets/images/listing.png';
import share from '../../assets/images/share.png';

import * as Utils from '../../utils';

const Chat = props => {
  const {
    route: {
      params: {home_id} = {
        home_id: '', // 'ac1d2480-4b86-4d19-87bd-4674e433b179',
      },
    },
  } = props;

  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [supervisor, setSupervisor] = useState({});
  const [home, setHome] = useState({});
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState();
  const [loading, setLoading] = useState(false);

  const send = useCallback(async () => {
    if (!channel) {
      return;
    }

    await channel.sendMessage({
      text: message,
      timestamp: new Date().getTime(),
      sender_id: sender.uid,
      receiver_id: receiver.uid,
      // Use this to create a thread, recall
      // that the message will go into the
      // parent message specified using `parent_id`
      // parent_id: parent.message.id,
    });
  }, [channel, message, sender, receiver]);

  const fetchRandomDefaultSupervisor = useCallback(async () => {
    const defaultSupervisorsSnapshot = await firestore().collection('defaultSupervisors').get();
    const defaultSupervisors = defaultSupervisorsSnapshot.docs.map(doc => ({
      ...doc.data(),
    }));
    return defaultSupervisors[Math.floor(Math.random() * defaultSupervisors.length)];
  }, []);

  const fetchRandomDefaultMarketer = useCallback(async () => {
    try {
      const marketersSnapshot = await firestore()
        .collection('users')
        .where('marketer_status', '==', 'ACCEPTED')
        .get();

      const marketers = marketersSnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id, // Assigning the document ID as uid for consistency
      }));

      if (marketers.length === 0) {
        throw new Error('No marketers found with ACCEPTED status.');
      }

      return marketers[Math.floor(Math.random() * marketers.length)];
    } catch (error) {
      console.error('Error fetching default marketer:', error);
      return null; // Return null or handle this case as you see fit
    }
  }, []);

  useEffect(() => {
    const client = StreamChat.getInstance(STREAM_CHAT_KEY);

    (async () => {
      setLoading(true);
      const homeResult = await API.graphql(graphqlOperation(getPost, {id: home_id}));
      const _home = homeResult.data.getPost;
      let receiver_id = _home?.userID;
      if (!_home || !receiver_id) {
        // Fetch a default marketer if there's no associated user
        const defaultMarketer = await fetchRandomDefaultMarketer();
        if (defaultMarketer) {
          receiver_id = defaultMarketer.uid;
        } else {
          // If there's no marketer available, exit the function early
          setLoading(false);
          return;
        }
      }
      _home.formattedDate = Utils.formatDate(_home.createdAt);

      const user = auth().currentUser;
      const _receiver = await firestore()
        .collection('users')
        .doc(receiver_id)
        .get()
        .catch(console.error);
      const recipient = _receiver?.data();
      if (!recipient) {
        console.error('User not found', _receiver, recipient);
        setLoading(false);
        return;
      }
      recipient.uid = receiver_id;

      // Fetching supervisor info
      let _supervisor;
      const supervisorDoc = await firestore()
        .collection('users')
        .doc(recipient.supervisor_id)
        .get();
      _supervisor = supervisorDoc?.data();
      if (!_supervisor) {
        _supervisor = await fetchRandomDefaultSupervisor();
      }

      __DEV__ &&
        console.debug(
          'Chat Between:',
          user.displayName,
          `(uid: ${user.uid})`,
          'and',
          recipient.displayName,
          `(uid: ${recipient.uid})`,
        );

      await Utils.promiseAll(
        // eslint-disable-next-line no-unused-vars
        async (item, i) => {
          const request = await fetch(
            'https://bnymw2nuxn6zstrhiiz4nibuum0zkovn.lambda-url.us-east-2.on.aws/',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: item.uid,
              }),
            },
          );
          const response = await request.json();

          // Disconnect the current user before connecting a new one
          await client.disconnectUser();

          // Now, connect the new user
          await client
            .connectUser(
              {
                id: item.uid,
                name: item.displayName,
                image: item.userImg,
              },
              response.token,
            )
            .catch(console.error);
        },
        [recipient, user, _supervisor],
      );

      // eslint-disable-next-line no-unused-vars
      const {type, ...recipientWithoutType} = recipient;

      const _channel = client.channel(
        'messaging',
        sha256(`${user.uid}-${home_id}-${recipient.uid}`),
        {
          ...recipientWithoutType,
          name: recipient.displayName,
          image: recipient.userImg,
          members: [user.uid, recipient.uid, _supervisor.uid],
        },
      );
      // Check if channel exists
      const channelState = await _channel.query();

      if (!channelState.channel.id) {
        // If channel does not exist, create it
        await _channel.create();
      }

      // Now update the channel
      await _channel.updatePartial({set: {home_id}});

      // TODO:
      // Forbid banned users from continuing?
      // const member = await _channel.queryMembers({user_id: user.uid});
      // const {user:{banned, online, last_active}} = member[0];
      const result = await _channel.query({
        messages: {limit: 30, offset: 0},
      });
      setMessages(result.messages.reverse());
      setSender(user);
      setReceiver(recipient);
      setSupervisor(_supervisor);
      setHome(_home);
      setChannel(_channel);
      setLoading(false);

      await _channel.watch();
      _channel.on('message.new', event => {
        console.debug('You have a new message:', event);
        setMessage('');
        setMessages(oldMessages => [event.message, ...oldMessages]);
      });
    })().catch(e => console.error('There was an issue loading the chat', e));

    return () => client.disconnectUser(1);
  }, [fetchRandomDefaultMarketer, fetchRandomDefaultSupervisor, home_id]);

  const makeUri = useCallback(uri => ({uri}), []);

  let currentDay, nextDay;

  // if (!receiver.displayName) {
  //   return <PageSpinner />;
  // }

  return (
    <Page
      leftIcon={arrowLeft}
      rightIcon={menu}
      reverse
      header={
        <Typography type="heading" left>
          {receiver.displayName}

          <>
            {'\n'}
            <Typography type="regular" size={11} left color="#717171">
              Chat supervised by: {supervisor.displayName}
            </Typography>
          </>
        </Typography>
      }
      footer={
        <>
          <Input
            inline
            placeholder="Write a message"
            type="text"
            onSubmitEditing={send}
            value={message}
            onChange={setMessage}
            trim={false}
          />
        </>
      }>
      <Container width="100%" type="top-10-center">
        {home?.title ? (
          <>
            <CardDisplay
              leftImageWidth={38}
              leftImageHeight={38}
              leftImageSrc={makeUri(home?.image)}
              numberOfLines={2}
              description={
                <Typography
                  type="link"
                  size={15}
                  width="100%"
                  position="flex-start"
                  color="#252525">
                  {home?.title}
                </Typography>
              }
              status={home?.status}
              date={home?.formattedDate}
              bold
            />

            <Whitespace marginTop={10} />

            <Container row type="center">
              <Container row type="chipSmall" color="#FFF" width={110}>
                <CardDisplay
                  leftImageWidth={12.95}
                  leftImageHeight={15}
                  leftImageSrc={listing}
                  numberOfLines={1}
                  description="Listing"
                  center
                  bold
                />
              </Container>

              <Whitespace marginLeft={8} />

              <Container row type="chipSmall" color="#FFF" width={150}>
                <CardDisplay
                  leftImageWidth={12.95}
                  leftImageHeight={15}
                  leftImageSrc={share}
                  numberOfLines={1}
                  description="Share listing"
                  center
                  bold
                />
              </Container>
            </Container>

            <Whitespace marginTop={-35} />

            <Divider />
          </>
        ) : (
          <Loader spinner />
        )}
      </Container>

      {!loading ? (
        messages.map((msg, i) => {
          nextDay = Utils.formatDate((messages[i + 1] || msg).created_at);
          currentDay = Utils.formatDate(msg.created_at);
          const date = new Date(msg.created_at);
          const {user} = msg;

          if (user.id !== sender.uid && user.id !== receiver.uid) {
            return null;
          }

          return (
            <React.Fragment key={msg.id}>
              <CardDisplay
                leftImageCircle={38}
                leftImageSrc={user.image ? makeUri(user?.image) : moon}
                name={user.name}
                location={`${
                  date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
                }:${date.getMinutes()} ${date.getHours() > 12 ? 'PM' : 'AM'}`}
                description={msg.html.replace(/<\/?[^>]+(>|$)/g, '')}
                reverse={user.id === sender.uid}
                bold={false}
              />

              {i === messages.length - 1 || nextDay !== currentDay ? (
                <>
                  <Whitespace marginTop={24} />

                  <Typography
                    type="levelOneThick"
                    size={12}
                    color={msg.pending ? '#555' : '#717171'}>
                    {currentDay}
                  </Typography>
                </>
              ) : null}
            </React.Fragment>
          );
        })
      ) : (
        <Container center>
          <PageSpinner />
        </Container>
      )}
    </Page>
  );
};

export default Chat;
