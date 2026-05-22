import { useAuthStore } from '@/src/store/useAuthStore';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import CustomText from '@/src/components/ui/CustomText';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const segments = useSegments();
  const router = useRouter();
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/index' as any);
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (!stripeKey) {
    console.log("TRIPE WARNING: Ключ не знайдено в process.env. Перевір .env файл або перезапусти Metro.");
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000000" />
        <CustomText className="text-zinc-400 text-xs mt-4">Initializing Stripe...</CustomText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StripeProvider publishableKey={stripeKey}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat/[id]" />
        </Stack>
      </StripeProvider>
    </View>
  );
}