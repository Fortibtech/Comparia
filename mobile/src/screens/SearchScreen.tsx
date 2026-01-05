import React, { useState } from 'react';
import {
    View, Text, TextInput, FlatList, Image, TouchableOpacity,
    ActivityIndicator, StyleSheet, Linking, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Types (Mirrors Backend)
type Offer = {
    vendor: string;
    price: number;
    url: string;
};

type Product = {
    id: string;
    title: string;
    bestPrice: number;
    currency: string;
    imageUrl: string;
    offers: Offer[];
    vendorCount: number;
};

// --- API Service Mock for the Component ---
const searchProducts = async (q: string): Promise<Product[]> => {
    // Mocking the response to ensure UI works immediately
    return new Promise(resolve => setTimeout(() => {
        resolve([
            {
                id: '1',
                title: 'Sony WH-1000XM5 Casque sans fil',
                bestPrice: 299.99,
                currency: 'EUR',
                imageUrl: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_UF894,1000_QL80_.jpg',
                vendorCount: 3,
                offers: [
                    { vendor: 'Amazon', price: 349.00, url: 'https://amazon.com' },
                    { vendor: 'Cdiscount', price: 299.99, url: 'https://cdiscount.com' },
                    { vendor: 'Fnac', price: 329.99, url: 'https://fnac.com' }
                ]
            },
            {
                id: '2',
                title: 'Apple iPhone 14 (128 Go) - Minuit',
                bestPrice: 749.00,
                currency: 'EUR',
                imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=2560&hei=1440&fmt=p-jpg',
                vendorCount: 5,
                offers: [
                    { vendor: 'Amazon', price: 749.00, url: 'https://amazon.com' },
                    { vendor: 'Rakuten', price: 755.00, url: 'https://rakuten.com' }
                ]
            }
        ]);
    }, 1200));
};

// Popular search suggestions
const SEARCH_SUGGESTIONS = [
    'écouteurs', 'écouteurs bluetooth', 'enceinte bluetooth', 'enceinte',
    'iPhone', 'iPhone 14', 'iPhone 15', 'iPad', 'iMac', 'MacBook',
    'casque audio', 'casque gaming', 'casque bluetooth',
    'télévision', 'TV Samsung', 'TV 4K',
    'airpods', 'AirPods Pro',
    'montre connectée', 'Apple Watch',
    'smartphone', 'smartphone Samsung', 'Samsung Galaxy',
    'ordinateur portable', 'PC portable',
    'tablette', 'tablette Samsung',
    'console', 'PS5', 'PlayStation 5', 'Xbox', 'Nintendo Switch',
    'clavier', 'souris', 'souris gaming',
    'imprimante', 'webcam', 'microphone'
];

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Product[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Remove accents from text for search (e.g., "écouteurs" matches "ecouteurs")
    const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Filter suggestions based on query - updates continuously as user types
    const handleQueryChange = (text: string) => {
        setQuery(text);
        if (text.length >= 1) {
            const searchText = removeAccents(text.toLowerCase());
            // Filter suggestions that contain the search text anywhere (accent-insensitive)
            const filtered = SEARCH_SUGGESTIONS.filter(s =>
                removeAccents(s.toLowerCase()).includes(searchText)
            );
            setFilteredSuggestions(filtered.slice(0, 6)); // Max 6 suggestions
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
            setFilteredSuggestions([]);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        // Trigger search after selection
        setTimeout(() => {
            handleSearchWithQuery(suggestion);
        }, 100);
    };

    const handleSearchWithQuery = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setHasSearched(true);
        setShowSuggestions(false);
        try {
            const data = await searchProducts(searchQuery);
            setResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const data = await searchProducts(query);
            setResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (id: string) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url); // Opens browser
    };

    const renderItem = ({ item }: { item: Product }) => {
        const isFav = favorites.includes(item.id);

        return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
                <View style={styles.cardHeader}>
                    {/* Best Price Badge */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Meilleur: {item.bestPrice} {item.currency}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#e31b23" : "#666"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
                    <View style={styles.info}>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.vendorCount}>{item.vendorCount} marchands comparés</Text>

                        <View style={styles.offersRow}>
                            {item.offers.slice(0, 2).map((offer, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.offerBtn, offer.price === item.bestPrice ? styles.bestOfferBtn : styles.normalOfferBtn]}
                                    onPress={() => handleOpenLink(offer.url)}
                                >
                                    <Text style={offer.price === item.bestPrice ? styles.bestOfferText : styles.normalOfferText}>
                                        {offer.vendor}: {offer.price}€
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // State to manage UI transition from Center (Home) to Top (Results)
    const isCentered = !hasSearched && results.length === 0;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Animated Container for Logo & Search */}
            <View style={[styles.searchSection, isCentered ? styles.centeredSection : styles.topSection]}>

                {/* Favorites Button (Home Mode) */}
                {isCentered && (
                    <TouchableOpacity style={styles.favIconHome} onPress={() => navigation.navigate('Favorites')}>
                        <Ionicons name="heart-circle-outline" size={32} color="#333" />
                    </TouchableOpacity>
                )}

                {/* Logo - Hide or Smallify when searching could be an option, but keeping it simple */}
                <Text style={[styles.logo, isCentered ? styles.logoLarge : styles.logoSmall]}>
                    <Text style={{ color: '#4285F4' }}>C</Text>
                    <Text style={{ color: '#DB4437' }}>o</Text>
                    <Text style={{ color: '#F4B400' }}>m</Text>
                    <Text style={{ color: '#4285F4' }}>p</Text>
                    <Text style={{ color: '#0F9D58' }}>a</Text>
                    <Text style={{ color: '#DB4437' }}>r</Text>
                    <Text style={{ color: '#4285F4' }}>i</Text>
                    <Text style={{ color: '#F4B400' }}>o</Text>
                </Text>

                <View style={styles.searchBarContainer}>
                    <Ionicons name="search" size={20} color="#9aa0a6" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Rechercher un produit..."
                        placeholderTextColor="#9aa0a6"
                        value={query}
                        onChangeText={handleQueryChange}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => { setQuery(''); setShowSuggestions(false); }}>
                            <Ionicons name="close-circle" size={20} color="#9aa0a6" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && isCentered && (
                    <View style={styles.suggestionsContainer}>
                        {filteredSuggestions.map((suggestion, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.suggestionItem}
                                onPress={() => handleSelectSuggestion(suggestion)}
                            >
                                <Ionicons name="search-outline" size={16} color="#9aa0a6" style={{ marginRight: 12 }} />
                                <Text style={styles.suggestionText}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Favorites Button (Results Mode) */}
                {!isCentered && (
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Favorites')}>
                        <Ionicons name="heart-circle-outline" size={32} color="#4285F4" />
                    </TouchableOpacity>
                )}

                {isCentered && (
                    <>
                        {/* Vendors Row - Now closer to search bar */}
                        <View style={styles.vendorsContainer}>
                            <Text style={styles.vendorsTitle}>Comparés en temps réel :</Text>
                            <View style={styles.vendorIconsRow}>
                                <View style={styles.vendorCircle}>
                                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg' }} style={styles.vendorLogo} resizeMode="contain" />
                                </View>
                                <View style={styles.vendorCircle}>
                                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Cdiscount_logo.svg/1200px-Cdiscount_logo.svg.png' }} style={styles.vendorLogo} resizeMode="contain" />
                                </View>
                                <View style={styles.vendorCircle}>
                                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Muji-Temu-Logo.svg/1200px-Muji-Temu-Logo.svg.png' }} style={styles.vendorLogo} resizeMode="contain" />
                                </View>
                                <View style={styles.vendorCircle}>
                                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Shein-Logo-300x158.png/640px-Shein-Logo-300x158.png' }} style={styles.vendorLogo} resizeMode="contain" />
                                </View>
                                <View style={styles.vendorCircle}>
                                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Fnac_Logo.svg/1200px-Fnac_Logo.svg.png' }} style={styles.vendorLogo} resizeMode="contain" />
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Results Area */}
            {!isCentered && (
                <View style={styles.resultsContainer}>
                    {loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color="#4285F4" />
                            <Text style={styles.loadingText}>Recherche mult-boutiques...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={results}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.center}>
                                    <Text style={styles.emptyText}>Aucun résultat trouvé pour "{query}"</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Layout Management
    searchSection: { paddingHorizontal: 20, alignItems: 'center' },
    centeredSection: { flex: 1, justifyContent: 'center', marginBottom: 50 },
    topSection: { paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },

    // Logo Styles
    logo: { fontWeight: 'bold' },
    logoLarge: { fontSize: 40, marginBottom: 30, letterSpacing: -1 },
    logoSmall: { fontSize: 20, marginRight: 15, display: 'none' }, // Hidden in top bar to save space

    // Search Bar
    searchBarContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1, borderColor: '#dfe1e5', borderRadius: 24,
        paddingHorizontal: 15, height: 48, width: '100%',
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2
    },
    searchIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#202124' },

    // Button "Lucky" style
    luckyBtn: { marginTop: 20, backgroundColor: '#f8f9fa', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4 },
    luckyBtnText: { color: '#3c4043', fontSize: 14 },

    // Results
    resultsContainer: { flex: 1, backgroundColor: '#f5f7fa' },
    listContent: { padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    loadingText: { marginTop: 10, color: '#666' },
    emptyText: { color: '#666', fontSize: 16 },

    // Cards (Simplified Google Style)
    card: {
        backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 12,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    badge: { backgroundColor: '#e3fff0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    badgeText: { color: '#188038', fontWeight: '700', fontSize: 10 },

    cardBody: { flexDirection: 'row', gap: 12 },
    image: { width: 90, height: 90, resizeMode: 'contain', backgroundColor: '#fff' },
    info: { flex: 1, justifyContent: 'space-between' },
    title: { fontSize: 15, color: '#1a0dab', marginBottom: 4, lineHeight: 20 }, // Google Blue Link color
    vendorCount: { fontSize: 12, color: '#70757a' },

    offersRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    offerBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1 },
    bestOfferBtn: { backgroundColor: '#fff', borderColor: '#dcdcdc' },
    normalOfferBtn: { backgroundColor: '#fff', borderColor: '#dcdcdc' },
    bestOfferText: { color: '#202124', fontSize: 12, fontWeight: '500' },
    normalOfferText: { color: '#5f6368', fontSize: 12 },

    // Fav Icon Home
    favIconHome: { position: 'absolute', top: 10, right: 0, zIndex: 10 },

    // Vendors Container (New Layout)
    vendorsContainer: { marginTop: 40, alignItems: 'center' },
    vendorsTitle: { color: '#9aa0a6', fontSize: 13, marginBottom: 15 },
    vendorIconsRow: { flexDirection: 'row', gap: 15 },
    vendorCircle: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
        overflow: 'hidden', padding: 5
    },
    vendorLogo: { width: '100%', height: '100%' },

    // Search Suggestions
    suggestionsContainer: {
        position: 'absolute',
        top: 125, // Below search bar in centered mode
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 100,
        overflow: 'hidden'
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    suggestionText: {
        fontSize: 15,
        color: '#202124'
    }
});
