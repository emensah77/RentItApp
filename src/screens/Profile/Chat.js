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
import {global} from '../../assets/styles';

import * as Utils from '../../utils';

const Chat = props => {
  const {
    route: {
      params: {home_id} = {
        home_id: 'd556eed0-e704-47c8-9f5c-64da6447a186',
        // Regular: '7225607a-fd99-4f33-a32f-03de3dd04974', 'ac1d2480-4b86-4d19-87bd-4674e433b179'
        // Home with no marketer ID: d556eed0-e704-47c8-9f5c-64da6447a186
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

  const getRandomMarketer = useCallback(async (bannedIds = []) => {
    const marketersSnapshot = await firestore()
      .collection('users')
      .where('marketer_status', '==', 'ACCEPTED')
      .get();

    const marketers = marketersSnapshot.docs
      .filter(item => !bannedIds.includes(item.id))
      .map(doc => ({...doc.data(), uid: doc.id}));
    return marketers[Math.floor(Math.random() * marketers.length)] || {};
  }, []);

  const getRandomDefaultSupervisor = useCallback(async (bannedIds = []) => {
    const defaultSupervisorsSnapshot = await firestore().collection('defaultSupervisors').get();

    const defaultSupervisors = defaultSupervisorsSnapshot.docs
      .filter(item => !bannedIds.includes(item.id))
      .map(doc => ({
        ...doc.data(),
        uid: doc.id,
      }));

    return defaultSupervisors[Math.floor(Math.random() * defaultSupervisors.length)] || {};
  }, []);

  const send = useCallback(async () => {
    if (!channel || /^\s{0,}$/.test(message)) {
      return;
    }

    await channel.sendMessage({
      text: message,
      timestamp: new Date().getTime(),
      sender_id: sender.uid,
    });
  }, [channel, message, sender]);

  useEffect(() => {
    const client = StreamChat.getInstance(STREAM_CHAT_KEY);

    (async () => {
      setLoading(true);

      const user = auth().currentUser;
      const homeResult = await API.graphql(graphqlOperation(getPost, {id: home_id}));
      const _home = homeResult.data.getPost;
      let receiver_id = _home?.userID;

      if (!_home || !receiver_id) {
        const marketer = await getRandomMarketer([user.uid]).catch(e =>
          console.error('An error occurred while fetching a random marketer:', e),
        );
        receiver_id = marketer?.uid;
        if (!receiver_id) {
          console.error('There was no receiver id');
          return;
        }

        await API.graphql(
          graphqlOperation(updatePost, {input: {id: _home.id, userID: receiver_id}}),
        ).catch(e => console.error("An error occurred while updating the home's marketer ID:", e));
      }
      _home.formattedDate = Utils.formatDate(_home.createdAt);

      const __receiver = await firestore()
        .collection('users')
        .doc(receiver_id)
        .get()
        .catch(console.error);
      const _receiver = __receiver?.data();
      _receiver.uid = receiver_id;
      let _supervisor;

      if (_receiver?.supervisor_id) {
        const __supervisor = await firestore()
          .collection('users')
          .doc(_receiver?.supervisor_id)
          .get()
          .catch(console.error);
        _supervisor = __supervisor?.data();
        _supervisor.uid = _receiver?.supervisor_id;
      } else {
        _supervisor = await getRandomDefaultSupervisor([user.uid, _receiver.uid]).catch(e =>
          console.error('An error occurred while fetching a random default supervisor:', e),
        );
        if (!_supervisor.uid) {
          console.error('There was no _supervisor id');
          return;
        }

        await firestore()
          .collection('users')
          .doc(receiver_id)
          .set({
            ..._receiver,
            supervisor_id: _supervisor.uid,
          })
          .catch(e => console.error('Attempt to update supervisor ID failed', e));
      }

      __DEV__ &&
        console.debug(
          'Chat Between:',
          user.displayName,
          `(uid: ${user.uid})`,
          'and',
          _receiver.displayName || _receiver.fname || _receiver.lname,
          `(uid: ${_receiver.uid})`,
        );

      await Utils.promiseAll(
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
          ).catch(e => console.error('Attempt to fetch token failed', item, e));
          const response = await request.json();

          await client
            .connectUser(
              {
                id: item.uid,
                name: item.displayName || item.fname || item.lname,
                image: item.userImg || item.photoUrl,
              },
              response.token,
            )
            .catch(console.error);

          if (i === 0 || i === 1) {
            await client.disconnectUser(1);
          }
        },
        [_receiver, _supervisor, user],
      );

      delete _receiver.type;
      const _channel = client.channel(
        'messaging',
        sha256(`${user.uid}-${home_id}-${_receiver.uid}`),
        {
          ..._receiver,
          name: _receiver.displayName || _receiver.fname || _receiver.lname,
          image: _receiver.userImg || _receiver.photoUrl,
          members: [user.uid, _receiver.uid, _supervisor.uid],
        },
      );
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
      setReceiver(_receiver);
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
    })().catch(e => console.error('There was an issue loading the chat', e, JSON.stringify(e)));

    return () => client.disconnectUser(1);
  }, [getRandomDefaultSupervisor, getRandomMarketer, home_id]);

  const makeUri = useCallback(uri => ({uri}), []);

  let currentDay, nextDay;

  if (!receiver.displayName && (receiver.fname || receiver.lname)) {
    receiver.displayName = `${receiver.fname || receiver.lname || ''}`;
  }

  if (!receiver.displayName) {
    return <PageSpinner />;
  }

  return (
    <>
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
                  Chat supervised by{' '}
                  {supervisor.displayName || supervisor.fname || supervisor.lname || supervisor.uid}
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

                <Whitespace marginTop={20} />
              </React.Fragment>
            );
          })
        ) : (
          <Container center>
            <PageSpinner />
          </Container>
        )}

        <Whitespace marginTop={global.header.height} />

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

      <Container width="90%" height={100} type={`top-${global.header.height}-center`} color="#FFF">
        {home?.title ? (
          <>
            <CardDisplay
              leftImageWidth={30}
              leftImageHeight={30}
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
        ) : loading ? (
          <Loader spinner />
        ) : null}
      </Container>
    </>
  );
};

export default Chat;
