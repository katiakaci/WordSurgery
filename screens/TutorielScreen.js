import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function TutorielScreen() {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);

  const images = [
    require('../assets/tutoriel/instruction 1.png'),
    require('../assets/tutoriel/instruction 2.png'),
    require('../assets/tutoriel/instruction 3.png'),
    require('../assets/tutoriel/instruction 4.png'),
    require('../assets/tutoriel/instruction 5.png'),
    require('../assets/tutoriel/instruction 6.png')
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
        snapToAlignment="center"
      />

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentPage === index ? '#ed9125' : 'gray' },
            ]}
          />
        ))}
      </View>

      {currentPage === 5 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WordSurgery')}
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
    backgroundColor: '#fefff1',
  },
  image: {
    width: 400,
    height: 400,
    marginHorizontal: 0,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  button: {
    position: 'absolute',
    top: 500,
    padding: 10,
    backgroundColor: '#e8663d',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TutorielScreen;
