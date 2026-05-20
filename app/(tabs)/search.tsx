import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchStore, SearchPhoto } from '../../store/useSearchStore';
import SearchPhotoGrid from '../../components/SearchPhotoGrid';
import Button from '../../components/Button';
import CustomText from '../../components/CustomText';

export default function SearchScreen() {
  const {
    query,
    displayedPhotos,
    allPhotos,
    loading,
    setQuery,
    runSearch,
    loadMore,
  } = useSearchStore();

  const [selectedPhoto, setSelectedPhoto] = React.useState<SearchPhoto | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (text: string) => {
    setQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      runSearch('');
      return;
    }

    debounceRef.current = setTimeout(() => runSearch(text), 400);
  };

  const isSearching = query.trim().length > 0;
  const hasResults = displayedPhotos.length > 0;
  const hasMore = displayedPhotos.length < allPhotos.length;

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 pt-16">

          <CustomText className="text-black text-4xl font-light tracking-tight mb-5">
            Search
          </CustomText>

          <View
            className={`border-[1.5px] border-black px-3.5 py-3 ${isSearching ? 'mb-5' : 'mb-0'}`}
          >
            <TextInput
              value={query}
              onChangeText={handleChangeText}
              placeholder="Search all photos"
              placeholderTextColor="#9ca3af"
              className="text-base text-black p-0 m-0"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>

          {loading && (
            <View className="items-center pt-10">
              <ActivityIndicator size="small" color="#000000" />
            </View>
          )}

          {!loading && hasResults && (
            <>
              <Text className="text-[11px] font-black text-black tracking-[1.5px] uppercase mb-3">
                All Results
              </Text>

              <SearchPhotoGrid
                photos={displayedPhotos}
                onPhotoPress={setSelectedPhoto}
              />

              {hasMore && (
                <View className="mt-5">
                  <Button title="See More" variant="outline" onPress={loadMore} />
                </View>
              )}
            </>
          )}

          {!loading && isSearching && !hasResults && (
            <View className="items-center pt-15">
              <Text className="text-[15px] text-zinc-400">
                No photos found for "{query}"
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      <Modal
        visible={selectedPhoto !== null}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setSelectedPhoto(null)}
        statusBarTranslucent={true}
      >
        {selectedPhoto && (
          <View className="flex-1 bg-black justify-center">
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              resizeMode="contain"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
              className="absolute top-0 left-0 right-0 pt-[60px] px-4 pb-8 flex-row justify-end"
            >
              <TouchableOpacity
                onPress={() => setSelectedPhoto(null)}
                className="w-10 h-10 justify-center items-end"
              >
                <X size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </Modal>
    </View>
  );
}