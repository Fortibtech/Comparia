import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
    // Mock Favorites
    const favorites = [
        { id: '1', title: "PlayStation 5 Édition Standard", price: "499,00 €", image: "https://m.media-amazon.com/images/I/51H+hNl9AdL._AC_UL320_.jpg" },
        { id: '2', title: "AirPods Pro (2e génération)", price: "229,00 €", image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UL320_.jpg" },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.trashBtn}>
                <Ionicons name="trash-outline" size={20} color="#ea4335" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mes Favoris</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },

    list: { padding: 16 },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    image: { width: 60, height: 60, resizeMode: 'contain', marginRight: 15 },
    info: { flex: 1 },
    title: { fontSize: 14, fontWeight: '500', color: '#202124', marginBottom: 4 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#1a73e8' },
    trashBtn: { padding: 8 }
});
