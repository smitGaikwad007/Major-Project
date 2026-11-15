import { useState, useEffect } from 'react';

const WISHLIST_STORAGE_KEY = 'philately_wishlist';

export const FALLBACK_STAMPS = [
  {
    id: '1',
    name: '1852 Scinde Dawk Scarlet Wafer',
    year: 1852,
    issueYear: '1852',
    faceValue: '½ Anna',
    country: 'India (Sindh Province)',
    category: 'Pre-Imperial India',
    condition: 'Fine Embossed Seal',
    grade: 'Rarity AAA',
    description: "Asia's first adhesive postage stamp, embossed into brittle red sealing wafers under Sir Bartle Frere.",
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    provenance: 'Ex-Ferrary Collection',
    postmark: 'Karachi B.P.O 1852',
  },
  {
    id: '2',
    name: '1854 Inverted Head Four Annas',
    year: 1854,
    issueYear: '1854',
    faceValue: '4 Annas',
    country: 'British India',
    category: 'Classic British India',
    condition: 'Good Used, Octagonal Cut',
    grade: 'World Rarity',
    description: "Famous lithographic error printed at Calcutta showing Queen Victoria's head inverted inside an octagonal frame.",
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    provenance: 'Royal Philatelic Society London Cert.',
    postmark: 'Diamond 1 Cooper Cancel',
  },
  {
    id: '3',
    name: '1947 Jai Hind 3½ Annas Tiranga Flag',
    year: 1947,
    issueYear: '1947',
    faceValue: '3½ Annas',
    country: 'Republic of India',
    category: 'Independence Issue',
    condition: 'Mint Never Hinged (MNH)',
    grade: 'Superb 95',
    description: 'Post-independence inaugural commemorative stamp depicting the Indian National Tricolour with Jai Hind inscription.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    provenance: 'Indian Security Press Nasik',
    postmark: 'New Delhi G.P.O 15-AUG-47',
  },
  {
    id: '4',
    name: "1948 Mahatma Gandhi Memorial 10 Rs 'SERVICE'",
    year: 1948,
    issueYear: '1948',
    faceValue: '10 Rupees',
    country: 'Republic of India',
    category: 'Memorial Series',
    condition: 'Very Fine Mint Light Hinge',
    grade: 'Museum Gem',
    description: "Rare memorial issue overprinted 'SERVICE' for the Governor-General of India, world renowned rarity.",
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    provenance: 'Governor General Archives',
    postmark: 'Rashtrapati Bhavan 1948',
  },
  {
    id: '5',
    name: '1975 Royal Bengal Tiger Wildlife Series',
    year: 1975,
    issueYear: '1975',
    faceValue: '₹2.00',
    country: 'Republic of India',
    category: 'Wildlife Conservation',
    condition: 'Mint Sheetlet Corner',
    grade: 'Gem 98',
    description: 'Conservation commemorative celebrating Project Tiger and indigenous wildlife preservation in India.',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
    provenance: 'National Wildlife Federation',
    postmark: 'Jim Corbett National Park 1975',
  },
  {
    id: 'stamp-1',
    name: '1852 Scinde Dawk Scarlet Wafer',
    year: 1852,
    issueYear: '1852',
    faceValue: '½ Anna',
    country: 'India (Sindh Province)',
    category: 'Pre-Imperial India',
    condition: 'Fine Embossed Seal',
    grade: 'Rarity AAA',
    description: "Asia's first adhesive postage stamp, embossed into brittle red sealing wafers under Sir Bartle Frere.",
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    provenance: 'Ex-Ferrary Collection',
    postmark: 'Karachi B.P.O 1852',
  },
  {
    id: 'stamp-2',
    name: "1948 Mahatma Gandhi Memorial 10 Rs 'SERVICE'",
    year: 1948,
    issueYear: '1948',
    faceValue: '10 Rupees',
    country: 'Republic of India',
    category: 'Memorial Series',
    condition: 'Very Fine Mint Light Hinge',
    grade: 'Museum Gem',
    description: "Rare memorial issue overprinted 'SERVICE' for the Governor-General of India, world renowned rarity.",
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    provenance: 'Governor General Archives',
    postmark: 'Rashtrapati Bhavan 1948',
  },
  {
    id: 'stamp-3',
    name: '1854 Inverted Head Four Annas',
    year: 1854,
    issueYear: '1854',
    faceValue: '4 Annas',
    country: 'British India',
    category: 'Classic British India',
    condition: 'Good Used, Octagonal Cut',
    grade: 'World Rarity',
    description: "Famous lithographic error printed at Calcutta showing Queen Victoria's head inverted inside an octagonal frame.",
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    provenance: 'Royal Philatelic Society London Cert.',
    postmark: 'Diamond 1 Cooper Cancel',
  },
  {
    id: 'stamp-4',
    name: '1947 Ashoka Lion Capital (First Issue)',
    year: 1947,
    issueYear: '1947',
    faceValue: '1½ Annas',
    country: 'Dominion of India',
    category: 'Dominion of India',
    condition: 'Mint Never Hinged (MNH)',
    grade: 'Superb 95',
    description: 'Post-independence inaugural commemorative stamp depicting the Ashoka Lion Capital.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    provenance: 'Indian Security Press Nasik',
    postmark: 'New Delhi G.P.O 15-AUG-47',
  },
  {
    id: 'stamp-5',
    name: '1953 Conquest of Mount Everest Commemorative',
    year: 1953,
    issueYear: '1953',
    faceValue: '14 Annas',
    country: 'Republic of India',
    category: 'Republic of India',
    condition: 'Original Gum, Mint',
    grade: 'Extra Fine',
    description: 'Commemorating the historic first ascent of Mount Everest in 1953.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    provenance: 'Darjeeling Philatelic Bureau',
    postmark: 'Camp III Everest Base 1953',
  },
  {
    id: 'stamp-6',
    name: '1975 Royal Bengal Tiger Wildlife Series',
    year: 1975,
    issueYear: '1975',
    faceValue: '₹2.00',
    country: 'Republic of India',
    category: 'Modern Republic',
    condition: 'Mint Sheetlet Corner',
    grade: 'Gem 98',
    description: 'Conservation commemorative celebrating Project Tiger and indigenous wildlife preservation in India.',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
    provenance: 'National Wildlife Federation',
    postmark: 'Jim Corbett National Park 1975',
  },
];

export function extractId(target) {
  if (target == null) return '';
  if (typeof target === 'object' && target.id != null) {
    return String(target.id);
  }
  return String(target);
}

export function getWishlistItems() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const items = [];
    const seenIds = new Set();

    for (const entry of parsed) {
      if (!entry) continue;
      const id = extractId(entry);
      if (!id || seenIds.has(id)) continue;
      seenIds.add(id);

      if (typeof entry === 'object' && entry !== null && entry.name) {
        items.push({ ...entry, id });
      } else {
        const fallback = FALLBACK_STAMPS.find((f) => String(f.id) === id);
        if (fallback) {
          items.push({ ...fallback, id });
        } else {
          items.push({
            id,
            name: `Archival Specimen #${id.slice(0, 8)}`,
            year: 'Historical',
            country: 'India',
            category: 'National Archive',
          });
        }
      }
    }
    return items;
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
}

export function saveWishlistItems(items) {
  if (typeof window === 'undefined') return;
  try {
    const cleanItems = [];
    const seenIds = new Set();

    for (const item of items) {
      if (!item) continue;
      const id = extractId(item);
      if (!id || seenIds.has(id)) continue;
      seenIds.add(id);

      if (typeof item === 'object' && item !== null && item.name) {
        cleanItems.push({ ...item, id });
      } else {
        const fallback = FALLBACK_STAMPS.find((f) => String(f.id) === id);
        cleanItems.push(fallback ? { ...fallback, id } : { id });
      }
    }

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(cleanItems));
    window.dispatchEvent(new CustomEvent('philately_wishlist_updated', { detail: cleanItems }));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
}

export function getWishlistIds() {
  return getWishlistItems().map((item) => extractId(item));
}

export function saveWishlistIds(ids) {
  const currentItems = getWishlistItems();
  const newItems = (Array.isArray(ids) ? ids : []).map((id) => {
    const stringId = extractId(id);
    const existing = currentItems.find((item) => extractId(item) === stringId);
    if (existing) return existing;
    const fallback = FALLBACK_STAMPS.find((f) => String(f.id) === stringId);
    return fallback ? { ...fallback, id: stringId } : { id: stringId };
  });
  saveWishlistItems(newItems);
}

export function toggleWishlist(target) {
  const id = extractId(target);
  if (!id) return false;
  const current = getWishlistItems();
  const exists = current.some((item) => extractId(item) === id);
  let updated;

  if (exists) {
    updated = current.filter((item) => extractId(item) !== id);
  } else {
    if (typeof target === 'object' && target !== null && target.name) {
      updated = [...current, { ...target, id }];
    } else {
      const fallback = FALLBACK_STAMPS.find((f) => String(f.id) === id);
      updated = [...current, fallback ? { ...fallback, id } : { id }];
    }
  }

  saveWishlistItems(updated);
  return !exists;
}

export const toggleWishlistId = toggleWishlist;

export function isWishlistedId(target) {
  const id = extractId(target);
  if (!id) return false;
  return getWishlistIds().includes(id);
}

export function updateWishlistStampData(stamps) {
  if (!Array.isArray(stamps) || stamps.length === 0) return;
  const currentItems = getWishlistItems();
  let changed = false;

  const updatedItems = currentItems.map((item) => {
    const id = extractId(item);
    const liveStamp = stamps.find((s) => String(s.id) === id);
    if (liveStamp) {
      // If live stamp provides richer data or updates an ID-only placeholder
      changed = true;
      return { ...item, ...liveStamp, id };
    }
    return item;
  });

  if (changed) {
    saveWishlistItems(updatedItems);
  }
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState(getWishlistItems);

  useEffect(() => {
    const handleUpdate = () => {
      setWishlistItems(getWishlistItems());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('philately_wishlist_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('philately_wishlist_updated', handleUpdate);
    };
  }, []);

  const wishlistIds = wishlistItems.map((item) => extractId(item));

  return {
    wishlistStamps: wishlistItems,
    wishlistItems,
    wishlistIds,
    count: wishlistItems.length,
    isWishlisted: (target) => {
      const id = extractId(target);
      return id ? wishlistIds.includes(id) : false;
    },
    toggleWishlist: (target) => toggleWishlist(target),
    updateWishlistStampData,
  };
}
