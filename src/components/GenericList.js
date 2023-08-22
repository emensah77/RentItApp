import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {startCase, camelCase} from 'lodash';

import Typography from './Typography';
import Whitespace from './Whitespace';
import Container from './Container';
import CardDisplay from './CardDisplay';

const GenericList = props => {
  const {list, id, flatten} = props;

  const keyExtractor = useCallback(item => item[id], [id]);

  const renderItem = useCallback(
    ({item, index}) => {
      const keys = Object.keys(item);

      return (
        <React.Fragment key={item[id]}>
          <Container type="chipDeSelected" height="auto" width="100%">
            <CardDisplay
              numberOfLines={keys.length}
              name={
                <Typography type="notice" size={18} weight="700">
                  Role: {item.role}
                </Typography>
              }
              description={keys.sort().map(dataKey => (
                <React.Fragment
                  key={`${index},${dataKey},${
                    typeof item[dataKey] === 'object'
                      ? JSON.stringify(item[dataKey])
                      : item[dataKey]
                  }`}>
                  {dataKey !== 'employeeID' && dataKey !== 'role' ? (
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
          </Container>

          <Whitespace marginTop={33} />
        </React.Fragment>
      );
    },
    [id],
  );

  if (flatten) {
    return (
      <FlatList
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }

  return <>{list.map((l, i) => renderItem({item: l, index: i}))}</>;
};

export default GenericList;
