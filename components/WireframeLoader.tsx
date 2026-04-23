import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WireframeLoaderProps {
  isVisible: boolean;
}

const WireframeLoader: React.FC<WireframeLoaderProps> = ({ isVisible }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [isVisible, shimmerAnim]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonDesc} />
        <View style={styles.skeletonFooter}>
          <View style={styles.skeletonPrice} />
          <View style={styles.skeletonButtons} />
        </View>
      </View>
    </View>
  );

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerTranslateX }] }]} />
      
      {/* Header Skeleton */}
      <View style={styles.headerSkeleton}>
        <View style={styles.backButtonSkeleton} />
        <View style={styles.titleSkeleton} />
        <View style={styles.shareButtonSkeleton} />
      </View>

      {/* Cart Items Skeleton */}
      <View style={styles.cartItemsSkeleton}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>

      {/* Recommendation Section Skeleton */}
      <View style={styles.recommendationSkeleton}>
        <View style={styles.sectionTitleSkeleton} />
        <View style={styles.horizontalScrollSkeleton}>
          {[1, 2, 3].map((index) => (
            <View key={index} style={styles.recommendCardSkeleton}>
              <View style={styles.recommendImageSkeleton} />
              <View style={styles.recommendTextSkeleton} />
            </View>
          ))}
        </View>
      </View>

      {/* Footer Skeleton */}
      <View style={styles.footerSkeleton}>
        <View style={styles.paymentSkeleton} />
        <View style={styles.orderButtonSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F5F5',
    zIndex: 1000,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: SCREEN_WIDTH * 2,
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 40,
  },
  backButtonSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  titleSkeleton: {
    width: 150,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  shareButtonSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  cartItemsSkeleton: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  skeletonImage: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  skeletonTitle: {
    width: 120,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  skeletonDesc: {
    width: 100,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  skeletonPrice: {
    width: 80,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E0E0E0',
  },
  skeletonButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  recommendationSkeleton: {
    marginTop: 30,
  },
  sectionTitleSkeleton: {
    width: 200,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
    alignSelf: 'center',
  },
  horizontalScrollSkeleton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  recommendCardSkeleton: {
    width: 140,
    marginRight: 15,
  },
  recommendImageSkeleton: {
    width: 140,
    height: 140,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  recommendTextSkeleton: {
    width: 100,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginBottom: 4,
  },
  footerSkeleton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentSkeleton: {
    width: 100,
    height: 40,
    backgroundColor: '#333333',
    borderRadius: 10,
  },
  orderButtonSkeleton: {
    width: 200,
    height: 45,
    backgroundColor: '#333333',
    borderRadius: 30,
  },
});

export default WireframeLoader;
