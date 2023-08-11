import React, {useMemo} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '@theme';
import {ScrollArea, Icon, SizedBox, Text} from '@components';

export const CategoryNavigator = ({status, open, setStatusFilter}) => {
  const categories = useMemo(
    () => [
      {
        status: 'Entire Flat',
        id: 2,
        icon: (
          <Icon
            icon="entireFlat"
            size={25}
            color={status.toLowerCase() === 'entire flat' ? colors.palette.primary : ''}
          />
        ),
      },
      {
        status: 'Apartment',
        id: 3,
        icon: (
          <Icon
            icon="apartment"
            size={25}
            color={status.toLowerCase() === 'apartment' ? colors.palette.primary : ''}
          />
        ),
      },
      {
        status: 'Mansion',
        id: 4,
        icon: (
          <Icon
            icon="mansion"
            size={25}
            color={status.toLowerCase() === 'mansion' ? colors.palette.primary : ''}
          />
        ),
      },

      {
        status: 'Self-Contained',
        id: 5,
        icon: (
          <Icon
            icon="house"
            size={25}
            color={status.toLowerCase() === 'self-contain' ? colors.palette.primary : ''}
          />
        ),
      },
      {
        status: 'Single Room',
        id: 7,
        icon: (
          <Icon
            icon="singleRoom"
            size={25}
            color={
              status.toLowerCase() === 'single room'
                ? colors.palette.primary
                : colors.palette.textInverse300
            }
          />
        ),
      },
      {
        status: 'Full Home',
        id: 8,
        icon: (
          <Icon
            icon="fullHome"
            size={25}
            color={
              status.toLowerCase() === 'full home'
                ? colors.palette.primary
                : colors.palette.textInverse300
            }
          />
        ),
      },
    ],
    [status],
  );
  return (
    <View>
      <ScrollArea horizontal={true}>
        <TouchableOpacity onPress={open} style={$categoryWrapper}>
          <Icon icon="filter" size={23} color={colors.palette.textInverse300} />
          <SizedBox height={8} />
          <Text text="Filter" weight="bold" size="xxs" color={colors.palette.textInverse300} />
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            onPress={setStatusFilter(category.status)}
            style={$categoryWrapper}>
            {category.icon}
            <SizedBox height={6} />
            <Text
              text={category.status}
              weight="bold"
              size="xxs"
              color={
                status === category.status ? colors.palette.primary : colors.palette.textInverse300
              }
            />
            {status === category.status && (
              <View>
                <SizedBox height={10} />
                <SizedBox height={2} backgroundColor={colors.palette.textInverse400} width={40} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollArea>
    </View>
  );
};

const $categoryWrapper: ViewStyle = {
  marginRight: 20,
  alignItems: 'center',
  height: 70,
  borderWidth: 0.1,
};
