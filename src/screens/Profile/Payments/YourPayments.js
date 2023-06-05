import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {Page, PageSpinner, Whitespace, CardDisplay, Typography} from '../../../components';

import temp2 from '../../../assets/images/temp/temp2.png';

const YourPayments = () => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const {uid} = auth().currentUser;
      const _payments = await firestore()
        .collection('payments')
        .where('userId', '==', uid)
        .get()
        .catch(console.error);
      if (!_payments || !_payments.docs) {
        return;
      }

      const newPayments = [];
      let j = 1;
      _payments.docs.forEach(doc => {
        const data = doc.data();
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const date = new Date(data.createdAt.seconds * 1000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();
        data.description = `Paid ~ ${months[month]} ${day}`;
        data.location = `${data.checkoutNumber} ~ ${months[month]} ${day}, ${year}`;
        data.image = temp2;
        data.amount = `${Number(data.amountPaid).toFixed(2)} GHC`;

        if (data.paymentStatus.toLowerCase() === 'processing') {
          if (!newPayments[0]) {
            newPayments[0] = {heading: 'Pending', items: []};
          }
          newPayments[0].items.push(data);
          // TODO:
          // Should other sections contain payments
          // already listed in the pending section?
          // If answer is no, then uncomment below
          // Answer is yes, for now, will ask Emen
          // --------
          // return;
        }

        let index = newPayments.findIndex((item, i) => (!i ? false : item.heading === year));
        index = index === -1 ? j : index;
        if (!newPayments[index]) {
          j++;
          newPayments[index] = {heading: year, items: []};
        }
        newPayments[index].items.push(data);
      });

      let _newPayments = [...newPayments];
      if (!newPayments[0]) {
        _newPayments = _newPayments.filter((_, i) => !!i);
      }
      setPayments(_newPayments);
      setLoading(false);
    })();
  }, []);

  return (
    <Page type="large" header="Your payments">
      <Whitespace marginTop={18} />

      {loading ? (
        <PageSpinner />
      ) : payments.length === 0 ? (
        <Typography>Nothing to see yet</Typography>
      ) : (
        payments.map(({heading, items}, i) => (
          <React.Fragment key={heading}>
            {!i ? null : <Whitespace marginTop={37} />}

            <Typography type="notice" left width="105%">
              {heading}
            </Typography>

            <Whitespace marginTop={24} />

            {items?.map(({description, image, location, amount}) => (
              <React.Fragment key={location}>
                <CardDisplay
                  leftImageWidth={57}
                  leftImageHeight={58}
                  leftImageSrc={image}
                  name={description}
                  date={
                    <Typography width="70%" color="#717171">
                      {location}
                    </Typography>
                  }
                  suffix={<Typography center>{amount}</Typography>}
                  center
                />

                <Whitespace marginTop={13} marginBottom={13} />
              </React.Fragment>
            ))}
          </React.Fragment>
        ))
      )}
    </Page>
  );
};

export default YourPayments;
