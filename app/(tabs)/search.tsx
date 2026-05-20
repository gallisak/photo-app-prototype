import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SearchPhoto } from '../../src/store/useSearchStore';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import SearchInput from '../../src/features/search/components/SearchInput';
import SearchPhotoGrid from '../../src/features/search/components/SearchPhotoGrid';
import SearchPhotoModal from '../../src/features/search/components/SearchPhotoModal';
import { useSearchFilter } from '../../src/features/search/hooks/useSearchFilter';

export default function SearchScreen() {
  const {
    query,
    displayedPhotos,
    loading,
    isSearching,
    hasResults,
    hasMore,
    handleChangeText,
    loadMore,
  } = useSearchFilter();

  const [selectedPhoto, setSelectedPhoto] = useState<SearchPhoto | null>(null);

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

          <SearchInput
            value={query}
            onChangeText={handleChangeText}
            isSearching={isSearching}
          />

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

      <SearchPhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </View>
  );
}