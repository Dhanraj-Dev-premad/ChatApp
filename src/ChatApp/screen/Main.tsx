import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

import Users from './Users';
import Settings from './Settings';

const Main = () => {
  const route = useRoute();
  const userId = (route.params as any)?.userId;
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      title: 'Profile',
      icon: require('../assets/images/user.png'),
    },
    {
      title: 'Settings',
      icon: require('../assets/images/settings.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.content}>
        {selectedTab === 0 ? <Users currentUserId={userId} /> : <Settings />}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomTab}>
        {tabs.map((tab, index) => {
          const isSelected = selectedTab === index;

          return (
            <TouchableOpacity
              key={tab.title}
              activeOpacity={0.8}
              style={styles.tab}
              onPress={() => setSelectedTab(index)}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}
              >
                <Image
                  source={tab.icon}
                  style={[
                    styles.tabIcon,
                    {
                      tintColor: isSelected
                        ? '#FFFFFF'
                        : '#8A8A9A',
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.selectedTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },

  content: {
    flex: 1,
    paddingBottom: 110,
  },

  bottomTab: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 85,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#25213D',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: 48,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIconContainer: {
    backgroundColor: '#6C4DFF',
  },

  tabIcon: {
    width: 23,
    height: 23,
  },

  tabText: {
    fontSize: 12,
    color: '#8A8A9A',
    marginTop: 5,
    fontWeight: '500',
  },

  selectedTabText: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
});