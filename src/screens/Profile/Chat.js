import React, {useState, useEffect, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StreamChat} from 'stream-chat';
import {API, graphqlOperation} from 'aws-amplify';
import sha256 from 'sha256';
import {STREAM_CHAT_KEY} from 'react-native-dotenv';

import {getPost} from '../../graphql/queries';
import {updatePost} from '../../graphql/mutations';

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
        home_id: '',
        // Regular: '7225607a-fd99-4f33-a32f-03de3dd04974'
        // Home with no marketer ID: d556eed0-e704-47c8-9f5c-64da6447a186
        // 'ac1d2480-4b86-4d19-87bd-4674e433b179',
      },
    },
  } = props;

  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [supervisorID, setSupervisorID] = useState('');
  const [home, setHome] = useState({});
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState();
  const [loading, setLoading] = useState(false);

  const getRandomMarketer = useCallback(async () => {
    try {
      const marketersSnapshot = await firestore()
        .collection('users')
        .where('marketer_status', '==', 'ACCEPTED')
        .get();

      const marketers = marketersSnapshot.docs.map(doc => doc.data());
      return marketers[Math.floor(Math.random() * marketers.length)];
    } catch (e) {
      console.error('Error fetching default marketer:', e);
      return {};
    }
  }, []);

  const getRandomDefaultSupervisor = useCallback(async () => {
    try {
      const defaultSupervisorsSnapshot = await firestore().collection('defaultSupervisors').get();

      const defaultSupervisors = defaultSupervisorsSnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
      }));

      return defaultSupervisors[Math.floor(Math.random() * defaultSupervisors.length)];
    } catch (e) {
      console.error('Error fetching default supervisor:', e);
      return {};
    }
  }, []);

  const send = useCallback(async () => {
    if (!channel) {
      return;
    }

    const timestamp = new Date().getTime();

    await channel.sendMessage({
      text: message,
      timestamp,
      sender_id: sender.uid,
      receiver_id: receiver.uid,
    });

    await channel.sendMessage({
      text: message,
      timestamp,
      sender_id: sender.uid,
      receiver_id: supervisorID,
    });
  }, [channel, message, sender, receiver, supervisorID]);

  useEffect(() => {
    const client = StreamChat.getInstance(STREAM_CHAT_KEY);

    (async () => {
      setLoading(true);

      const homeResult = await API.graphql(graphqlOperation(getPost, {id: home_id}));
      const _home = homeResult.data.getPost;
      let receiver_id = _home?.userID;

      if (!_home || !receiver_id) {
        const marketer = await getRandomMarketer();
        receiver_id = marketer.uid;
        await API.graphql(graphqlOperation(updatePost, {user: {..._home, userID: receiver_id}}));
      }
      _home.formattedDate = Utils.formatDate(_home.createdAt);

      const user = auth().currentUser;
      const _receiver = await firestore()
        .collection('users')
        .doc(receiver_id)
        .get()
        .catch(console.error);
      const recipient = _receiver?.data();
      let supervisor_id = recipient?.supervisor_id;

      if (!recipient || !supervisor_id) {
        const supervisor = await getRandomDefaultSupervisor();
        supervisor_id = supervisor.uid;
        await firestore()
          .collection('users')
          .doc(receiver_id)
          .set({
            ...recipient,
            supervisor_id,
          })
          .catch(e => console.error('Attempt to update supervisor ID failed', e));
        console.error('User not found', _receiver, recipient);
      }
      recipient.uid = receiver_id;
      setSupervisorID(supervisor_id);

      __DEV__ &&
        console.debug(
          'Chat Between:',
          user.displayName,
          `(uid: ${user.uid})`,
          'and',
          recipient.displayName,
          `(uid: ${recipient.uid})`,
        );

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

      const _channel = client.channel(
        'messaging',
        sha256(`${user.uid}-${home_id}-${recipient.uid}`),
        {
          ...recipient,
          name: recipient.displayName,
          image: recipient.userImg,
          members: [user.uid, recipient.uid, supervisor_id],
        },
      );
      // await _channel.updatePartial({set: {home_id}});

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
      setHome(_home);
      setChannel(_channel);
      setLoading(false);

      await _channel.watch();
      _channel.on('message.new', event => {
        console.debug('You have a new message:', event);
        setMessage('');
        setMessages(oldMessages => [event.message, ...oldMessages]);
      });
    })().catch(e => console.error('There was an issue loading the chat', e, JSON.stringify(e)));

    return () => client.disconnectUser(1);
  }, [getRandomDefaultSupervisor, getRandomMarketer, home_id]);

  const makeUri = useCallback(uri => ({uri}), []);

  let currentDay, nextDay;

  if (!receiver.displayName) {
    return <PageSpinner />;
  }

  return (
    <Page
      leftIcon={arrowLeft}
      rightIcon={menu}
      reverse
      header={
        <Typography type="heading" left>
          {receiver.displayName}
          {receiver.displayName ? (
            <>
              {'\n'}
              <Typography type="regular" size={11} left color="#717171">
                Chat supervised by {supervisorID}
              </Typography>
            </>
          ) : null}
        </Typography>
      }
      footer={
        <>
          {/* <CardDisplay
            leftImageCircle={38}
            leftImageSrc={moon}
            description={
              <Typography type="levelTwoThick" size={12} color="#959595">
                It&apos;s<Typography color="#717171"> 4:32 AM </Typography>
                for your Host. They will see your messages when they are back online
              </Typography>
            }
            bold={false}
          />

          <Whitespace marginTop={8} /> */}

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
              {/* <Container row center type="chip">
              <CardDisplay
                leftImageWidth={16}
                leftImageHeight={16}
                leftImageSrc={logo}
                numberOfLines={2}
                description={
                  <Typography type="levelOneThick" size={12} color="#717171">
                    Your inquiry for 1 guest on Feb 13 - 14 has been sent.{' '}
                    <Typography type="link" color="#717171">
                      Show listing
                    </Typography>
                  </Typography>
                }
                center
                bold
              />
            </Container>

            <Whitespace marginTop={24} /> */}

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
      {/* <Typography type="levelOneThick" size={12} color="#717171">
        Aug 23, 2022
      </Typography>

      <Whitespace marginTop={24} />

      <Container row center type="chip">
        <CardDisplay
          leftImageWidth={16}
          leftImageHeight={16}
          leftImageSrc={logo}
          numberOfLines={2}
          description={
            <Typography type="levelOneThick" size={12} color="#717171">
              Your inquiry for 1 guest on Feb 13 - 14 has been sent.{' '}
              <Typography type="link" color="#717171">
                Show listing
              </Typography>
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={24} />

      <CardDisplay
        leftImageCircle={38}
        leftImageSrc={moon}
        name="Dolly 2"
        location="4:26 PM"
        description="Looking forward to staying"
        bold={false}
      />

      <Whitespace marginTop={24} />

      <Container row center type="chip">
        <CardDisplay
          leftImageWidth={16}
          leftImageHeight={16}
          leftImageSrc={logo}
          numberOfLines={2}
          description={
            <Typography type="levelOneThick" size={12} color="#717171">
              Your reservation is confirmed for 1 guest on Feb 13 - 14.{' '}
              <Typography type="link" color="#717171">
                Show reservation
              </Typography>
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={24} />

      <CardDisplay
        leftImageCircle={38}
        leftImageSrc={moon}
        name="Dolly"
        location="4:26 PM"
        description="Sorry I need to cancel"
        bold={false}
      />

      <Whitespace marginTop={16} />

      <Typography type="levelOneThick" size={12} color="#717171">
        UNREAD
      </Typography>

      <Whitespace marginTop={24} />

      <Container row center type="chip">
        <CardDisplay
          leftImageWidth={16}
          leftImageHeight={16}
          leftImageSrc={logo}
          description={
            <Typography type="levelOneThick" size={12} color="#717171">
              Reservation cancelled by guest
            </Typography>
          }
          center
          bold
        />
      </Container> */}
    </Page>
  );
};

export default Chat;
