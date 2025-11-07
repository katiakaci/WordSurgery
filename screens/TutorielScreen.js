import React, { useState, useRef } from 'react';
import { View, Text, StatusBar, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import i18n from '../languages/i18n';

const { width } = Dimensions.get('window');

function TutorielScreen() {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const tutorialSteps = [
    {
      id: '1',
      icon: 'hand-left-outline',
      title: i18n.t('tutorial_step1_title'),
      description: i18n.t('tutorial_step1_desc'),
      color: '#9be69d',
    },
    {
      id: '2',
      icon: 'arrow-forward-circle-outline',
      title: i18n.t('tutorial_step2_title'),
      description: i18n.t('tutorial_step2_desc'),
      color: '#ffe270',
    },
    {
      id: '3',
      icon: 'checkmark-circle-outline',
      title: i18n.t('tutorial_step3_title'),
      description: i18n.t('tutorial_step3_desc'),
      color: '#fd9468',
    },
    {
      id: '4',
      icon: 'time-outline',
      title: i18n.t('tutorial_step4_title'),
      description: i18n.t('tutorial_step4_desc'),
      color: '#fe73c5',
    },
  ];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
  }).current;

  const goToNextPage = () => {
    if (currentPage < tutorialSteps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
    } else {
      navigation.navigate("Accueil");
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      flatListRef.current?.scrollToIndex({ index: currentPage - 1, animated: true });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.slide, { width }]}>
        <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
          <LinearGradient
            colors={[item.color, `${item.color}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={60} color="white" />
            </View>
            <Text style={styles.stepNumber}>{i18n.t('step')} {index + 1}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animation de fond */}
      <LottieView
        source={require('../assets/animation/HomePage.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
        speed={0.5}
      />

      {/* Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        data={tutorialSteps}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      {/* Indicateurs de page (dots) */}
      <View style={styles.dotsContainer}>
        {tutorialSteps.map((_, index) => {
          const isActive = index === currentPage;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? tutorialSteps[currentPage].color : '#D1D5DB',
                  opacity: isActive ? 1 : 0.4,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Boutons de navigation */}
      <View style={styles.navigationContainer}>
        {currentPage > 0 && (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: tutorialSteps[currentPage].color }]}
            onPress={goToPrevPage}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === tutorialSteps.length - 1 ? styles.playButton : styles.nextButton,
            { backgroundColor: tutorialSteps[currentPage].color }
          ]}
          onPress={goToNextPage}
        >
          {currentPage === tutorialSteps.length - 1 ? (
            <>
              <Text style={styles.nextButtonText}>{i18n.t('play')}</Text>
              <Ionicons name="play" size={24} color="white" />
            </>
          ) : (
            <Ionicons name="chevron-forward" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    width: width - 60,
    height: 400,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    // elevation: 10,
  },
  cardGradient: {
    flex: 1,
    padding: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: 56,
    height: 56,
  },
  playButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: 'auto',
    minWidth: 56,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default TutorielScreen;
