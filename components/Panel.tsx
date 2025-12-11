import { ReactNode } from 'react';
import { View, Text } from 'react-native';

type PanelProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const Panel = ({ title, subtitle, children, footer }: PanelProps) => {
  return (
    <View className="mb-4 rounded-2xl border border-border bg-surface/90 p-4 shadow-lg shadow-black/40">
      {(title || subtitle) && (
        <View className="mb-3">
          {title && <Text className="text-lg font-semibold text-white">{title}</Text>}
          {subtitle && <Text className="text-sm text-muted">{subtitle}</Text>}
        </View>
      )}
      <View>{children}</View>
      {footer && <View className="mt-3">{footer}</View>}
    </View>
  );
};

export default Panel;
