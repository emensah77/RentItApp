import React, {useState, useCallback, useEffect, useMemo} from 'react';
import auth from '@react-native-firebase/auth';
import {Page, GenericList} from '../../../components';
import Dropdown from '../../../components/Dropdown';
import {statusOptions} from '../../../utils/claimStatus';

const MyClaims = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [nextKey, setNextKey] = useState(null); // Add this state to track the next key

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
            return response.json(); // Parse the response body as JSON
          })
          .then(() => {
            load(); // Refresh the claims after updating the status
            setSelectedStatus(null); // Reset the selected status
            setSelectedClaim(null); // Reset selected claim after updating
          })
          .catch(e => console.error('An error occurred while updating claims', e));
      } else {
        setSelectedClaim(item);
      }
    },
    [selectedStatus, load],
  );

  const buttons = useMemo(
    () => [
      {
        text: item =>
          selectedClaim && selectedClaim.DemandID === item.DemandID ? 'Confirm' : 'Update',
        action: item => updateStatus(item),
        condition: () => true,
      },
    ],
    [updateStatus, selectedClaim],
  );

  const load = useCallback(async (startKey = null) => {
    setLoading(true);
    const response = await fetch(
      `https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/claimedDemands?marketerId=${
        auth().currentUser.uid
      }&pageSize=30${startKey ? `&startKey=${startKey}` : ''}`,
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
    setData(prevData => {
      // Check if the first item of the new data matches the last item of the old data
      const newItems =
        prevData[prevData.length - 1]?.DemandID === _data.items[0]?.DemandID
          ? _data.items.slice(1)
          : _data.items;

      return [...prevData, ...newItems];
    });
    setNextKey(_data.nextKey); // Set the next key from the response
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
      // Only fetch the next set if a next key is present
      load(nextKey);
    }
  }, [nextKey, load]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Page type="drawer" header="My Claims">
      {selectedClaim && (
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

export default MyClaims;
