import React, {useState, useEffect, useCallback} from 'react';
import {Platform, PermissionsAndroid, Linking, Alert} from 'react-native';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {API, graphqlOperation} from 'aws-amplify';
import sha256 from 'sha256';
import {Player, Recorder} from '@react-native-community/audio-toolkit';
import {STREAM_CHAT_KEY} from 'react-native-dotenv';
import {StreamChat} from 'stream-chat';

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
  Image,
} from '../../components';

import arrowLeft from '../../assets/images/arrow-left.png';
import menu from '../../assets/images/menu.png';
// import logo from '../../assets/images/logo.png';
// import microphone from '../../assets/images/microphone.png';
import moon from '../../assets/images/moon.png';
import listing from '../../assets/images/listing.png';
import share from '../../assets/images/share.png';
import stopImg from '../../assets/images/stop.png';
import sendImg from '../../assets/images/send.png';
import {global} from '../../assets/styles';

import * as Utils from '../../utils';

const path = 'test.mp4';

const Chat = props => {
  const {
    route: {
      params: {home_id, channel_id, members} = {
        home_id: '7225607a-fd99-4f33-a32f-03de3dd04974',
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
  const [recorder, setRecorder] = useState(null);
  const [player, setPlayer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isRecording, setIsRecording] = useState(null);

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

  const makeUri = useCallback(uri => ({uri}), []);

  const load = useCallback(() => {
    setPlayer(
      new Player(path, {
        autoDestroy: false,
        continuesToPlayInBackground: true,
        mixWithOthers: true,
      }).prepare(),
    );

    setRecorder(
      new Recorder(path, {
        bitrate: 256000,
        channels: 2,
        sampleRate: 44100,
        quality: 'max',
      }).prepare(),
    );
  }, []);

  const record = useCallback(async () => {
    setIsRecording(null);

    const options = {
      title: 'Microphone Permission',
      message: 'Rentit needs access to your microphone.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    };

    (Platform.OS === 'ios'
      ? Permissions.request(PERMISSIONS.IOS.MICROPHONE)
      : PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, options)
    )
      .then(async grant => {
        if (grant === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          return Linking.openSettings();
        }

        if (grant === PermissionsAndroid.RESULTS.GRANTED) {
          recorder.toggleRecord(e => {
            if (e) {
              console.error('An error occurred while attempting to start recording, Retrying.', e);
              return setTimeout(record, 2000);
            }

            const startTime = new Date().getTime();
            const id = setInterval(() => {
              setIsRecording(recorder.isRecording);

              if (recorder.isRecording) {
                const _s = (new Date().getTime() - startTime) / 1000;
                const s = Math.floor(_s);
                const min = Math.floor(_s / 60);
                const sec = s % 60 < 10 ? `0${s % 60}` : s % 60;
                setCountdown(`${min}:${sec}`);
              }
            }, 1000);
            setIntervalId(id);
          });
        }
      })
      .catch(console.error);
  }, [recorder]);

  const stop = useCallback(async () => {
    if (typeof recorder?.stop !== 'function') {
      return true;
    }

    return new Promise(resolve => {
      recorder.toggleRecord(e => {
        if (e) {
          console.error('An error occurred while attempting to stop recording, Retrying.', e);
          return setTimeout(async () => {
            resolve(await stop());
          }, 2000);
        }

        setIsRecording(false);

        if (__DEV__) {
          setTimeout(() => {
            player.playPause((err, paused) => {
              if (err) {
                console.error('An error occurred while attempting to playback the audio:', err);
              }
              console.debug('Now Playing', paused);
            });
          }, 2000);
        }

        if (recorder) {
          recorder.destroy();
        }

        if (player) {
          player.destroy();
        }

        if (intervalId) {
          clearInterval(intervalId);
        }

        load();

        resolve(true);
      });
    });
  }, [intervalId, recorder, player, load]);

  const send = useCallback(async () => {
    if (!channel || /^\s{0,}$/.test(message)) {
      return;
    }

    let text = message;
    let attachments;
    const voiceRecording = recorder?.fsPath;
    // console.log('Get Blob', await Utils.getBlob(path).catch(console.error));
    if (voiceRecording) {
      text = `Voice message: ${Utils.randomInt(999999999)}.mp3`;
      attachments = [
        {
          type: 'voiceRecording',
          asset_url: voiceRecording,
        },
      ];
    }

    await stop();
    await channel.markRead();
    await channel.sendMessage({
      text,
      timestamp: new Date().getTime(),
      sender_id: sender.uid,
      attachments,
    });
  }, [channel, message, recorder, stop, sender]);

  useEffect(() => {
    load();

    const client = StreamChat.getInstance(STREAM_CHAT_KEY || '');
    let _channel;

    (async () => {
      setLoading(true);

      if (!home_id) {
        console.error('Home ID is required.');
        return;
      }

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
          console.error('There was no supervisor id');
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
      _channel = client.channel(
        'messaging',
        channel_id || sha256(`${user.uid}-${home_id}-${_receiver.uid}`),
        {
          ..._receiver,
          name: _receiver.displayName || _receiver.fname || _receiver.lname,
          image: _receiver.userImg || _receiver.photoUrl,
          members: members || [user.uid, _receiver.uid, _supervisor.uid],
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
        console.debug('You have a new message:', JSON.stringify(event));
        setMessage('');
        setMessages(oldMessages => [event.message, ...oldMessages]);
      });

      client.on('notification.message_new', event => {
        if (event.total_unread_count !== undefined) {
          Alert.alert(`You have ${event.total_unread_count} unread messages.`);
        }

        if (event.unread_channels !== undefined) {
          Alert.alert(`You have ${event.unread_channels} new messages`);
        }
      });
    })().catch(e => console.error('There was an issue loading the chat', e, JSON.stringify(e)));

    return () => {
      client.disconnectUser(1);
      if (_channel) {
        _channel.markRead();
      }
    };
  }, [getRandomDefaultSupervisor, getRandomMarketer, home_id, channel_id, members, load]);

  let currentDay, nextDay;

  if (!receiver.displayName && (receiver.fname || receiver.lname)) {
    receiver.displayName = receiver.fname || receiver.lname || '';
  }

  if (!receiver.displayName) {
    return <PageSpinner />;
  }

  return (
    <>
      <Page
        leftIcon={arrowLeft}
        rightIcon={menu}
        scrollToBottom
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

            <Container row center type="spaceBetween" width="100%" height={50}>
              {isRecording ? (
                <Container row type="spaceBetween" width="50%">
                  <Container center onPress={stop} width={35} height={25}>
                    <Image src={stopImg} width={25} height={25} />
                  </Container>

                  <Typography size={20} height={25} weight="900">
                    {countdown}
                  </Typography>

                  <Container center onPress={send} width={35} height={25}>
                    <Image src={sendImg} width={25} height={25} />
                  </Container>
                </Container>
              ) : (
                <>
                  <Container center width="100%">
                    <Input
                      inline
                      placeholder="Write a message"
                      type="text"
                      onSubmitEditing={send}
                      value={message}
                      onChange={setMessage}
                      trim={false}
                    />
                  </Container>

                  {/* <Container
                    center
                    type="right-5"
                    onPress={record}
                    color="#fff"
                    width={35}
                    height={25}>
                    <Image src={microphone} width={25} height={25} />
                  </Container> */}
                </>
              )}
            </Container>
          </>
        }>
        {!loading ? (
          messages.map((msg, i) => {
            nextDay = Utils.formatDate((messages[i + 1] || msg).created_at);
            currentDay = Utils.formatDate(msg.created_at);
            const date = new Date(msg.created_at);
            const {user} = msg;

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
