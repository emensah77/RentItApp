import React, {useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {startCase, camelCase} from 'lodash';
import auth from '@react-native-firebase/auth';

import {Typography, Header, Container, Whitespace, CardDisplay, Loader} from '../../../components';
import hamburger from '../../../assets/images/hamburger.png';

const MyRequests = props => {
  const {
    route: {name},
  } = props;

  const [data, setData] = useState([]);

  const navigation = useNavigation();

  const keyExtractor = useCallback(item => item.DemandID, []);

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
                Demand ID: {item.DemandID}
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
    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/claimedDemands?marketerId=${
        auth().currentUser.uid
      }&pageSize=${30}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('An error occurred while fetching demands', e));
    if (!response) {
      return;
    }
    const _data = await response.json();
    setData(_data.items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Header leftIcon={hamburger} onClose={navigation.toggleDrawer}>
        {startCase(camelCase(name))}
      </Header>

      <Container height="90%" color="#FFF">
        <Whitespace paddingTop={10} />

        {data.length > 0 ? (
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
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
};

export default MyRequests;
