import React, {useCallback} from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import styles from './SettingModal.styles';

const SettingModal = ({visible = false, onClose}) => {
  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity>
          <Text style={styles.headerDeleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    ),
    [onClose],
  );

  const renderMain = useCallback(
    () => (
      <View style={styles.main}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput style={styles.input} value="Weekend away" />
        </View>

        <Text style={styles.inputSubTitle}>50 characters maximum</Text>
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(
    () => (
      <View style={styles.footer}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerDeleteText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled style={[styles.deleteButton]}>
          <Text style={[styles.headerDeleteText, styles.noTextDecoration, styles.whiteText]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [onClose],
  );

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          {renderHeader()}
          {renderMain()}
          {renderFooter()}
        </View>
      </View>
    </Modal>
  );
};

export default SettingModal;
