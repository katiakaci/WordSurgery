import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function TutorielScreen() {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);

  const images = [
    require('../assets/instruction 1.jpg'),
    require('../assets/instruction 2.jpg'),
    require('../assets/instruction 3.jpg'),
  ];

  const onViewableItemsChanged = ({ viewableItems }) => {
    const currentIndex = viewableItems[0]?.index || 0;
    setCurrentPage(currentIndex);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <FlatList
        data={images}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentPage === index ? 'orange' : 'gray' },
            ]}
          />
        ))}
      </View>

      {currentPage === 2 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WordPress')}
        >
          <Text style={styles.buttonText}>Jouer !</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 400,
    marginHorizontal: 10,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TutorielScreen;
