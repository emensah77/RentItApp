import React, {useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {startCase, camelCase} from 'lodash';
import auth from '@react-native-firebase/auth';

import {
  Page,
  Typography,
  Header,
  Container,
  Whitespace,
  Dropdown,
  Button,
  CardDisplay,
  Loader,
} from '../../../components';
import hamburger from '../../../assets/images/hamburger.png';
import arrowDown from '../../../assets/images/arrow-down.png';
import {localities, getSubLocalities} from '../../../utils';

const AllDemands = props => {
  const {
    route: {name},
  } = props;

  const [locality, setLocality] = useState({value: ''});
  const [subLocality, setSubLocality] = useState({value: ''});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(-1);
  const [nextKey, setNextKey] = useState(null);
  // const [count, setCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  const keyExtractor = useCallback(item => item.DemandID, []);

  const fetchData = useCallback(
    async startKey => {
      const url = `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/demands?locality=${encodeURIComponent(
        locality.value,
      )}&sublocality=${encodeURIComponent(subLocality.value)}&pageSize=${30}${
        startKey ? `&startKey=${startKey}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response) return null;

      return response.json();
    },
    [locality.value, subLocality.value],
  );

  const load = useCallback(async () => {
    setData([]);
    setLoading(0);

    const _data = await fetchData();
    if (_data) {
      setData(_data.items);
      // setCount(_data.count);
      setNextKey(_data.nextKey || null);
    }

    setLoading(-1);
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (!nextKey) return;
    setLoadingMore(true);
    const _data = await fetchData(nextKey.DemandID);
    if (_data) {
      // Skip the first item (which is the last item of the previous set) using slice
      const newData = _data.items.slice(1);
      setData(prevData => [...prevData, ...newData]);
      // setCount(prevCount => prevCount + _data.count);
      setNextKey(_data.nextKey || null);
    }

    setLoadingMore(false);
  }, [fetchData, nextKey]);

  const handleEndReached = useCallback(() => {
    if (nextKey) {
      loadMore();
    }
  }, [nextKey, loadMore]);

  const claim = useCallback(
    (DemandId, i) => async () => {
      setLoading(i);

      const response = await fetch(
        'https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/claim',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({marketerId: auth().currentUser.uid, DemandId}),
        },
      ).catch(e => console.error('An error occurred while creating a claim', e));
      if (!response) {
        return;
      }
      const _data = await response.json();
      if (_data.Claimed || _data.Status === 'Claimed') {
        load();
      }
    },
    [load],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      const keys = Object.keys(item);
      // Sample data rendered
      // {"Claimed": true, "ClientNumber": "233208667241", "DateClaimed": "2023-07-15T12:13:50.435Z", "DateCreated": "2023-07-15T12:13:16.216Z", "DemandID": "5751750e-43ea-4c18-b480-8563c07350b4", "Description": "Single room self contain ", "HomeType": "self Contained", "Locality": "Upper West", "MarketerID": "7GB5JGokUiTMSXsRDHRtDAlapJr2", "Name": "Fredrick ", "Neighborhood": "Bamahu ", "Price": "142", "Status": "Claimed", "Sublocality": "WA MUNICIPAL", "Type": "for rent"}
      // {"DateCreated": "2023-08-01T16:37:29.355Z", "DemandID": "6da2b636-9a77-4e37-935b-1ddb76265e07", "Status": "Open", "locality": "", "pageSize": 30, "subLocality": ""}
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
                    typeof item[dataKey] === 'object'
                      ? JSON.stringify(item[dataKey])
                      : item[dataKey]
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

            {item.Status === 'Open' && (
              <Container width="100%" type="spaceBetween">
                <Button
                  loading={loading === index}
                  type="standard"
                  onPress={claim(item.DemandID, index)}>
                  Claim
                </Button>
              </Container>
            )}
          </Container>

          <Whitespace marginTop={33} />
        </>
      );
    },
    [claim, loading],
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Header leftIcon={hamburger} onClose={navigation.toggleDrawer}>
        {startCase(camelCase(name))}
      </Header>

      <Container height="90%" color="#FFF">
        <Page>
          <Typography size={12} left width="100%">
            Locality
          </Typography>

          <Whitespace marginTop={-20} />

          <Dropdown
            onChange={setLocality}
            value={locality.value}
            data={localities}
            displayKey="value"
            label="Locality"
            suffix={arrowDown}
          />

          <Whitespace marginTop={15} />

          <Typography size={12} left width="100%">
            Sub locality
          </Typography>

          <Whitespace marginTop={-20} />

          <Dropdown
            onChange={setSubLocality}
            value={subLocality.value}
            data={getSubLocalities(locality.value || localities[0].value)}
            displayKey="value"
            label="Sub Localities"
            suffix={arrowDown}
          />
        </Page>

        {data.length === 0 && loading === -1 ? (
          <Typography>There are no demands to show</Typography>
        ) : data.length > 0 ? (
          <Container type="row" width="90%" height="60%" center>
            <Whitespace width="1%" />

            <FlatList
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              persistentScrollbar
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <Loader /> : null}
            />
          </Container>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
};

export default AllDemands;
