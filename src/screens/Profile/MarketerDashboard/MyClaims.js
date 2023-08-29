import React, {useState, useCallback, useEffect, useMemo} from 'react';
import auth from '@react-native-firebase/auth';

import {Page, GenericList} from '../../../components';

const MyClaims = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const complete = useCallback(async item => {
    await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/claimedDemands?demandId=${
        item.DemandID
      }&updaterId=${auth().currentUser.uid}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'Completed'}),
      },
    ).catch(e => console.error('An error occurred while updating claims', e));
  }, []);

  const buttons = useMemo(
    () => [{text: 'Complete', action: complete, condition: () => true}],
    [complete],
  );

  const load = useCallback(async () => {
    setLoading(true);

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
    ).catch(e => console.error('An error occurred while fetching claims', e));
    if (!response) {
      return;
    }
    const _data = await response.json();
    setData(_data.items);

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Page type="drawer" header="My Claims">
      <GenericList list={data} id="DemandID" loading={loading} buttons={buttons} />
    </Page>
  );
};

export default MyClaims;
