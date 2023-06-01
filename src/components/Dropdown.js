import React, {useEffect, useCallback, useState} from 'react';
import {Text, VirtualizedList, Image, Modal, ActivityIndicator, Pressable} from 'react-native';
import _ from 'lodash';

import Header from './Header';
import Container from './Container';
import Input from './Input';
import Typography from './Typography';
import Whitespace from './Whitespace';
import Button from './Button';

import {global, typography} from '../assets/styles';

const Dropdown = props => {
  const {
    onChange,
    data: originalData,
    displayKey,
    imageKey,
    value,
    label,
    getRowLabel,
    suffix,
    groupBefore,
    groupAfter,
  } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState(originalData);

  const toggle = useCallback(() => setOpen(!open), [open]);

  const getItem = useCallback(item => item, []);

  const getItemCount = useCallback(() => data.length, [data]);

  const keyExtractor = useCallback((_data, i) => _data[i][displayKey], [displayKey]);

  const onSelect = useCallback(
    item => () => {
      onChange(item);
      toggle();
    },
    [onChange, toggle],
  );

  const renderItem = useCallback(
    ({...args}) => (
      <Dropdown.Item
        {...args}
        displayKey={displayKey}
        imageKey={imageKey}
        onSelect={onSelect}
        getRowLabel={getRowLabel}
      />
    ),
    [displayKey, getRowLabel, imageKey, onSelect],
  );

  useEffect(() => {
    setData(originalData);
    if (search && Array.isArray(originalData)) {
      const regExp = new RegExp(search, 'im');
      setData(originalData.filter(item => regExp.test(item[displayKey])));
    }
  }, [displayKey, originalData, search, toggle]);

  return (
    <>
      <Button
        type="regular"
        value={value}
        onPress={toggle}
        suffix={suffix}
        groupBefore={groupBefore}
        groupAfter={groupAfter}>
        {value || label}
      </Button>
      {!open || !Array.isArray(originalData) ? null : (
        <Modal animationType="slide" visible>
          <Header onClose={toggle}>
            <Input
              placeholder="Pick an item or search for it"
              type="text"
              value={search}
              onChange={setSearch}
              multiLine={false}
              plain
            />
          </Header>
          {/* {__DEV__ && data.map((_, index) => renderItem({item: data, index, displayKey, onSelect}))} */}
          {data.length === 0 ? (
            <Container type="center">
              <Whitespace marginTop={15} />
              {search.length > 0 ? (
                <Typography type="primaryButton">No results found.</Typography>
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            </Container>
          ) : (
            <VirtualizedList
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              getItem={getItem}
              getItemCount={getItemCount}
              extraData={data}
              data={data}
              keyboardShouldPersistTaps="handled"
              debug={__DEV__}
            />
          )}
        </Modal>
      )}
    </>
  );
};

const Item = ({
  item,
  index,
  displayKey,
  imageKey,
  onSelect,
  getRowLabel,
  ripple = {color: '#d5d5d5', radius: 130},
}) => (
  <Pressable
    key={item[index][displayKey]}
    style={global.dropdownItem}
    onPress={onSelect(item[index])}
    hitSlop={15}
    android_ripple={ripple}>
    <Container type="row">
      <Image
        source={{uri: _.get(item[index], imageKey)}}
        loadingIndicatorSource={<ActivityIndicator size="large" color="blue" />}
        style={[global.icon, global.ovalIcon]}
      />
      <Text style={[typography.primaryButton, typography.left]}>
        {(getRowLabel && getRowLabel(item[index])) || item[index][displayKey]}
        {__DEV__ &&
          !index &&
          console.debug(
            'Perf. View For:',
            item[index][displayKey],
            displayKey,
            _.get(item[index], imageKey),
          )}
      </Text>
    </Container>
  </Pressable>
);

Dropdown.Item = React.memo(
  Item,
  (prevProps, nextProps) =>
    prevProps.item[prevProps.index].name === nextProps.item[nextProps.index].name,
);

export default Dropdown;
