import React, {useState, useCallback, useEffect, useMemo} from 'react';
import auth from '@react-native-firebase/auth';
import {Page, GenericList} from '../../../components';
import Dropdown from '../../../components/Dropdown';
import {statusOptions} from '../../../utils/claimStatus';

const MyViewings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedViewing, setSelectedViewing] = useState(null);
  const [nextKey, setNextKey] = useState(null);

  const updateStatus = useCallback(
    async item => {
      if (selectedStatus) {
        const details = {Status: selectedStatus};

        const requestBody = {
          updaterId: auth().currentUser.uid,
          demandId: item.DemandID,
          details,
        };

        await fetch('https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/claimedDemands', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(text => {
                throw new Error(`Failed to update status: ${text}`);
              });
            }
            return response.json();
          })
          .then(() => {
            load();
            setSelectedStatus(null);
            setSelectedViewing(null);
          })
          .catch(e => console.error('An error occurred while updating viewings', e));
      } else {
        setSelectedViewing(item);
      }
    },
    [selectedStatus, load],
  );

  const buttons = useMemo(
    () => [
      {
        text: item =>
          selectedViewing && selectedViewing.DemandID === item.DemandID ? 'Confirm' : 'Update',
        action: item => updateStatus(item),
        condition: () => true,
      },
    ],
    [updateStatus, selectedViewing],
  );

  const load = useCallback(async (startKey = null) => {
    setLoading(true);

    const status = 'Viewing';

    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/claimedDemands?marketerId=${
        auth().currentUser.uid
      }&status=${status}&pageSize=30${startKey ? `&startKey=${startKey}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('An error occurred while fetching viewings', e));

    if (!response) {
      return;
    }
    const _data = await response.json();
    setData(prevData => {
      const newItems =
        prevData[prevData.length - 1]?.DemandID === _data.items[0]?.DemandID
          ? _data.items.slice(1)
          : _data.items;

      return [...prevData, ...newItems];
    });
    setNextKey(_data.nextKey);
    setLoading(false);
  }, []);

  const handleChange = useCallback(
    item => {
      setSelectedStatus(item.value);
    },
    [setSelectedStatus],
  );

  const handleEndReached = useCallback(() => {
    if (nextKey) {
      load(nextKey);
    }
  }, [nextKey, load]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Page type="drawer" header="My Viewings">
      {selectedViewing && (
        <Dropdown
          data={statusOptions}
          displayKey="label"
          value={selectedStatus}
          onChange={handleChange}
          label="Select Status"
        />
      )}
      <GenericList
        list={data}
        id="DemandID"
        loading={loading}
        buttons={buttons}
        onEndReached={handleEndReached}
      />
    </Page>
  );
};

export default MyViewings;
