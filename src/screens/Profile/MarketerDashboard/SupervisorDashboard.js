import React, {useState, useEffect, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  Page,
  Dropdown,
  Input,
  Container,
  CardDisplay,
  Typography,
  Image,
  Whitespace,
} from '../../../components';
import {formatDate} from '../../../utils';
import pendingImage from '../../../assets/images/markers/pending.png'; // Update these paths
import rejectedImage from '../../../assets/images/markers/rejected.png';
import approvedImage from '../../../assets/images/markers/approved.png';

const SupervisorDashboard = () => {
  const [marketers, setMarketers] = useState([]);
  const [selectedMarketerId, setSelectedMarketerId] = useState('');
  const [startDate, setStartDate] = useState(formatDate(Date.now() - 24 * 3600 * 1000, 2));
  const [endDate, setEndDate] = useState(formatDate(new Date(), 2));
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supervisorId = auth().currentUser.uid;
    const unsubscribe = firestore()
      .collection('users')
      .where('supervisor_id', '==', supervisorId)
      .onSnapshot(
        snapshot => {
          const fetchedMarketers = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setMarketers(fetchedMarketers);
        },
        error => {
          console.error('Error fetching real-time marketers: ', error);
        },
      );

    return () => unsubscribe();
  }, []);

  const handleMarketerChange = useCallback(selectedId => {
    setSelectedMarketerId(selectedId.uid); // Assuming 'uid' is the correct identifier
  }, []);

  const fetchStats = useCallback(async () => {
    if (!selectedMarketerId || !startDate || !endDate) {
      return;
    }

    setLoading(true);

    const formattedStartDate = formatDate(startDate, 3);
    const formattedEndDate = formatDate(endDate, 3, true);

    try {
      const response = await fetch(
        `https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/stats?startTime=${formattedStartDate}&endTime=${formattedEndDate}&userId=${selectedMarketerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      setStats(data);
    } catch (e) {
      console.error('An error occurred while fetching stats', e);
    }

    setLoading(false);
  }, [endDate, selectedMarketerId, startDate]);

  useEffect(() => {
    fetchStats();
  }, [selectedMarketerId, startDate, endDate, fetchStats]);

  return (
    <Page type="large" header="Supervisor Dashboard">
      <Dropdown
        data={marketers}
        displayKey="fname"
        value={selectedMarketerId}
        label="Select a Marketer"
        onChange={handleMarketerChange}
      />

      <Input type="date" label="Start Date" value={startDate} onChange={setStartDate} />

      <Input type="date" label="End Date" value={endDate} onChange={setEndDate} />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Whitespace marginTop={30} />

          <Container type="chipDeSelected" color="#FFF" height={100} width="100%">
            <CardDisplay
              name={<Image src={pendingImage} width={20} height={20} />}
              location={
                <Typography left size={18} weight="700" width="100%">
                  Pending
                </Typography>
              }
              status={
                <Typography numberOfLines={1} left size={14} weight="500" width="200%">
                  {stats?.pending?.count || 0} Homes
                </Typography>
              }
              center
              bold
            />
          </Container>

          <Whitespace marginTop={30} />

          <Container type="chipDeSelected" color="#FFF" height={100} width="100%">
            <CardDisplay
              name={<Image src={approvedImage} width={20} height={20} />}
              location={
                <Typography left size={18} weight="700" width="100%">
                  Approved
                </Typography>
              }
              status={
                <Typography numberOfLines={1} left size={14} weight="500" width="200%">
                  {stats?.approved?.count || 0} Homes
                </Typography>
              }
              center
              bold
            />
          </Container>

          <Whitespace marginTop={30} />

          <Container type="chipDeSelected" color="#FFF" height={100} width="100%">
            <CardDisplay
              name={<Image src={rejectedImage} width={20} height={20} />}
              location={
                <Typography left size={18} weight="700" width="100%">
                  Rejected
                </Typography>
              }
              status={
                <Typography numberOfLines={1} left size={14} weight="500" width="200%">
                  {stats?.rejected?.count || 0} Homes
                </Typography>
              }
              center
              bold
            />
          </Container>

          <Whitespace marginTop={30} />
        </>
      )}
    </Page>
  );
};

export default SupervisorDashboard;
