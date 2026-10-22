import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handlePress = title => {
    Alert.alert(title, `${title} screen coming soon.`);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightText,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.itemSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {rightText ? (
        <Text style={styles.arrow}>{rightText}</Text>
      ) : (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
     
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subtitle}>
        Customize your app experience.
      </Text>

      {/* Profile card */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => handlePress('Edit Profile')}
        activeOpacity={0.8}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Raj</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Your Profile</Text>
          <Text style={styles.profileEmail}>
            Manage your personal information
          </Text>
        </View>

        <Text style={styles.profileArrow}>›</Text>
      </TouchableOpacity>

      {/* General */}
      <Text style={styles.sectionTitle}>GENERAL</Text>

      <View style={styles.sectionCard}>
        <View style={styles.settingItem}>
          <View style={styles.itemIcon}>
            <Text style={styles.iconText}>♧</Text>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Notifications</Text>
            <Text style={styles.itemSubtitle}>
              Receive app notifications
            </Text>
          </View>

          {/* <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{
              false: '#D8D7E2',
              true: '#B9ACFF',
            }}
            thumbColor={notifications ? '#6C4DFF' : '#FFFFFF'}
          /> */}
        </View>

        <View style={styles.separator} />

        <View style={styles.settingItem}>
          <View style={styles.itemIcon}>
            <Text style={styles.iconText}>☾</Text>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Dark Mode</Text>
            <Text style={styles.itemSubtitle}>
              Change your appearance
            </Text>
          </View>

          {/* <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{
              false: '#D8D7E2',
              true: '#B9ACFF',
            }}
            thumbColor={darkMode ? '#6C4DFF' : '#FFFFFF'}
          /> */}
        </View>
      </View>

      {/* Account */}
      <Text style={styles.sectionTitle}>ACCOUNT & SECURITY</Text>

      <View style={styles.sectionCard}>
        <SettingItem
          icon="♙"
          title="Edit Profile"
          subtitle="Update your personal details"
          onPress={() => handlePress('Edit Profile')}
        />

       
        <SettingItem
          icon="⌑"
          title="Change Password"
          subtitle="Keep your account secure"
          onPress={() => handlePress('Change Password')}
        />
      </View>

      

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert(
            'Log out',
            'Connect this button to your authentication logout function.'
          )
        }
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },
  eyebrow: {
    color: '#6C4DFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#25213D',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#85849A',
    marginTop: 5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C4DFF',
    padding: 18,
    borderRadius: 20,
    marginTop: 24,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#8972FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 12,
    color: '#E5DFFF',
    marginTop: 5,
  },
  profileArrow: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  sectionTitle: {
    color: '#85849A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: '#25213D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 7,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EAE4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#6044D8',
    fontSize: 21,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemTitle: {
    color: '#25213D',
    fontSize: 14,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: '#85849A',
    fontSize: 11,
    marginTop: 4,
  },
  arrow: {
    color: '#A6A3B8',
    fontSize: 25,
    paddingHorizontal: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0EFF5',
    marginLeft: 54,
  },
  logoutButton: {
    backgroundColor: '#fae2e2',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: '#E34F59',
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    textAlign: 'center',
    color: '#A6A3B8',
    fontSize: 11,
    marginTop: 22,
  },
});

