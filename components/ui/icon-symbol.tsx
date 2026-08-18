import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'star.fill': 'star',
  'location.fill': 'location-on',
  'magnifyingglass': 'search',
  'slider.horizontal.3': 'tune',
  'calendar': 'calendar-month',
  'person.2.fill': 'groups',
  'photo.fill': 'photo-library',
  'book.fill': 'menu-book',
  'person.fill': 'person',
  'arrow.right': 'arrow-forward',
  'arrow.left': 'arrow-back',
  'heart': 'favorite-border',
  'bookmark': 'bookmark-border',
  'shield.fill': 'verified-user',
  'phone.fill': 'phone',
  'checkmark.circle.fill': 'check-circle',
  'bell.fill': 'notifications-none',
  'xmark': 'close',
  'camera.fill': 'photo-camera',
  'sparkles': 'auto-awesome',
} as IconMapping;

export function IconSymbol({ name, size = 24, color, style }: { name: IconSymbolName; size?: number; color: string | OpaqueColorValue; style?: StyleProp<TextStyle>; weight?: SymbolWeight }) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
