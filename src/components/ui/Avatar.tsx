import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '../../theme';

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showPresence?: boolean;
}

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  isOnline = false,
  showPresence = false,
}) => {
  const pixelSize = theme.spacing.avatarSizes[size];
  const initials = getInitials(name);

  return (
    <View style={[styles.container, { width: pixelSize, height: pixelSize }]}>
      <View
        style={[
          styles.avatarCircle,
          {
            borderRadius: pixelSize / 2,
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { borderRadius: pixelSize / 2 }]}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                fontSize: pixelSize * 0.38,
              },
            ]}
          >
            {initials}
          </Text>
        )}
      </View>

      {showPresence && isOnline ? (
        <View
          style={[
            styles.presenceBadge,
            {
              backgroundColor: theme.colors.online,
              width: Math.max(12, pixelSize * 0.26),
              height: Math.max(12, pixelSize * 0.26),
              borderRadius: pixelSize * 0.13,
              borderWidth: 2,
              borderColor: '#FFFFFF',
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weights.bold,
  },
  presenceBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
