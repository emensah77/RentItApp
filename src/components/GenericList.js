import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {startCase, camelCase} from 'lodash';

import Typography from './Typography';
import Whitespace from './Whitespace';
import Container from './Container';
import CardDisplay from './CardDisplay';
import Loader from './Loader';
import Button from './Button';

const GenericList = props => {
  const {
    list,
    id,
    flatten,
    loading,
    onEndReached,
    buttons = [
      /* {text: '', condition: () => true, action: () => void 0} */
    ],
  } = props;

  const action = useCallback(
    (callback, item, index) => () => {
      callback(item, index);
    },
    [],
  );

  const keyExtractor = useCallback(item => item[id], [id]);

  const renderItem = useCallback(
    ({item, index}) => {
      const keys = Object.keys(item);

      return (
        <React.Fragment key={item[id]}>
          {index === 0 && <Whitespace paddingTop={10} />}

          <Container type="chipDeSelected" height="auto" width="100%">
            <CardDisplay
              numberOfLines={keys.length}
              name={
                <Typography type="notice" size={18} weight="700">
                  {id.toUpperCase()}: {item[id]}
                </Typography>
              }
              description={keys.sort().map(dataKey => (
                <React.Fragment
                  key={`${index},${dataKey},${
                    typeof item[dataKey] === 'object'
                      ? JSON.stringify(item[dataKey])
                      : item[dataKey]
                  }`}>
                  {dataKey !== 'employeeID' && dataKey !== id ? (
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

            <Container width="100%" type="spaceBetween">
              {buttons.map(
                button =>
                  button.condition(item, index) && (
                    <Button
                      key={typeof button.text === 'function' ? button.text(item) : button.text}
                      loading={loading === index}
                      type="standard"
                      onPress={action(button.action, item, index)}>
                      {typeof button.text === 'function' ? button.text(item) : button.text}
                    </Button>
                  ),
              )}
            </Container>
          </Container>

          <Whitespace marginTop={33} />
        </React.Fragment>
      );
    },
    [id, loading, buttons, action],
  );

  if (loading) {
    return <Loader />;
  }

  if (list.length === 0 && !loading) {
    return <Typography>No data to show</Typography>;
  }

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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    );
  }

  return <>{list.map((l, i) => renderItem({item: l, index: i}))}</>;
};

export default GenericList;
