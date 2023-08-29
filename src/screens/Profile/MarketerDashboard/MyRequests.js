import React, {useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import {startCase, camelCase} from 'lodash';
import auth from '@react-native-firebase/auth';

import {
  Typography,
  Container,
  Whitespace,
  CardDisplay,
  Loader,
  Input,
  Page,
} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';
import {formatDate} from '../../../utils';

const MyRequests = () => {
  const [start, setStart] = useState(formatDate(Date.now() - 24 * 3600 * 1000, 2));
  const [end, setEnd] = useState(formatDate(new Date(), 2));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const keyExtractor = useCallback(item => item.requestID, []);

  const renderItem = useCallback(({item, index}) => {
    const keys = Object.keys(item);
    // Sample data rendered
    // {"Claimed": true, "ClientNumber": "233208667241", "DateClaimed": "2023-08-02T10:46:01.157Z", "DateCreated": "2023-07-15T12:13:16.216Z", "DemandID": "5751750e-43ea-4c18-b480-8563c07350b4", "Description": "Single room self contain ", "HomeType": "self Contained", "Locality": "Upper West", "MarketerID": "9BXcEnla6WNrPXmKudvwjFyGhU33", "Name": "Fredrick ", "Neighborhood": "Bamahu ", "Price": "142", "Status": "Claimed", "Sublocality": "WA MUNICIPAL", "Type": "for rent"}
    return (
      <>
        <Container type="chipDeSelected" height="auto" width="100%">
          <CardDisplay
            numberOfLines={keys.length}
            name={
              <Typography type="notice" size={18} weight="700">
                Status: {item.status}
              </Typography>
            }
            description={keys.sort().map(dataKey => (
              <React.Fragment
                key={`${index},${dataKey},${
                  typeof item[dataKey] === 'object' ? JSON.stringify(item[dataKey]) : item[dataKey]
                }`}>
                {dataKey !== 'MarketerID' &&
                dataKey !== 'ClientNumber' &&
                dataKey !== 'DemandID' ? (
                  <>
                    <Typography type="notice" color="#4D4D4D" size={14} weight="500" width="90%">
                      {startCase(camelCase(dataKey))}
                      {': '}
                      {typeof item[dataKey] === 'object'
                        ? JSON.stringify(item[dataKey])
                        : item[dataKey]}
                    </Typography>

                    {'\n'}
                  </>
                ) : null}
              </React.Fragment>
            ))}
            center
            bold
          />
        </Container>

        <Whitespace marginTop={33} />
      </>
    );
  }, []);

  const load = useCallback(async () => {
    setLoading(true);

    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/marketerrequest?marketerID=${
        auth().currentUser.uid
      }&startDate=${formatDate(start, 3)}&endDate=${formatDate(end, 3)}&pageSize=30`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('An error occurred while fetching requests', e));
    if (!response || !response.ok) {
      setLoading(false);
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
    <Page type="drawer" header="My Requests">
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

      <Container height="90%" color="#FFF">
        <Whitespace paddingTop={10} />

        {data && data.length > 0 ? (
          <Container type="row" width="90%" center>
            <Whitespace width="1%" />

            <FlatList
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              persistentScrollbar
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </Container>
        ) : loading === true ? (
          <Loader />
        ) : null}
      </Container>
    </Page>
  );
};

export default MyRequests;
