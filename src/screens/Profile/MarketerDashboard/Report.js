import React, {useState, useCallback, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import PhoneNumber from '../../Authentication/PhoneNumber';

import {
  Input,
  Typography,
  Button,
  Whitespace,
  Error,
  Dropdown,
  Page,
  Container,
  GenericList,
} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';
import {localities, getSubLocalities, formatDate} from '../../../utils';

const oldData = {
  // employeeId: '',
  employeeName: '',
  role: {value: ''},
  locality: {value: ''},
  sublocality: {value: ''},

  // Role Marketer
  homeApprovals: '',
  homeRentals: '',
  homeViewings: '',
  homeUploads: '',
  demands: '',
  remarks: '',
  contact: '',
  supervisor: {value: ''},

  // Role Supervisor
  totalMarketers: '',
  activeMarketers: '',
};

const ROLES = [{value: 'Marketer'}, {value: 'Supervisor'}];

const Report = () => {
  const [data, setData] = useState({...oldData});
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [start, setStart] = useState(formatDate(Date.now() - 24 * 3600 * 1000, 2));
  const [end, setEnd] = useState(formatDate(new Date(), 2));
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [mode, setMode] = useState('fetch');

  const changeMode = useCallback(
    _mode => () => {
      setMode(_mode);
    },
    [],
  );

  const onChangeData = useCallback(
    which => async value => {
      const _data = {...data, [which]: value};
      setData({..._data});
    },
    [data],
  );

  const submit = useCallback(async () => {
    setLoading(true);

    const newData = {...data};
    if (newData.role.value.toLowerCase() === 'marketer') {
      delete newData.totalMarketers;
      delete newData.activeMarketers;
    } else if (newData.role.value.toLowerCase() === 'supervisor') {
      delete newData.supervisor;
    }

    const response = await fetch(
      'https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/reports',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeID: auth().currentUser.uid,
          ...Object.keys(data)
            .map(item => ({
              [item]: typeof data[item].value !== 'undefined' ? data[item].value : data[item],
            }))
            .reduce((a, b) => ({...a, ...b}), {}),
        }),
      },
    ).catch(setError);
    const _data = await response.json();
    // console.log('RES', _data);

    if (!_data || !response || !response.ok) {
      setError('An error occurred, while trying to save the form.');
    }
    setLoading(false);
  }, [data]);

  const load = useCallback(async () => {
    setLoading(true);

    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/reports?startTime=${formatDate(
        start,
        3,
      )}&endTime=${formatDate(end, 3)}&marketerID=${auth().currentUser.uid}&pageSize=${30}`,
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
    // console.log('RES', _data);

    setList(_data);
    setLoading(false);
  }, [end, start]);

  useEffect(() => {
    load();

    (async () => {
      const snapshot = await firestore()
        .collection('users')
        .where('role', '==', 'SUPERVISOR')
        .get();
      const _data = [];
      snapshot.forEach(item => {
        const d = item.data();
        _data.push({...d, value: d.displayName});
      });

      setSupervisors(_data);
    })();
  }, [load]);

  useEffect(() => {
    setDisabled(
      Object.keys(data).some(item => {
        const role = data.role.value.toLowerCase();
        if (
          (role === 'marketer' && (item === 'totalMarketers' || item === 'activeMarketers')) ||
          (role === 'supervisor' && item === 'supervisor')
        ) {
          return false;
        }

        if (!data[item]) {
          return true;
        }

        if (typeof data[item] === 'object' && !data[item].value) {
          return true;
        }

        if (Array.isArray(data[item]) && data[item].length === 0) {
          return true;
        }

        return false;
      }),
    );
  }, [data]);

  return (
    <Page type="drawer" header="Report">
      <Whitespace marginTop={10} />

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

      <Container row type="spaceBetween">
        <Button type={mode === 'fetch' ? 'standard' : 'plain'} onPress={changeMode('fetch')}>
          Fetch
        </Button>
        <Button type={mode === 'save' ? 'standard' : 'plain'} onPress={changeMode('save')}>
          Save reports
        </Button>
      </Container>

      <Whitespace marginTop={50} />

      {mode === 'fetch' ? (
        <GenericList list={list} id="reportID" />
      ) : (
        <>
          <Typography size={12} left width="100%">
            Employee Name
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="Employee Name"
            type="text"
            name="employeeName"
            label="Employee name"
            value={data.employeeName}
            onChange={onChangeData('employeeName')}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Role
          </Typography>

          <Whitespace marginTop={-20} />

          <Dropdown
            onChange={onChangeData('role')}
            value={data.role.value}
            data={ROLES}
            displayKey="value"
            label="Role"
            suffix={arrowDown}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Locality
          </Typography>

          <Whitespace marginTop={-20} />

          <Dropdown
            onChange={onChangeData('locality')}
            value={data.locality.value}
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
            onChange={onChangeData('sublocality')}
            value={data.sublocality.value}
            data={getSubLocalities(data.locality.value || localities[0].value)}
            displayKey="value"
            label="Sub Localities"
            suffix={arrowDown}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Home Approvals
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="How many homes did you approve today?"
            type="numeric"
            name="homeApprovals"
            label="Home Approvals"
            value={data.homeApprovals}
            onChange={onChangeData('homeApprovals')}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Home Rentals
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="How many homes did you rent today?"
            type="numeric"
            name="homeRentals"
            label="Home Rentals"
            value={data.homeRentals}
            onChange={onChangeData('homeRentals')}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Home Viewings
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="How many viewings did you do today?"
            type="numeric"
            name="homeViewings"
            label="Home Viewings"
            value={data.homeViewings}
            onChange={onChangeData('homeViewings')}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Home Uploads
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="How many homes did you upload today?"
            type="numeric"
            name="homeUploads"
            label="Home Uploads"
            value={data.homeUploads}
            onChange={onChangeData('homeUploads')}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Demands
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="How many demands did you get today?"
            type="numeric"
            name="demands"
            label="Demands"
            value={data.demands}
            onChange={onChangeData('demands')}
          />

          <Whitespace marginTop={10} />

          <Typography size={12} left width="100%">
            Remarks
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="Do you have anything else we should know? Challenges or notices!"
            type="text"
            name="remarks"
            label="Home Remarks"
            value={data.remarks}
            onChange={onChangeData('remarks')}
          />

          <Whitespace marginTop={15} />

          <Typography type="label" width="100%">
            Contact
          </Typography>

          <PhoneNumber inline onChangeData={onChangeData('contact')} />

          <Whitespace marginTop={15} />

          {data.role.value.toLowerCase() === 'marketer' && (
            <>
              <Typography size={12} left width="100%">
                Supervisor
              </Typography>

              <Whitespace marginTop={-20} />

              <Dropdown
                onChange={onChangeData('supervisor')}
                value={data.supervisor.value}
                data={supervisors}
                displayKey="value"
                label="Supervisor"
                suffix={arrowDown}
              />
            </>
          )}

          <Whitespace marginTop={10} />

          {data.role.value.toLowerCase() === 'supervisor' && (
            <>
              <Typography size={12} left width="100%">
                Total Marketers
              </Typography>

              <Whitespace marginTop={10} />

              <Input
                placeholder="How many total marketers do you supervise?"
                type="numeric"
                name="remarks"
                label="Total Marketers"
                value={data.totalMarketers}
                onChange={onChangeData('totalMarketers')}
              />

              <Whitespace marginTop={10} />

              <Typography size={12} left width="100%">
                Active Marketers
              </Typography>

              <Whitespace marginTop={10} />

              <Input
                placeholder="How many of your marketers worked today?"
                type="numeric"
                name="remarks"
                label="Active Marketers"
                value={data.activeMarketers}
                onChange={onChangeData('activeMarketers')}
              />
            </>
          )}

          <Whitespace marginTop={30} />

          <Typography type="notice">
            By Clicking Save, I agree to Rentit&apos;s{' '}
            <Typography type="link">
              Terms of Service, Payments Terms of Service and Nondiscrimination Policy
            </Typography>{' '}
            and acknowledge the <Typography type="link">Privacy Policy.</Typography>
          </Typography>

          <Whitespace marginTop={30} />

          <Error text={error} />

          <Button type="standard" loading={loading} disabled={disabled} onPress={submit}>
            Save
          </Button>

          <Whitespace marginBottom={20} />
        </>
      )}
    </Page>
  );
};

export default Report;
