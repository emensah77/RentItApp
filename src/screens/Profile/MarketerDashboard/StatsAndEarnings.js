import React, {useState, useCallback, useEffect} from 'react';
import {Modal, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
  Button,
} from '../../../components';
import hamburger from '../../../assets/images/hamburger.png';
import arrowDown from '../../../assets/images/arrow-down.png';
import pending from '../../../assets/images/markers/pending.png';
import rejected from '../../../assets/images/markers/rejected.png';
import approved from '../../../assets/images/markers/approved.png';
import {formatDate} from '../../../utils';

const StatsAndEarnings = props => {
  const {
    route: {name},
  } = props;

  const [start, setStart] = useState(formatDate(Date.now() - 24 * 3600 * 1000, 2));
  const [end, setEnd] = useState(formatDate(new Date(), 2));
  const [data, setData] = useState({});
  const [open, setOpen] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

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

  const keyExtractor = useCallback(item => item.id, []);

  const renderItem = useCallback(
    ({item, index}) => {
      const keys = Object.keys(item);
      // Sample data rendered
      // {"aircondition": "", "availabilityDate": "2023-08-07", "available": "", "bathroom": "", "bathroomNumber": 0, "bed": 0, "bedroom": 0, "createdTime": "2023-06-09T12:46:19.840Z", "currency": [], "description": "OPPOSITE BREAD BAKERY PEREGRRINO BRIAMAH ROAD ACCRA NEWTOWN RAACO", "furnished": "", "homeownerName": "NANA IDAN", "id": "7cd196cc-ef32-4dba-8dad-0c747e1cb2c5", "image": "", "images": [], "kitchen": "", "latitude": 5.5880209, "locality": "Greater Accra", "longitude": -0.2090894, "loyaltyProgram": "", "marketerNumber": ["233597285099"], "maxGuests": 0, "mode": "", "negotiable": "", "neighborhood": "RAACO", "newPrice": 0, "oldPrice": 0, "phoneNumbers": ["0553587515"], "reviews": [], "status": "pending", "sublocality": "AYAWASO CENTRAL MUNICIPAL", "title": "default Title", "toilet": "", "type": "defaultType", "updatedBy": "r3G0H4PGxFfqniM4iozlMPOHert2", "updatedTime": "2023-08-07T08:53:44.984Z", "userID": "", "verified": "", "videoUrl": "", "water": "", "wifi": ""}
      return (
        <>
          <Container type="chipDeSelected" height="auto" width="100%">
            <CardDisplay
              numberOfLines={keys.length}
              name={
                <Typography type="notice" size={18} weight="700">
                  ID: {item.id}
                </Typography>
              }
              description={keys.sort().map(dataKey => (
                <React.Fragment
                  key={`${index},${dataKey},${
                    typeof item[dataKey] === 'object'
                      ? JSON.stringify(item[dataKey])
                      : item[dataKey]
                  }`}>
                  {dataKey !== 'id' ? (
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

            {open === 'pending' && (
              <Container width="100%" type="spaceBetween">
                <Button type="standard" onPress={setCurrentEditId(index)}>
                  Edit
                </Button>
              </Container>
            )}
          </Container>

          <Whitespace marginTop={33} />
        </>
      );
    },
    [open, setCurrentEditId],
  );

  const load = useCallback(async () => {
    if (!start || !end) {
      return;
    }

    setLoading(true);

    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/stats?startTime=${formatDate(
        start,
        3,
      )}&endTime=${formatDate(end, 3)}&userId=${auth().currentUser.uid}&pageSize=${30}`,
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
      </Page>

      {!!open && (
        <Modal animationType="slide" visible>
          <Header onClose={onToggle('')}>{startCase(camelCase(`${open} Homes`))}</Header>

          <Container type="row" width="90%" height="100%" center>
            <FlatList
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              persistentScrollbar
              showsVerticalScrollIndicator={false}
              data={data?.[open]?.homes}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </Container>
        </Modal>
      )}

      {editId !== null && data?.pending?.homes.length > 0 && (
        <Modal animationType="slide" visible>
          <Page>
            <HomeForm
              onLeftIconPress={setCurrentEditId(null)}
              data={data?.pending?.homes?.[editId]}
              onSuccess={setCurrentEditId(null)}
            />
          </Page>
        </Modal>
      )}
    </>
  );
};

export default StatsAndEarnings;
