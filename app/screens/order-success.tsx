import { useOrder } from '@/contexts/OrderContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// 1. VARIABLES POUR FACILITER L'INTEGRATION BACKEND
const orderData = {
  restaurantName: "Le Délice de Bamako",
  restaurantAddress: "ACI 2000, Bamako",
  restaurantPhone: "+22311111111",
  deliveryStatus: "Commande livrée à Domicile",
  deliveryTime: "21:18",
  rider: {
    name: "Moussa Traoré",
    stats: "3k+ livraisons effectuées",
    rating: "4.9",
    phone: "+22300000000",
    profilePicture: null,
  }
};

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { completeOrder } = useOrder();
  
  // États pour la gestion des interactions
  const [selectedTip, setSelectedTip] = useState<string | null>(null);
  const [riderRating, setRiderRating] = useState<number>(0);
  const [resRating, setResRating] = useState<number>(0);
  const [packagingStatus, setPackagingStatus] = useState<'good' | 'not_good' | null>(null);
  const [showCustomTipModal, setShowCustomTipModal] = useState<boolean>(false);
  const [customTipAmount, setCustomTipAmount] = useState<string>('');

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => 
      Alert.alert("Erreur", "Impossible de passer l'appel")
    );
  };

  const handleFinalConfirm = () => {
    // Ici, vous pourriez envoyer toutes les données (ratings, tip, packaging) au backend
    console.log({
      riderNote: riderRating,
      restaurantNote: resRating,
      packaging: packagingStatus,
      pourboire: selectedTip || customTipAmount
    });
    
    // Terminer la commande active
    completeOrder();
    
    router.replace('/home'); 
  };

  // 2. LOGIQUE DE L'AVATAR (Image ou Initiales)
  const renderRiderAvatar = () => {
    if (orderData.rider.profilePicture) {
      return (
        <Image 
          source={{ uri: orderData.rider.profilePicture }} 
          style={styles.avatarImage} 
        />
      );
    }

    // Extraction des initiales
    const initials = orderData.rider.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return (
      <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
        <Text style={styles.avatarPlaceholderText}>{initials}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* FOND EN DÉGRADÉ */}
      <LinearGradient
        colors={['#D1D5DB', '#E5E7EB', '#F9FAFB']}
        style={StyleSheet.absoluteFill}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{orderData.restaurantName}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* SECTION TICKET (Animation visuelle de livraison) */}
        <View style={styles.ticketWrapper}>
          <ImageBackground 
            source={require('@/assets/delivery-success.png')} 
            style={styles.ticketBackgroundImage}
            imageStyle={{ resizeMode: 'contain' }}
          >
            <View style={styles.ticketTextContent}>
              <Text style={styles.mainStatus}>{orderData.deliveryStatus}</Text>
              <View style={styles.dashedLine} />
              <Text style={styles.deliveryTime}>Livrée à {orderData.deliveryTime}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* SECTION 1 : ÉVALUATION RESTAURANT & EMBALLAGE */}
        <View style={styles.card}>
          <View style={styles.rateHeader}>
            <Ionicons name="restaurant-outline" size={20} color="#5D6167" />
            <Text style={styles.rateTitleText}>Notez le restaurant</Text>
          </View>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setResRating(i)}>
                <Ionicons 
                    name={i <= resRating ? "star" : "star-outline"} 
                    size={32} 
                    color={i <= resRating ? "#FFC107" : "#DBDEE3"} 
                    style={{ marginHorizontal: 6 }} 
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.rateHeader}>
            <Feather name="package" size={18} color="#5D6167" />
            <Text style={styles.rateTitleText}>Comment était l'emballage ?</Text>
          </View>

          <View style={styles.packagingRow}>
            <TouchableOpacity 
              style={[styles.packagingBtn, packagingStatus === 'good' && styles.packagingBtnActive]} 
              onPress={() => setPackagingStatus('good')}
            >
              <Text style={[styles.packagingText, packagingStatus === 'good' && styles.packagingTextActive]}>Bien</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.packagingBtn, packagingStatus === 'not_good' && styles.packagingBtnActive]} 
              onPress={() => setPackagingStatus('not_good')}
            >
              <Text style={[styles.packagingText, packagingStatus === 'not_good' && styles.packagingTextActive]}>Pas bien</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2 : CARTE LIVREUR (Profil, Pourboire, Note) */}
        <View style={[styles.card, { marginTop: 14 }]}>
          <View style={styles.riderRow}>
            <View style={styles.avatarContainer}>
               {renderRiderAvatar()}
               <View style={styles.onlineDot} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.riderName}>{orderData.rider.name}</Text>
              <Text style={styles.riderSub}>{orderData.rider.stats}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{orderData.rider.rating}</Text>
              <Ionicons name="star" size={12} color="#1BA94C" />
            </View>
          </View>

          <View style={styles.chatRow}>
            <TouchableOpacity style={styles.chatBox} disabled>
              <Ionicons name="chatbubble-outline" size={18} color="#9AA0A6" />
              <Text style={styles.chatDisabled}>Chat indisponible</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callCircle} onPress={() => makeCall(orderData.rider.phone)}>
              <Feather name="phone" size={18} color="#E23744" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.tipTitle}>
            Remerciez {orderData.rider.name.split(' ')[0]} avec un pourboire. 100% lui est reversé.
          </Text>

          <View style={styles.tipRow}>
            {['200', '500', '1000'].map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => setSelectedTip(amount)}
                style={[styles.tipButton, selectedTip === amount && styles.tipSelected]}
              >
                <Text style={[styles.tipLabel, selectedTip === amount && styles.tipLabelSelected]}>
                  {amount} F
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.tipButton}
              onPress={() => setShowCustomTipModal(true)}
            >
              <Text style={styles.tipLabel}>Autre</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.rateHeader}>
            <MaterialCommunityIcons name="gesture-tap-button" size={20} color="#5D6167" />
            <Text style={styles.rateTitleText}>Notez {orderData.rider.name.split(' ')[0]}</Text>
          </View>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRiderRating(i)}>
                <Ionicons 
                    name={i <= riderRating ? "star" : "star-outline"} 
                    size={32} 
                    color={i <= riderRating ? "#FFC107" : "#DBDEE3"} 
                    style={{ marginHorizontal: 6 }} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SECTION 3 : CONTACT RESTAURANT */}
        <View style={styles.restaurantCard}>
          <View style={styles.resIconBg}>
             <Ionicons name="restaurant" size={20} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.resName}>{orderData.restaurantName}</Text>
            <Text style={styles.resSub}>{orderData.restaurantAddress}</Text>
          </View>
          <TouchableOpacity 
            style={styles.callCircle} 
            onPress={() => makeCall(orderData.restaurantPhone)}
          >
            <Feather name="phone" size={18} color="#E23744" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOOTER FIXE */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainButton} onPress={handleFinalConfirm}>
          <Text style={styles.mainButtonText}>Confirmer et Terminer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour pourboire personnalisé */}
      <Modal
        visible={showCustomTipModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomTipModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customTipModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Montant personnalisé</Text>
              <TouchableOpacity onPress={() => setShowCustomTipModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Entrez le montant que vous souhaitez donner à {orderData.rider.name.split(' ')[0]}
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.customTipInput}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={customTipAmount}
                onChangeText={setCustomTipAmount}
                autoFocus
              />
              <Text style={styles.currencyText}>F</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCustomTipModal(false);
                  setCustomTipAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  if (customTipAmount && parseInt(customTipAmount) > 0) {
                    setSelectedTip(customTipAmount);
                    setShowCustomTipModal(false);
                    setCustomTipAmount('');
                  } else {
                    Alert.alert("Erreur", "Veuillez entrer un montant valide");
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', justifyContent: 'center', height: 56, top: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1D21' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTipModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 320,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D21',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  customTipInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1D21',
    paddingVertical: 12,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButton: {
    backgroundColor: '#E23744',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  ticketWrapper: { alignItems: 'center', width: width, height: 310 },
  ticketBackgroundImage: { width: width * 0.99, height: '100%', justifyContent: 'flex-end' },
  ticketTextContent: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
  mainStatus: { fontSize: 16, fontWeight: '600', color: '#1A1D21', marginBottom: 8, textAlign: 'center' },
  dashedLine: { width: '100%', height: 1, borderWidth: 0.8, borderColor: '#E2E8F0', borderStyle: 'dashed', marginBottom: 12 },
  deliveryTime: { fontSize: 13, color: '#a7adb4ff', fontWeight: '500' },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 14,
    marginTop: -15,
    borderRadius: 18,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  packagingRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  packagingBtn: { flex: 1, height: 42, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  packagingBtnActive: { borderColor: '#E23744', backgroundColor: '#FFF5F6' },
  packagingText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  packagingTextActive: { color: '#E23744', fontWeight: '700' },

  riderRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { marginRight: 12 },
  avatarImage: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F1F5F9' },
  avatarPlaceholder: { backgroundColor: '#1A1D21', justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholderText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  onlineDot: { position: 'absolute', bottom: 2, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#1BA94C', borderWidth: 2, borderColor: '#FFF' },
  riderName: { fontSize: 16, fontWeight: '700', color: '#1A1D21' },
  riderSub: { fontSize: 12, color: '#64748B', marginTop: 1 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  ratingText: { color: '#166534', fontWeight: '700', marginRight: 3, fontSize: 12 },
  
  chatRow: { flexDirection: 'row', marginTop: 16 },
  chatBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12, height: 44, marginRight: 12 },
  chatDisabled: { color: '#94A3B8', marginLeft: 8, fontSize: 14 },
  callCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 18 },
  tipTitle: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 14 },
  tipRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tipButton: { flex: 1, paddingVertical: 9, marginHorizontal: 4, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  tipSelected: { borderColor: '#E23744', backgroundColor: '#FFF5F6' },
  tipLabel: { fontWeight: '600', color: '#1A1D21', fontSize: 14 },
  tipLabelSelected: { color: '#E23744' },

  rateHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  rateTitleText: { fontSize: 14, fontWeight: '600', color: '#1A1D21', marginLeft: 10 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5 },
  
  restaurantCard: { backgroundColor: '#FFF', marginHorizontal: 14, marginTop: 14, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center' },
  resIconBg: { width: 42, height: 42, borderRadius: 8, backgroundColor: '#1A1D21', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  resName: { fontSize: 15, fontWeight: '700', color: '#1A1D21' },
  resSub: { fontSize: 12, color: '#64748B', marginTop: 2 },

  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  mainButton: { backgroundColor: '#000', height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  mainButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});