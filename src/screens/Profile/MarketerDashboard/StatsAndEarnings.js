import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {startCase, camelCase} from 'lodash';
import auth from '@react-native-firebase/auth';

import {
  Page,
  Typography,
  Header,
  Container,
  Whitespace,
  CardDisplay,
  Input,
  Image,
} from '../../../components';
import hamburger from '../../../assets/images/hamburger.png';
import arrowDown from '../../../assets/images/arrow-down.png';
import pending from '../../../assets/images/markers/pending.png';
import rejected from '../../../assets/images/markers/rejected.png';
import approved from '../../../assets/images/markers/approved.png';

const StatsAndEarnings = props => {
  const {
    route: {name},
  } = props;

  const [start, setStart] = useState(new Date(Date.now() - 24 * 3600 * 1000).toISOString());
  const [end, setEnd] = useState(new Date().toISOString());
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const load = useCallback(async () => {
    if (!start || !end) {
      return;
    }

    setLoading(true);

    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/stats?startTime=${new Date(
        start,
      ).toISOString()}&endTime=${new Date(end).toISOString()}&userId=${
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
    <>
      <Header leftIcon={hamburger} onClose={navigation.toggleDrawer}>
        {startCase(camelCase(name))}
      </Header>

      <Page>
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

        <Container type="chipDeSelected" color="#FFF" height={100} width="100%">
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

        <Container type="chipDeSelected" color="#FFF" height={100} width="100%">
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

        <Container type="chipDeSelected" color="#FFF" height={100} width="100%">
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
      </Page>
    </>
  );
};

export default StatsAndEarnings;
