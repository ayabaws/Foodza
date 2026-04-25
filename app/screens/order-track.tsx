import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const BRAND_BROWN = '#6D3119';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerFloating: { position: 'absolute', top: 0, width: '100%', zIndex: 10, paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  backCircle: { width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  headerInfo: { alignItems: 'center' },
  orderIdText: { fontWeight: '700', fontSize: 16 },
  headerSubtitle: { fontSize: 12, color: '#666' },
  helpBtn: { backgroundColor: '#0000004d', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  helpText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
  mapWrapper: { height: height * 0.5, marginTop: 0 },
  mapPlaceholder: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5' 
  },
  mapPlaceholderText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#666', 
    marginTop: 10 
  },
  mapPlaceholderSubtext: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 5 
  },
  riderMarkerMain: { backgroundColor: BRAND_BROWN, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  destMarker: { backgroundColor: '#FFF', padding: 5, borderRadius: 20, elevation: 5 },
  bottomSheet: { flex: 1, backgroundColor: '#FFF', marginTop: 20, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 25, elevation: 20 },
  handle: { width: 40, height: 5, backgroundColor: '#EEE', borderRadius: 3, alignSelf: 'center', marginVertical: 15 },
  resSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 12, borderRadius: 20, marginBottom: 15 },
  resImage: { width: 50, height: 50, borderRadius: 12 },
  resInfo: { flex: 1, marginLeft: 12 },
  resTitle: { fontWeight: '800', fontSize: 15 },
  resSub: { fontSize: 11, color: '#666' },
  resRating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  resRatingText: { fontSize: 11, marginLeft: 5, fontWeight: '600' },
  resCall: { padding: 10, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  paymentBanner: { backgroundColor: '#FFF0EA', padding: 12, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#FFDDCF' },
  paymentBannerText: { flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '700', color: BRAND_BROWN },
  payBtn: { backgroundColor: BRAND_BROWN, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8 },
  payBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainStatus: { fontSize: 22, fontWeight: '800' },
  subStatus: { fontSize: 14, color: '#666' },
  etaContainer: { backgroundColor: '#F8F8F8', padding: 10, borderRadius: 15, alignItems: 'center' },
  etaValue: { fontSize: 24, fontWeight: '800', color: BRAND_BROWN },
  etaUnit: { fontSize: 10, fontWeight: '700' },
  progressContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  stepWrapper: { flex: 1, marginRight: 5 },
  progressLine: { height: 4, borderRadius: 2, marginBottom: 8 },
  stepText: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  riderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDFDFD', borderWidth: 1, borderColor: '#F0F0F0', padding: 15, borderRadius: 20, marginBottom: 10 },
  riderAvatar: { width: 50, height: 50, borderRadius: 25 },
  riderDetails: { flex: 1, marginLeft: 15 },
  riderName: { fontSize: 16, fontWeight: '700' },
  riderStats: { fontSize: 13, color: '#666' },
  callAction: { backgroundColor: BRAND_BROWN, padding: 12, borderRadius: 15 },
  infoSection: { marginTop: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  infoTextGroup: { marginLeft: 15, flex: 1 },
  infoLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, fontWeight: '600' },
  orderDetailSection: { backgroundColor: '#F9F9F9', borderRadius: 20, padding: 15, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#333' },
  orderItemRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  itemQty: { fontSize: 13, fontWeight: '700', color: BRAND_BROWN, width: 25 },
  itemName: { fontSize: 13, color: '#444', flex: 1 },
  itemPrice: { fontSize: 13, color: '#666' },
  summaryBox: { marginTop: 20, paddingBottom: 30 },
  mainButton: { backgroundColor: '#000', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  mainButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  // MODAL CHAT
  overlayContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  overlayChatBox: { backgroundColor: '#FFF', height: height * 0.8, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  chatTitle: { fontWeight: '800', fontSize: 16 },
  chatStatus: { fontSize: 11, color: '#259547' },
  chatBubble: { padding: 15, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  chatBot: { alignSelf: 'flex-start', backgroundColor: '#EEE', borderBottomLeftRadius: 5 },
  chatUser: { alignSelf: 'flex-end', backgroundColor: BRAND_BROWN, borderBottomRightRadius: 5 },
  chatText: { fontSize: 14, lineHeight: 20 },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: Platform.OS === 'ios' ? 35 : 15
  },
  chatInput: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, marginRight: 10, fontSize: 14 },
  sendBtn: { backgroundColor: BRAND_BROWN, width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },

  // Questions rapides
  quickQuestionsContainer: { 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    backgroundColor: '#F8F9FA', 
    borderTopWidth: 1, 
    borderTopColor: '#EEE' 
  },
  quickQuestionsTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#666', 
    marginBottom: 8 
  },
  quickQuestionsScroll: { 
    flexDirection: 'row' 
  },
  quickQuestionBtn: { 
    backgroundColor: '#FFF', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 15, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: '#E0E0E0' 
  },
  quickQuestionText: { 
    fontSize: 12, 
    color: '#333', 
    fontWeight: '500' 
  },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  modalHeaderTitle: { fontSize: 18, fontWeight: '700' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 10 },
  addressPreview: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 10 
  },
  addressPreviewText: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14, 
    color: '#666' 
  },
  miniMapContainer: { height: 250, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  successContainer: { flex: 1, backgroundColor: '#FFF', padding: 25, justifyContent: 'center' },
  successContent: { alignItems: 'center' },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#259547', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  successTitle: { fontSize: 26, fontWeight: '800' },
  successSubtitle: { textAlign: 'center', color: '#666', marginTop: 10 },
  homeButton: { backgroundColor: '#000', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 50, width: '100%' },
  homeButtonText: { color: '#FFF', fontWeight: '800' },
});

export default function OrderTrackScreen() {
  const router = useRouter();

  const [isPaid, setIsPaid] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // États Infos Livraison
  const [tempName, setTempName] = useState("Fanta, 823824XXXX");
  const [tempAddress, setTempAddress] = useState("Villa 45, Rue 14 ACI 2000, Bamako");
  const [destCoords, setDestCoords] = useState({ latitude: 12.6285, longitude: -8.0210 });

  // États ChatBot
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour Fanta ! Je suis votre assistant de commande. Comment puis-je vous aider ?", sender: 'bot' }
  ]);

  const orderData = {
    orderId: "#7830000217",
    status: 2,
    estimatedTime: "39 mins",
    restaurant: {
      name: "Twisted Toppings",
      address: "ACI 2000, Rue 14, Bamako",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      rating: "4.8"
    },
    items: [
      { id: 1, name: "Classic Salted French Fries", qty: 1, price: "4500 CFA" },
      { id: 2, name: "Coca-Cola 33cl", qty: 2, price: "2000 CFA" },
      { id: 3, name: "Sauce Algérienne Maison", qty: 1, price: "500 CFA" },
    ],
    summary: {
      subtotal: "7000 CFA",
      deliveryFee: "1500 CFA",
      tax: "1000 CFA",
      total: "9500 CFA"
    },
    paymentMethod: "Mobile Money",
    rider: { name: "Makwana Dineshbhai", rating: "4.9", trips: "3k+", image: "https://i.pravatar.cc/150?u=makwana" },
    coords: { restaurant: { latitude: 12.6338, longitude: -8.0003 }, delivery: { latitude: 12.6395, longitude: -8.0065 } }
  };

  const steps = ["Reçue", "Cuisine", "En route", "Arrivé"];

  // Logique du Chatbot "Intelligent"
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      let botText = "Je ne suis pas sûr de comprendre. Je peux vous aider pour l'annulation, le suivi ou le contenu de votre commande.";
      const input = text.toLowerCase();

      if (input.includes("salut") || input.includes("bonjour") || input.includes("hello")) {
        botText = "Bonjour ! Comment se passe votre journée ? Je suis là pour toute question sur la commande " + orderData.orderId;
      } else if (input.includes("annuler") || input.includes("annulation")) {
        botText = "Pour annuler, je dois contacter le restaurant " + orderData.restaurant.name + ". Voulez-vous que je lance la procédure ?";
      } else if (input.includes("modifier") || input.includes("adresse") || input.includes("destination")) {
        botText = "Vous pouvez modifier l'adresse directement en cliquant sur l'icône 'Crayon' sur la carte. Voulez-vous que je vous montre ?";
      } else if (input.includes("temps") || input.includes("retard") || input.includes("quand") || input.includes("arrive")) {
        botText = "Votre commande est en préparation. Elle devrait arriver dans environ " + orderData.estimatedTime + ".";
      } else if (input.includes("faim") || input.includes("manger")) {
        botText = "C'est pour bientôt ! Le livreur est déjà prêt à récupérer vos frites.";
      } else if (input.includes("merci") || input.includes("top")) {
        botText = "Avec plaisir ! Profitez bien de votre repas une fois arrivé.";
      } else if (input.includes("article") || input.includes("coca") || input.includes("fries")) {
        botText = "Votre commande contient " + orderData.items.length + " articles pour un total de " + orderData.summary.total + ".";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 800);
  };

  if (isFinished) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successContent}>
          <View style={styles.successCircle}><Ionicons name="checkmark" size={60} color="#FFF" /></View>
          <Text style={styles.successTitle}>Commande Reçue !</Text>
          <Text style={styles.successSubtitle}>Bon appétit ! Votre commande a été livrée avec succès.</Text>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={() => setIsFinished(false)}>
          <Text style={styles.homeButtonText}>Retour au menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* HEADER */}
      <View style={styles.headerFloating}>
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.orderIdText}>{orderData.orderId}</Text>
              <Text style={styles.headerSubtitle}>Suivi en direct</Text>
            </View>
            <TouchableOpacity style={styles.helpBtn} onPress={() => setShowChatBot(true)}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#FFF" />
              <Text style={styles.helpText}> Aide</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* MAP PLACEHOLDER */}
      <View style={styles.mapWrapper}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={60} color="#CCC" />
          <Text style={styles.mapPlaceholderText}>Suivi de livraison en temps réel</Text>
          <Text style={styles.mapPlaceholderSubtext}>Votre commande est en route</Text>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
          {!isPaid && (
            <View style={styles.paymentBanner}>
              <Ionicons name="wallet-outline" size={20} color={BRAND_BROWN} />
              <Text style={styles.paymentBannerText}>Paiement : {orderData.summary.total}</Text>
              <TouchableOpacity style={styles.payBtn} onPress={() => setIsPaid(true)}><Text style={styles.payBtnText}>Payer</Text></TouchableOpacity>
            </View>
          )}

          <View style={styles.statusRow}>
            <View>
              <Text style={styles.mainStatus}>Préparation...</Text>
              <Text style={styles.subStatus}>Tout est à l'heure !</Text>
            </View>
            <View style={styles.etaContainer}>
              <Text style={styles.etaValue}>39</Text>
              <Text style={styles.etaUnit}>min</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            {steps.map((s, i) => (
              <View key={i} style={styles.stepWrapper}>
                <View style={[styles.progressLine, { backgroundColor: (i + 1) <= orderData.status ? BRAND_BROWN : '#EEE' }]} />
                <Text style={[styles.stepText, { color: (i + 1) <= orderData.status ? BRAND_BROWN : '#AAA' }]}>{s}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.resSection}>
            <Image source={{ uri: orderData.restaurant.image }} style={styles.resImage} />
            <View style={styles.resInfo}>
              <Text style={styles.resTitle}>{orderData.restaurant.name}</Text>
              <Text style={styles.resSub}>{orderData.restaurant.address}</Text>
              <View style={styles.resRating}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.resRatingText}>{orderData.restaurant.rating} • Partenaire</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resCall}><Feather name="phone" size={18} color={BRAND_BROWN} /></TouchableOpacity>
          </View>

          <View style={styles.riderCard}>
            <Image source={{ uri: orderData.rider.image }} style={styles.riderAvatar} />
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>{orderData.rider.name}</Text>
              <Text style={styles.riderStats}>⭐ {orderData.rider.rating} • {orderData.rider.trips} courses</Text>
            </View>
            <TouchableOpacity style={styles.callAction}><Feather name="phone" size={20} color="#FFF" /></TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <TouchableOpacity style={styles.infoRow} onPress={() => setShowEditModal(true)}>
              <View style={styles.iconCircle}><Ionicons name="person-outline" size={18} color="#666" /></View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Destinataire</Text>
                <Text style={styles.infoValue}>{tempName}</Text>
              </View>
              <Feather name="edit-2" size={14} color={BRAND_BROWN} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoRow} onPress={() => setShowEditModal(true)}>
              <View style={styles.iconCircle}><Ionicons name="location-outline" size={18} color="#666" /></View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Destination</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{tempAddress}</Text>
              </View>
              <Feather name="map" size={16} color={BRAND_BROWN} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderDetailSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ma commande</Text>
              <MaterialCommunityIcons name="receipt" size={20} color="#666" />
            </View>
            {orderData.items.map((item) => (
              <View key={item.id} style={styles.orderItemRow}>
                <Text style={styles.itemQty}>{item.qty}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryBox}>
              <TouchableOpacity
                style={[
                  styles.mainButton,
                  { backgroundColor: isPaid ? '#000' : '#888' }
                ]}
                onPress={() => {
                  if (isPaid) {
                    router.push('/screens/order-success')
                  } else {
                    Alert.alert(
                      "Paiement requis",
                      "Veuillez régler la commande avant de confirmer la réception."
                    );
                  }
                }}
              >
                <Text style={styles.mainButtonText}>Confirmer la réception</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* MODAL CHATBOT AVEC FIX CLAVIER */}
      <Modal visible={showChatBot} transparent={true} animationType="slide">
        <View style={styles.overlayContainer}>
          <SafeAreaView style={styles.overlayChatBox} edges={['bottom']}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              style={{ flex: 1 }}
            >
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setShowChatBot(false)}>
                <Ionicons name="chevron-down" size={28} />
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.chatTitle}>Assistant Commande</Text>
                <Text style={styles.chatStatus}>En ligne</Text>
              </View>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              contentContainerStyle={{ padding: 20 }}
              style={{ maxHeight: height * 0.4 }}
            >
              {messages.map((m) => (
                <View key={m.id} style={[styles.chatBubble, m.sender === 'user' ? styles.chatUser : styles.chatBot]}>
                  <Text style={[styles.chatText, m.sender === 'user' ? { color: '#FFF' } : { color: '#333' }]}>{m.text}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Questions prédéfinies */}
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Questions rapides :</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsScroll}>
                {[
                  "Où est ma commande ?",
                  "Combien de temps ?",
                  "Annuler ma commande",
                  "Modifier l'adresse",
                  "Contacter le livreur"
                ].map((question, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.quickQuestionBtn}
                    onPress={() => sendMessage(question)}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Posez votre question..."
                placeholderTextColor="#999"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={() => sendMessage(chatInput)}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(chatInput)}>
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* MODAL MODIF LIVRAISON */}
      <Modal visible={showEditModal} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Modifier la livraison</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={{ padding: 20 }}>
            <Text style={styles.inputLabel}>Destinataire</Text>
            <TextInput style={styles.input} value={tempName} onChangeText={setTempName} />
            <Text style={styles.inputLabel}>Adresse exacte</Text>
            <TextInput style={styles.input} value={tempAddress} onChangeText={setTempAddress} />
            <View style={styles.addressPreview}>
              <Ionicons name="location" size={24} color={BRAND_BROWN} />
              <Text style={styles.addressPreviewText}>Adresse : {tempAddress}</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}


