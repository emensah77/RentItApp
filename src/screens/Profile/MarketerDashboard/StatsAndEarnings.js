import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {Modal} from 'react-native';
import {startCase, camelCase} from 'lodash';
import auth from '@react-native-firebase/auth';

import HomeForm from './HomeForm';

import {
  Page,
  Typography,
  Header,
  Container,
  Whitespace,
  CardDisplay,
  Input,
  Image,
  GenericList,
} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';
import pending from '../../../assets/images/markers/pending.png';
import rejected from '../../../assets/images/markers/rejected.png';
import approved from '../../../assets/images/markers/approved.png';
import {formatDate} from '../../../utils';

const StatsAndEarnings = () => {
  const [start, setStart] = useState(formatDate(Date.now() - 24 * 3600 * 1000, 2));
  const [end, setEnd] = useState(formatDate(new Date(), 2));
  const [data, setData] = useState({});
  const [open, setOpen] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onToggle = useCallback(
    item => () => {
      setOpen(item);
    },
    [],
  );

  const setCurrentEditId = useCallback(
    _editId => () => {
      setEditId(_editId);
      setTimeout(onToggle(''), 100);
    },
    [onToggle],
  );

  const buttons = useMemo(
    () => [
      {
        text: 'Edit',
        action: (_, index) => setCurrentEditId(index)(),
        condition: () => open === 'pending',
      },
    ],
    [open, setCurrentEditId],
  );

  const load = useCallback(async () => {
    if (!start || !end) {
      return;
    }

    setLoading(true);

    const formattedStartDate = formatDate(start, 3);
    const formattedEndDate = formatDate(end, 3, true);

    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/stats?startTime=${formattedStartDate}&endTime=${formattedEndDate}&userId=${
        auth().currentUser.uid
      }&pageSize=${30}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('An error occurred while fetching stats', e));
    if (!response) {
      return;
    }
    const _data = await response.json();
    setData(_data);

    setLoading(false);
  }, [start, end]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Page type="drawer" header="Stats and Earnings">
      <Typography size={12} left width="100%">
        Start Date
      </Typography>

      <Whitespace marginTop={-20} />

      <Input
        placeholder="Start Date"
        type="date"
        name="start"
        label="Start Date"
        value={start}
        onChange={setStart}
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        End Date
      </Typography>

      <Whitespace marginTop={-20} />

      <Input
        placeholder="End Date"
        type="date"
        name="end"
        label="End Date"
        value={end}
        onChange={setEnd}
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Container
        type="chipDeSelected"
        color="#FFF"
        height={100}
        width="100%"
        onPress={onToggle('pending')}>
        <CardDisplay
          name={<Image src={pending} width={20} height={20} />}
          location={
            <Typography left size={18} weight="700" width="100%">
              Pending
            </Typography>
          }
          status={
            <Typography numberOfLines={1} left size={14} weight="500" width="200%">
              {loading ? '...' : data?.pending?.count || 0} Homes
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={30} />

      <Container
        type="chipDeSelected"
        color="#FFF"
        height={100}
        width="100%"
        onPress={onToggle('rejected')}>
        <CardDisplay
          name={<Image src={rejected} width={20} height={20} />}
          location={
            <Typography left size={18} weight="700" width="100%">
              Rejected
            </Typography>
          }
          status={
            <Typography numberOfLines={1} left size={14} weight="500" width="200%">
              {loading ? '...' : data?.rejected?.count || 0} Homes
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={30} />

      <Container
        type="chipDeSelected"
        color="#FFF"
        height={100}
        width="100%"
        onPress={onToggle('approved')}>
        <CardDisplay
          name={<Image src={approved} width={20} height={20} />}
          location={
            <Typography left size={18} weight="700" width="100%">
              Approved
            </Typography>
          }
          status={
            <Typography numberOfLines={1} left size={14} weight="500" width="200%">
              {loading ? '...' : data?.approved?.count || 0} Homes
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={30} />

      {!!open && (
        <Modal animationType="slide" visible>
          <Header onClose={onToggle('')}>{startCase(camelCase(`${open} Homes`))}</Header>

          <GenericList
            flatten
            list={data?.[open]?.homes}
            id="id"
            loading={loading}
            buttons={buttons}
          />
        </Modal>
      )}

      {editId !== null && data?.pending?.homes.length > 0 && (
        <Modal animationType="slide" visible>
          <Page>
            <HomeForm
              data={data?.pending?.homes?.[editId]}
              onSuccess={setCurrentEditId(null)}
              onClose={setCurrentEditId(null)}
            />
          </Page>
        </Modal>
      )}
    </Page>
  );
};

export default StatsAndEarnings;
