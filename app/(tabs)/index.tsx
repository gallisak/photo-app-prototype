import { useState } from 'react';
import { View } from 'react-native';
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Успішно!');
    }, 2000);
  };

  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-full p-6 rounded-3xl border border-slate-800 space-y-4">

        <CustomText variant="title" className="text-center mb-1">
          UI Kit Test
        </CustomText>

        <CustomText variant="subtitle" className="text-center mb-6">
          Components are fully ready for reuse
        </CustomText>

        <Button
          title="Run Process"
          onPress={handlePress}
          isLoading={loading}
          className="mb-3"
        />

        <Button
          title="Orderly action"
          onPress={() => console.log('Outline pressed')}
          variant="outline"
        />

      </View>
    </View>
  );
}