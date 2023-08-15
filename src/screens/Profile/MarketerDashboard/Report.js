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
  Header,
  Page,
} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';
import hamburger from '../../../assets/images/hamburger.png';
import {localities, getSubLocalities} from '../../../utils';

const oldData = {
  // employeeId: '',
  employeeName: '',
  role: '',
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

const Report = props => {
  const {onSuccess, navigation} = props;

  const [data, setData] = useState({...oldData});
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);

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
      delete newData.supervisor;
    } else if (newData.role.value.toLowerCase() === 'supervisor') {
      delete newData.supervisor;
    }

    // console.log('AAA', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     employeeID: auth().currentUser.uid,
    //     ...Object.keys(data)
    //       .map(item => ({
    //         [item]: typeof data[item].value !== 'undefined' ? data[item].value : data[item],
    //       }))
    //       .reduce((a, b) => ({...a, ...b}), {}),
    //   }),
    // });
    // return;

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

    if (!data || !response || !response.ok) {
      setError('An error occurred, while trying to save the form.');
    } else {
      onSuccess(_data);
    }
    setLoading(false);
  }, [data, onSuccess]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const isInComplete = Object.keys(data).some(item => {
      if (!data[item] || data[item] === '0') {
        return true;
      }

      if (typeof data[item] === 'object' && !data[item].value) {
        return true;
      }

      if (Array.isArray(data[item]) && data[item].length === 0) {
        return true;
      }

      return false;
    });

    if (isInComplete) {
      return setDisabled(true);
    }
    setDisabled(false);
  }, [data]);

  return (
    <>
      <Header leftIcon={hamburger} onClose={navigation.toggleDrawer}>
        Report
      </Header>

      <Page>
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
          type="text"
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
          label="Home Demands"
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
      </Page>
    </>
  );
};

export default Report;
