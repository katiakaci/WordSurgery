import React from 'react';
import { View, Text, StatusBar, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function TutorielScreen() {
  const navigation = useNavigation();

  const images = [
    require('../assets/instruction 1.jpg'),
    require('../assets/instruction 2.jpg'),
    require('../assets/instruction 3.jpg'),
  ];

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
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WordPress')}
      >
        <Text style={styles.buttonText}>Jouer !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Couleur de fond, ajustez comme vous le souhaitez
  },
  image: {
    width: 300, // Taille de l'image, ajustez selon vos besoins
    height: 400, // Taille de l'image
    marginHorizontal: 10, // Espacement horizontal entre les images
    resizeMode: 'contain', // Assurez-vous que l'image garde ses proportions
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50', // Couleur du bouton
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TutorielScreen;
