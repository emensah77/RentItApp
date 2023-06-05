import React, {useMemo, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {StreamChat} from 'stream-chat';

import {Page, Whitespace, Tabs, Divider, CardDisplay} from '../../components';

const Inbox = () => {
  const [, /* channels */ setChannels] = useState([]);

  useEffect(() => {
    const client = StreamChat.getInstance('dz5f4d5kzrue'); // 'upcrj3b3pp7v');

    (async () => {
      const user = auth().currentUser;
      const _channels = await client.queryChannels(
        {type: 'messaging', members: {$in: [user.uid]}},
        [{last_message_at: -1}],
        {
          watch: true, // this is the default
          state: true,
        },
      );
      setChannels(_channels);
    })().catch(e => console.error('There was an issue loading the chat', e));
  }, []);

  const messages = useMemo(
    () => [
      {
        name: 'Darkcoco.',
        location: 'Manchester.',
        description:
          'Rentit update: Reservation canceled. Rentit update: Reservation canceled. Rentit  update: Reservation canceled.',
        status: 'Cancelled',
        date: 'Feb 13 - 14, 2023',
        read: true,
        src: '',
      },
      {
        name: 'Betty.',
        location: 'London.',
        description: 'New date and time request.',
        status: 'Request pending',
        date: '',
        read: false,
        src: '...',
      },
    ],
    [],
  );

  const notifications = useMemo(
    () => [
      {
        name: '',
        location: '',
        description:
          "We'll send your $49.19 (USD) refund\nright away. It may take your bank 3-5\ndays to deposit it in your account",
        status: '',
        date: 'August 23, 2023',
        read: true,
        src: '...',
      },
    ],
    [],
  );

  const content = useMemo(
    () => [
      {
        title: 'Messages',
        content: messages.map(({name, location, description, status, date, read, src}, i) => (
          <React.Fragment key={name}>
            <CardDisplay
              leftImageCircle={60}
              leftImageSrc={src}
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
        content: notifications.map(({name, location, description, status, date, read, src}, i) => (
          <React.Fragment key={name}>
            <CardDisplay
              leftImageCircle={60}
              leftImageSrc={src}
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
    [messages, notifications],
  );

  return (
    <Page type="large" header="Inbox">
      <Whitespace marginTop={40} />

      <Tabs content={content} />
    </Page>
  );
};

export default Inbox;
