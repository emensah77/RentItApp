import React, {useState, useEffect, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {StreamChat} from 'stream-chat';

import {
  Page,
  Whitespace,
  Input,
  // Container,
  // Divider,
  CardDisplay,
  Typography,
} from '../../components';

import arrowLeft from '../../assets/images/arrow-left.png';
import menu from '../../assets/images/menu.png';
// import logo from '../../assets/images/logo.png';
import moon from '../../assets/images/moon.png';
// import listing from '../../assets/images/listing.png';
// import share from '../../assets/images/share.png';
// import temp from '../../assets/images/temp/temp1.png';

const Chat = props => {
  const {
    route: {params: {receiver_id} = {receiver_id: '000yhEHlwAarHPNrc2Xbwy9facw1'}},
  } = props;

  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState();
  const [, /* loading */ setLoading] = useState(false);

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

  useEffect(() => {
    const client = StreamChat.getInstance('dz5f4d5kzrue');

    (async () => {
      setLoading(true);

      const user = auth().currentUser;
      const _receiver = await firestore()
        .collection('users')
        .doc(receiver_id)
        .get()
        .catch(console.error);
      const recipient = _receiver?.data();
      recipient.uid = receiver_id;
      if (!recipient) {
        console.error('User not found', _receiver, recipient);
        return;
      }
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

      const _channel = client.channel('messaging', `${user.uid}-${recipient.uid}`, {
        ...recipient,
        name: recipient.displayName,
        image: recipient.userImg,
        members: [user.uid, recipient.uid],
      });

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
      setChannel(_channel);
      setLoading(false);

      await _channel.watch();
      _channel.on('message.new', event => {
        console.debug('You have a new message:', event);
        setMessage('');
        setMessages(oldMessages => [event.message, ...oldMessages]);
      });
    })().catch(e => console.error('There was an issue loading the chat', e));

    return () => client.disconnectUser();
  }, [receiver_id]);

  let currentDay, nextDay;

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
                Response time: 1 hour
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
      {/* <CardDisplay
        leftImageWidth={38}
        leftImageHeight={38}
        leftImageSrc={temp}
        numberOfLines={1}
        description={
          <Typography type="link" size={15} color="#252525">
            Stunning Family home close to the city
          </Typography>
        }
        status="Canceled"
        date="Feb 13 - 14"
        center
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

      <Divider /> */}

      {messages.map((msg, i) => {
        const date = new Date(msg.created_at);
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const nextDate = new Date((messages[i + 1] || msg).created_at);
        nextDay = `${months[nextDate.getMonth()]} ${nextDate.getDate()}, ${nextDate.getFullYear()}`;
        currentDay = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

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
              leftImageSrc={msg.user.image ? {uri: msg.user?.image} : moon}
              name={msg.user.name}
              location={`${
                date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
              }:${date.getMinutes()} ${date.getHours() > 12 ? 'PM' : 'AM'}`}
              description={msg.html.replace(/<\/?[^>]+(>|$)/g, '')}
              reverse={msg.user.id === sender.uid}
              bold={false}
            />

            {i === messages.length - 1 || nextDay !== currentDay ? (
              <>
                <Whitespace marginTop={24} />

                <Typography type="levelOneThick" size={12} color={msg.pending ? '#555' : '#717171'}>
                  {currentDay}
                </Typography>
              </>
            ) : null}
          </React.Fragment>
        );
      })}
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
