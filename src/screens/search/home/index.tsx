import {colors} from '@assets/styles';
import {Card, Icon, Page, PlusMinus, ScrollArea, SizedBox, Text} from '@components';
import React, {useCallback, useMemo, useState} from 'react';
import {View, ViewStyle, Image, TouchableOpacity} from 'react-native';
import {ExtendedEdge} from '@utils/useSafeAreaInsetsStyle';
import {flexMap} from '@assets/images';
import {SearchModal} from '@components/Modals';

import moment from 'moment';
import styles from './styles';

export const SearchHome = props => {
  const {navigation} = props;
  const [currentTab] = useState('stays');
  const [selectedMap, setSelectedMap] = useState("i'm flexible");
  const [modalVisible, setModalVisible] = useState(false);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [petsCount, setPetsCount] = useState(0);

  const [modalType, setModalType] = useState<'location' | 'calender'>('location');

  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const [viewPort, setViewPort] = useState(null);
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [sublocality, setSubLocality] = useState('');
  const [searchText, setSearchText] = useState('');

  const [dates, setDates] = useState({startDate: null, endDate: null});

  const memoizedSafeAreaEdges: ExtendedEdge[] = useMemo(() => {
    return ['top'];
  }, []);

  const whereToList = useMemo(
    () => [
      {title: "I'm Flexible", map: flexMap},
      {title: 'Europe', map: flexMap},
      {title: 'South America', map: flexMap},
    ],
    [],
  );

  const autoComplete = useCallback(
    async (_, details: any = null) => {
      setViewPort(details.geometry.viewport);
      setLocality(details.address_components[0].short_name);
      setAddress(details.address_components[0].long_name);
      if (details.address_components?.[1]) {
        setSubLocality(details.address_components[1].short_name);
      }
      setShowAddress(true);
      setModalVisible(false);
      if (!dates.startDate || !dates.endDate) {
        setModalType('calender');
        setModalVisible(true);
      }
    },
    [dates],
  );
  const onEmptySubmit = useCallback(
    inputText => {
      setSearchText(inputText);
      setLocality(inputText); // Optionally, you may use the inputText as the locality
      setAddress(inputText); // Optionally, you may use the inputText as the address
      setShowAddress(true);
      setModalVisible(false); // Close the current modal

      // If no dates are selected, open the calendar modal
      if (!dates.startDate || !dates.endDate) {
        setModalType('calender');
        setModalVisible(true);
      }
    },
    [dates],
  );

  const completeSearch = useCallback(() => {
    navigation.navigate('SearchResults', {
      guests: {
        adultsCount,
        childrenCount,
        infantsCount,
        petsCount,
      },
      dates,
      location: {
        viewPort,
        locality,
        sublocality,
        address: viewPort ? address : searchText,
      },
      searchText,
    });
  }, [
    address,
    adultsCount,
    childrenCount,
    dates,
    infantsCount,
    locality,
    navigation,
    petsCount,
    sublocality,
    viewPort,
    searchText,
  ]);

  const onChange = useCallback(({startDate, endDate}) => {
    setDates({startDate, endDate});

    if (startDate && endDate) {
      // setModalVisible(false);
      setShowAddGuest(true);
    }
  }, []);

  const $mapViewStyles = useCallback(
    isSelected => [styles.mapView, !isSelected && {borderColor: colors.palette.textInverse200}],
    [],
  );

  const handleModal = useCallback(
    calenderType => () => {
      setModalType(calenderType);
      setModalVisible(true);
    },
    [],
  );

  const onClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMapSelect = useCallback(item => () => setSelectedMap(item.title.toLowerCase()), []);

  const headerTextProps: any = useMemo(() => {
    return headerTextProps;
  }, []);

  const searchDate = useMemo(
    () =>
      dates.startDate
        ? `${moment(dates.startDate).format('DD MMM')} - ${moment(dates.endDate).format('DD MMM')}`
        : '-',
    [dates.endDate, dates.startDate],
  );

  const handleOnchange = useCallback(
    type => (val: any) => {
      if (type === 'adult') return setAdultsCount(val);
      if (type === 'children') return setChildrenCount(val);
      if (type === 'infant') return setInfantsCount(val);
      if (type === 'pets') return setPetsCount(val);
    },
    [],
  );

  const handleShow = useCallback(
    type => () => {
      if (type === 'address') return setShowAddress(false);
      if (type === 'guest') return setShowAddGuest(true);
    },
    [],
  );

  return (
    <View style={styles.wrapper}>
      <SearchModal
        show={modalVisible}
        onClose={onClose}
        type={modalType}
        onComplete={autoComplete}
        onChange={onChange}
        onEmptySubmit={onEmptySubmit}
      />

      <Page
        safeAreaEdges={memoizedSafeAreaEdges}
        type=""
        backgroundColor={colors.palette.neutral}
        hasPadding={true}>
        <SizedBox height={10} />
        <View style={styles.headerContainer}>
          <Icon icon="closeCircle" onPress={goBack} size={30} />
          <View style={styles.headerContent}>
            <View style={styles.content}>
              <Text text="Stays" weight="bold" />
              <SizedBox height={6} />
              {currentTab === 'stays' && (
                <SizedBox height={2} backgroundColor={colors.palette.textInverse400} width={40} />
              )}
            </View>
          </View>
          <SizedBox width={30} />
        </View>

        <SizedBox height={30} />
        {!showAddress ? (
          <Card
            style={$cardStyle}
            heading="Where to?"
            HeadingTextProps={headerTextProps}
            ContentComponent={
              <>
                <SizedBox height={13} />
                <TouchableOpacity style={styles.search} onPress={handleModal('location')}>
                  <Icon icon="searchMini" size={20} />
                  <SizedBox width={10} />
                  <Text text="Search destination" size="xs" color={colors.palette.textInverse300} />
                </TouchableOpacity>
                <SizedBox height={20} />
                <ScrollArea horizontal>
                  {whereToList.map((item, index: number) => {
                    const isSelected = selectedMap === item.title.toLowerCase();
                    return (
                      <TouchableOpacity
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        onPress={handleMapSelect(item)}>
                        <View style={$mapViewStyles(isSelected)}>
                          <Image source={item.map} />
                        </View>
                        <SizedBox height={5} />
                        <Text
                          text={item.title}
                          size="xs"
                          weight="bold"
                          color={isSelected ? colors.text : colors.palette.textInverse200}
                        />
                      </TouchableOpacity>
                    );
                  })}
                  <SizedBox height={15} />
                </ScrollArea>
              </>
            }
          />
        ) : (
          <Card
            style={$cardStyke}
            LeftComponent={<Text text="Where" size="xs" color={colors.palette.textInverse300} />}
            RightComponent={<Text text={address} size="xs" weight="bold" />}
            onPress={handleShow('address')}
          />
        )}

        <SizedBox height={15} />
        <Card
          style={$cardStyke}
          LeftComponent={<Text text="When" size="xs" color={colors.palette.textInverse300} />}
          RightComponent={<Text text={searchDate} size="xs" weight="bold" />}
          onPress={handleModal('calender')}
        />

        <SizedBox height={15} />
        {!showAddGuest ? (
          <Card
            style={$cardStyke}
            LeftComponent={<Text text="Who" size="xs" color={colors.palette.textInverse300} />}
            RightComponent={<Text text="Add guest" size="xs" weight="bold" />}
            onPress={handleShow('guest')}
          />
        ) : (
          <Card
            style={$cardStyle}
            heading="Who's coming?"
            HeadingTextProps={headerTextProps}
            ContentComponent={
              <>
                <View style={styles.countContainer}>
                  <View>
                    <Text text="Adults" weight="600" size="sm" />
                    <SizedBox height={2} />
                    <Text
                      text="Ages 13 or above"
                      weight="600"
                      size="xxs"
                      color={colors.palette.textInverse300}
                    />
                  </View>
                  <PlusMinus value={adultsCount} min={1} onChange={handleOnchange('adult')} />
                </View>

                <View style={styles.countContainer}>
                  <View>
                    <Text text="Children" weight="600" size="sm" />
                    <SizedBox height={2} />
                    <Text
                      text="Ages 2 - 12"
                      weight="600"
                      size="xxs"
                      color={colors.palette.textInverse300}
                    />
                  </View>
                  <PlusMinus value={childrenCount} min={0} onChange={handleOnchange('children')} />
                </View>

                <View style={styles.countContainer}>
                  <View>
                    <Text text="Infants" weight="600" size="sm" />
                    <SizedBox height={2} />
                    <Text
                      text="Under 2"
                      weight="600"
                      size="xxs"
                      color={colors.palette.textInverse300}
                    />
                  </View>
                  <PlusMinus value={infantsCount} min={0} onChange={handleOnchange('infant')} />
                </View>

                <View style={styles.countContainer}>
                  <View>
                    <Text text="Pets" weight="600" size="sm" />
                    <SizedBox height={2} />
                    <Text
                      text="Bringing a service animal?"
                      weight="600"
                      size="xxs"
                      color={colors.palette.textInverse300}
                    />
                  </View>
                  <PlusMinus value={petsCount} min={0} onChange={handleOnchange('pets')} />
                </View>

                <SizedBox height={20} />
              </>
            }
          />
        )}

        <SizedBox height={15} />

        <SizedBox height={20} />
      </Page>
      <View style={styles.footer}>
        <Text text="Clear all" weight="bold" size="xs" style={$textStyle} />
        <TouchableOpacity style={styles.btn} onPress={completeSearch}>
          <View style={styles.headerContainer}>
            <Icon icon="searchMini" size={20} color={colors.palette.textInverse} />
            <SizedBox width={5} />
            <Text text="Search" weight="bold" size="xs" color={colors.palette.textInverse} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const $cardStyle: ViewStyle = {
  borderWidth: 0.7,
  borderColor: colors.palette.neutral,
  alignItems: 'center',
  borderRadius: 26,
  paddingVertical: 13,
  paddingLeft: 20,
  paddingRight: 12,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.1,
  shadowRadius: 2,
  backgroundColor: colors.palette.textInverse,
};

const $textStyle = {
  textDecorationLine: 'underline',
};

const $cardStyke = {
  ...$cardStyle,
  borderRadius: 16,
};
