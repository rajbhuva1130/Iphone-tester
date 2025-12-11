import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import clsx from 'clsx';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

const ActionButton = ({ label, onPress, variant = 'primary', disabled, style }: Props) => {
  const base =
    'flex-row items-center justify-center rounded-xl px-4 py-3 min-h-[48px]';
  const variants: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-primary',
    secondary: 'bg-surface border border-border',
    ghost: 'bg-transparent border border-border'
  } as any;

  const textVariants: Record<NonNullable<Props['variant']>, string> = {
    primary: 'text-white font-bold',
    secondary: 'text-white font-semibold',
    ghost: 'text-white font-medium'
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      className={clsx(base, variants[variant], disabled && 'opacity-60')}
      style={style}
    >
      <Text className={textVariants[variant]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
