import { Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Search, Plus, User, MessageCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e4e4e7',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#71717a',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              activeOpacity={0.8}
              className="flex-1 justify-center items-center"
            >
              <LinearGradient
                colors={['#ec4899', '#f97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-10 rounded-full justify-center items-center"
              >
                <Plus size={24} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="chart"
        options={{
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}