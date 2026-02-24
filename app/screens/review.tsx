import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReviewScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [review, setReview] = useState('');

  const tags = [
    'Rapide',
    'Chaud',
    'Bien emballé',
    'Goûteux',
    'Quantité généreuse',
    'Propre',
    'Bon service',
    'Prix raisonnable'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const submitReview = () => {
    if (rating === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner une note');
      return;
    }
    
    Alert.alert(
      'Merci pour votre avis!',
      'Votre évaluation a été enregistrée avec succès.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const renderStar = (index: number) => {
    const filled = index < rating;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={styles.starButton}
      >
        <Ionicons 
          name={filled ? "star" : "star-outline"} 
          size={40} 
          color={filled ? "#FFA500" : "#E0E0E0"} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Évaluer la commande</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.skipButton}>Passer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Restaurant Info */}
        <View style={styles.restaurantSection}>
          <Image 
            source={require('@/assets/food/food2.jpeg')} 
            style={styles.restaurantImage} 
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>La Brioche Dorée</Text>
            <Text style={styles.orderDate}>Commande du 24 février 2026</Text>
            <Text style={styles.orderItems}>3 articles • 11 400 FCFA</Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Comment s'est passée votre commande?</Text>
          <Text style={styles.sectionSubtitle}>Votre note nous aide à nous améliorer</Text>
          
          <View style={styles.starsContainer}>
            {[0, 1, 2, 3, 4].map(renderStar)}
          </View>
          
          <Text style={styles.ratingText}>
            {rating === 0 ? 'Sélectionnez une note' : 
             rating === 1 ? 'Très mauvais' :
             rating === 2 ? 'Mauvais' :
             rating === 3 ? 'Correct' :
             rating === 4 ? 'Bon' : 'Excellent'}
          </Text>
        </View>

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Qu'est-ce que vous avez aimé?</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextSelected
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Review Text */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Ajouter un commentaire</Text>
          <Text style={styles.sectionSubtitle}>Donnez plus de détails (optionnel)</Text>
          
          <View style={styles.reviewInputContainer}>
            <Text style={styles.reviewPlaceholder}>
              {review || 'Décrivez votre expérience...'}
            </Text>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Ajouter des photos</Text>
          <View style={styles.photosContainer}>
            <TouchableOpacity style={styles.addPhotoButton}>
              <Ionicons name="camera-outline" size={30} color="#8C3E22" />
              <Text style={styles.addPhotoText}>Ajouter une photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Rating */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Noter la livraison</Text>
          <View style={styles.deliveryRatingContainer}>
            <View style={styles.deliveryItem}>
              <Image 
                source={require('@/assets/food/food2.jpeg')} 
                style={styles.deliveryItemImage} 
              />
              <View style={styles.deliveryItemInfo}>
                <Text style={styles.deliveryItemName}>La Brioche Dorée</Text>
                <Text style={styles.deliveryItemTime}>25-30 mins</Text>
              </View>
              <View style={styles.deliveryStars}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <TouchableOpacity key={index}>
                    <Ionicons 
                      name="star-outline" 
                      size={20} 
                      color="#E0E0E0" 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Driver Rating */}
        <View style={styles.driverSection}>
          <Text style={styles.sectionTitle}>Noter le livreur</Text>
          <View style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>Mamadou Konaté</Text>
                <Text style={styles.driverVehicle}>Moto • Honda</Text>
              </View>
            </View>
            <View style={styles.driverStars}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity key={index}>
                  <Ionicons 
                    name="star-outline" 
                    size={20} 
                    color="#E0E0E0" 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={submitReview}
          disabled={rating === 0}
        >
          <Text style={styles.submitButtonText}>Envoyer l'évaluation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  skipButton: {
    fontSize: 16,
    color: '#8C3E22',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  restaurantSection: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  starButton: {
    marginHorizontal: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tagsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagSelected: {
    backgroundColor: '#8C3E22',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagTextSelected: {
    color: '#FFF',
  },
  reviewSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewInputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 15,
    minHeight: 100,
  },
  reviewPlaceholder: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
  photosSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  photosContainer: {
    flexDirection: 'row',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#8C3E22',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#8C3E22',
    marginTop: 5,
    textAlign: 'center',
  },
  deliverySection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deliveryRatingContainer: {
    marginTop: 15,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  deliveryItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  deliveryItemInfo: {
    flex: 1,
  },
  deliveryItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 3,
  },
  deliveryItemTime: {
    fontSize: 14,
    color: '#666',
  },
  deliveryStars: {
    flexDirection: 'row',
  },
  driverSection: {
    padding: 20,
    marginBottom: 100,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8C3E22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 3,
  },
  driverVehicle: {
    fontSize: 14,
    color: '#666',
  },
  driverStars: {
    flexDirection: 'row',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#8C3E22',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
