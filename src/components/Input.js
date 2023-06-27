import React, {useState, useCallback, useMemo} from 'react';
import {KeyboardAvoidingView, View, Text, TextInput, Image} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import Button from './Button';
import Error from './Error';

import {global, typography, button} from '../assets/styles';

const Input = props => {
  const {
    label,
    name,
    value,
    onChange: onChangeProp,
    placeholder,
    type,
    multiLine,
    groupBefore,
    groupAfter,
    suffix,
    selected,
    error,
    plain,
    disabled,
    inline,
    ...rest
  } = props;

  const [activeStyle, setActiveStyle] = useState({opacity: 0.6});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const keyboardType = useMemo(
    () =>
      type === 'password' || type === 'date' ? 'default' : type === 'text' ? 'ascii-capable' : type,
    [type],
  );

  const open = useCallback(() => {
    setActiveStyle({borderColor: '#555', opacity: 0.8});
    if (type === 'date') {
      setShowDatePicker(true);
    }
  }, [type]);

  const close = useCallback(() => {
    setActiveStyle({opacity: 0.6});
    if (type === 'date') {
      setShowDatePicker(false);
    }
  }, [type]);

  const onChange = useCallback(
    e => {
      if (type === 'date') {
        const newValue = new Date(e.nativeEvent.timestamp);
        let month = (newValue || value).getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        let day = (newValue || value).getDate();
        day = day < 10 ? `0${day}` : day;

        onChangeProp(`${month}/${day}/${(newValue || value).getFullYear()}`, name, e);
        close();
      } else if (type === 'numeric') {
        onChangeProp(/^[0-9]+$/.test(e.trim()) ? e.trim() : e.substring(0, e.length - 1), name, e);
        close();
      } else {
        onChangeProp(e.trim(), name);
      }
    },
    [close, onChangeProp, type, name, value],
  );

  if (type === 'checkbox' || type === 'radio') {
    return (
      <Button type={type} onPress={onChange}>
        {selected ? <Button type={`${type}Selected`} /> : null}
      </Button>
    );
  }

  if (type === 'date') {
    return (
      <>
        <Button
          type="regular"
          value={value}
          onPress={open}
          suffix={suffix}
          disabled={disabled}
          groupBefore={groupBefore}
          groupAfter={groupAfter}
        >
          {value || label}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(value).getTime() ? new Date(value) : new Date()}
            onChange={onChange}
            onError={close}
            mode="date"
            display="default"
          />
        )}
      </>
    );
  }

  return (
    <KeyboardAvoidingView>
      <View style={global.inputContainer}>
        {label ? (
          <Text style={[global.inputLabel, typography.regular]}>{value && label}</Text>
        ) : null}
        {suffix && (
          <Image
            source={suffix}
            style={[groupAfter || groupBefore ? global.groupSuffix : global.suffix, activeStyle]}
          />
        )}
        <TextInput
          value={value}
          keyboardType={keyboardType}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          secureTextEntry={type === 'password'}
          style={[
            global.input,
            groupBefore ? global.groupBefore : groupAfter ? global.groupAfter : {},
            activeStyle,
            plain ? global.plain : {},
            inline ? global.inlineInput : {},
            disabled ? button.disabled : {},
          ]}
          multiLine={!!multiLine}
          numberOfLines={multiLine || 1}
          onChangeText={onChange}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
      </View>
      <Error text={error} />
    </KeyboardAvoidingView>
  );
};

export default Input;
