import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailsScreen({ route, navigation }) {
    const { product } = route.params || {};

    // Mock generic product if none passed
    const item = product || {
        title: "Apple iPhone 15 Pro (128 Go) - Titane Naturel",
        image: "https://m.media-amazon.com/images/I/81CgtwSII3L._AC_SX679_.jpg",
        price: "1 229,00 €",
        rating: 4.8,
        description: "L'iPhone 15 Pro est le premier iPhone doté d'un design en titane de qualité aérospatiale, conçu avec le même alliage que les véhicules d'exploration envoyés sur Mars."
    };

    // Mock Vendor Offers
    const offers = [
        { id: 1, name: 'Amazon', price: '1 229,00 €', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', delivery: 'Demain' },
        { id: 2, name: 'Cdiscount', price: '1 235,99 €', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Cdiscount_logo.svg/1200px-Cdiscount_logo.svg.png', delivery: '3 jours' },
        { id: 3, name: 'Fnac', price: '1 249,00 €', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Fnac_Logo.svg/1200px-Fnac_Logo.svg.png', delivery: 'Retrait 1h' },
    ];

    const handleBuy = (vendor) => {
        // In real app, open affiliate link
        alert(`Redirection vers ${vendor} ...`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favBtn}>
                        <Ionicons name="heart-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#F4B400" />
                        <Text style={styles.ratingText}>{item.rating} (12k avis)</Text>
                    </View>
                    <Text style={styles.bestPrice}>Meilleur prix : <Text style={styles.priceValue}>{item.price}</Text></Text>

                    <Text style={styles.sectionTitle}>Comparatif des offres</Text>

                    {/* Offers List */}
                    <View style={styles.offersList}>
                        {offers.map((offer) => (
                            <View key={offer.id} style={styles.offerCard}>
                                <View style={styles.vendorInfo}>
                                    <View style={styles.logoBox}>
                                        <Image source={{ uri: offer.logo }} style={styles.logo} resizeMode="contain" />
                                    </View>
                                    <View>
                                        <Text style={styles.vendorName}>{offer.name}</Text>
                                        <Text style={styles.delivery}>Livraison : {offer.delivery}</Text>
                                    </View>
                                </View>
                                <View style={styles.priceAction}>
                                    <Text style={styles.offerPrice}>{offer.price}</Text>
                                    <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy(offer.name)}>
                                        <Text style={styles.buyBtnText}>Voir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imageContainer: { height: 300, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    image: { width: '80%', height: '80%' },
    backBtn: { position: 'absolute', top: 50, left: 20, padding: 8, borderRadius: 20, backgroundColor: '#fff', shadowColor: '#000', elevation: 3 },
    favBtn: { position: 'absolute', top: 50, right: 20, padding: 8, borderRadius: 20, backgroundColor: '#fff', shadowColor: '#000', elevation: 3 },

    infoContainer: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, backgroundColor: '#fff', shadowColor: '#000', elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#202124', marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    ratingText: { marginLeft: 5, color: '#5f6368', fontSize: 14 },
    bestPrice: { fontSize: 16, color: '#5f6368', marginBottom: 20 },
    priceValue: { fontSize: 20, fontWeight: 'bold', color: '#1a73e8' },

    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#202124', marginTop: 10, marginBottom: 15 },

    offersList: { marginBottom: 20 },
    offerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f4' },
    vendorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoBox: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 4 },
    logo: { width: '100%', height: '100%' },
    vendorName: { fontWeight: '600', fontSize: 14, color: '#202124' },
    delivery: { fontSize: 12, color: '#188038' },

    priceAction: { alignItems: 'flex-end', gap: 4 },
    offerPrice: { fontWeight: 'bold', fontSize: 16 },
    buyBtn: { backgroundColor: '#1a73e8', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 18 },
    buyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

    description: { color: '#5f6368', lineHeight: 22 }
});
