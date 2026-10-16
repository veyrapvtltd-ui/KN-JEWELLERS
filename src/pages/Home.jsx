import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heic2any from 'heic2any';
import { 
  Menu, X, Phone, MapPin, Clock, 
  ShieldCheck, Heart, Award, Share2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { optimizeImageForStorage, fileToDataUrl } from '../lib/imageOptimizer';
import { getCurrentFestival, dispatchFestivalBroadcast, sendSystemNotification, broadcastNotificationToAll, INDIAN_FESTIVALS } from '../lib/festivalGreetings';
import { collection18kProducts, best18kSellers } from '../data/collection18k';

// Banners customized for SHREE ARADHNA JEWELLERS exact layout using Model Images
const bannerImages = [
  {
    desktopUrl: '/assets/hero_banner.jpg',
    mobileUrl: '/assets/hero_banner.jpg',
    line2: 'Exclusive Diamond & Heritage Gold Collection'
  }
];

// Product collections - Loaded from 18KT Plain Gold Master Collection
const bestSellerImages = best18kSellers;
const bangleImages = collection18kProducts.filter(p => p.subCategory === 'BANGLES');
const gentsBraceletImages = [];
const gentsChainsImages = collection18kProducts.filter(p => p.category === 'GENTS' && p.subCategory === 'CHAINS');
const gentsLocketImages = [];
const gentsRingImages = collection18kProducts.filter(p => p.category === 'GENTS' && p.subCategory === 'RINGS');
const ladiesBraceletImages = collection18kProducts.filter(p => p.category === 'LADIES' && p.subCategory === 'BRACELETS');
const ladiesRingImages = collection18kProducts.filter(p => p.category === 'LADIES' && p.subCategory === 'RINGS');
const longMangalsutraImages = [];
const shortMangalsutraImages = collection18kProducts.filter(p => p.subCategory === 'SHORT MANGALSUTRA');
const necklaceImages = collection18kProducts.filter(p => p.subCategory === 'NECKLACES');
const earringImages = collection18kProducts.filter(p => p.category === 'EARRINGS');
const weddingSetImages = [];
const silverImages = [];
const dailyWearTopsImages = collection18kProducts.filter(p => p.category === 'EARRINGS' && p.earringType === 'STUDS');
const jumkaImages = [];
const suiDhagaImages = [];
const baliImages = collection18kProducts.filter(p => p.category === 'EARRINGS' && p.earringType === 'HOOPS');
const buthiImages = [];
const kanchainImages = [];
const ringImages = collection18kProducts.filter(p => p.subCategory === 'RINGS');
const mangalsutraImages = collection18kProducts.filter(p => p.subCategory === 'SHORT MANGALSUTRA');

const allProducts = collection18kProducts;

const categories = ['ALL', 'RINGS', 'EARRINGS', 'LADIES', 'GENTS', 'WEDDING SET'];

// Sub-categories per main collection
const subCategories = {
  'ALL': ['ALL'],
  'RINGS': ['ALL', 'LADIES RINGS', 'GENTS RINGS'],
  'EARRINGS': ['ALL', 'DAILY WEAR TOPS', 'STUDS', 'HOOPS', 'FANCY'],
  'LADIES': ['ALL', 'RINGS', 'BANGLES', 'BRACELETS', 'SHORT MANGALSUTRA', 'NECKLACES', 'CHAINS'],
  'GENTS': ['ALL', 'RINGS', 'CHAINS'],
  'WEDDING SET': ['ALL']
};

// Earring types — shown when EARRINGS is selected
const earringSubTypes = ['ALL', 'DAILY WEAR TOPS', 'STUDS', 'HOOPS', 'FANCY'];

const marqueeCategories = [
  { name: 'WEDDING SET', label: 'WEDDING COLLECTION', img: '/assets/wedding_collection_banner.jpg' },
  { name: 'EARRINGS', label: 'EARRING COLLECTION', img: '/assets/earrings_collection_img.jpg' },
  { name: 'LADIES', label: 'LADIES COLLECTION', img: '/assets/ladies_collection_img.jpg' }
];

// Circular Category Definitions (Only 3 Collections: Wedding, Earrings, Ladies)
const circularCategories = [
  { label: 'WEDDING', letter: 'W', cat: 'WEDDING SET', sub: 'ALL' },
  { label: 'EARRINGS', letter: 'E', cat: 'EARRINGS', sub: 'ALL' },
  { label: 'BANGLES', letter: 'B', cat: 'LADIES', sub: 'BANGLES' },
  { label: 'RINGS', letter: 'R', cat: 'LADIES', sub: 'RINGS' },
  { label: 'MANGALSUTRA', letter: 'M', cat: 'LADIES', sub: 'SHORT MANGALSUTRA' },
  { label: 'BRACELETS', letter: 'B', cat: 'LADIES', sub: 'BRACELETS' },
  { label: 'ANKLETS', letter: 'A', cat: 'LADIES', sub: 'ALL' },
  { label: 'NECKLACES', letter: 'N', cat: 'LADIES', sub: 'NECKLACES' },
  { label: 'VIEW ALL', letter: 'V', cat: 'ALL', sub: 'ALL' }
];

// Helper for product weight (Disabled per request)
const getProductWeight = () => '';

// Consistent Simulated Pricing generator based on product ID
const getProductPricing = (product) => {
  let hash = 0;
  for (let i = 0; i < product.id.length; i++) {
    hash = product.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let basePrice = 28000;
  let discount = 15;
  
  if (product.category === 'SILVER COLLECTION') {
    basePrice = 1800 + (Math.abs(hash) % 4000);
    discount = 10 + (Math.abs(hash) % 4) * 10;
  } else if (product.category === 'WEDDING SET') {
    basePrice = 85000 + (Math.abs(hash) % 150000);
    discount = 15 + (Math.abs(hash) % 3) * 5;
  } else {
    if (product.subCategory === 'RINGS') {
      basePrice = 18000 + (Math.abs(hash) % 25000);
    } else if (product.subCategory === 'NECKLACES' || product.subCategory === 'LONG MANGALSUTRA') {
      basePrice = 65000 + (Math.abs(hash) % 120000);
    } else {
      basePrice = 25000 + (Math.abs(hash) % 60000);
    }
    discount = 15 + (Math.abs(hash) % 4) * 5;
  }
  
  const salePrice = Math.round(basePrice / 100) * 100 - 1;
  const originalPrice = Math.round((salePrice / (1 - discount / 100)) / 100) * 100;
  
  return {
    salePrice: salePrice.toLocaleString('en-IN'),
    originalPrice: originalPrice.toLocaleString('en-IN'),
    discount
  };
};

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [catSlideIndex, setCatSlideIndex] = useState(0);
  
  useEffect(() => {
    const handleViewportChange = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isPhonePortrait = width <= 768;
      const isPhoneLandscape = isTouch && height <= 550 && width <= 1024;
      setIsMobile(isPhonePortrait || isPhoneLandscape);
    };

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', handleViewportChange, { passive: true });
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
    };
  }, []);

  const nextCatSlide = () => {
    setCatSlideIndex((prev) => (prev + 1) % marqueeCategories.length);
  };
  const prevCatSlide = () => {
    setCatSlideIndex((prev) => (prev - 1 + marqueeCategories.length) % marqueeCategories.length);
  };
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubCategory, setActiveSubCategory] = useState('ALL');
  const [activeEarringType, setActiveEarringType] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(16);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxProduct, setLightboxProduct] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [isExportingZip, setIsExportingZip] = useState(false);
  
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosHelpOpen, setIsIosHelpOpen] = useState(false);
  const [showAppPopup, setShowAppPopup] = useState(false);
  const [activeFestival, setActiveFestival] = useState(null);
  const [isFestivalDismissed, setIsFestivalDismissed] = useState(false);

  // Automatic Indian Festival Detection & Greeting Broadcast
  useEffect(() => {
    const checkFestival = () => {
      const festivalData = getCurrentFestival();
      if (festivalData.isActive) {
        setActiveFestival(festivalData.festival);
        // Automatically broadcast greeting if auto-broadcast is enabled
        const autoEnabled = localStorage.getItem('SAJ_auto_festival_broadcast_disabled') !== 'true';
        if (autoEnabled) {
          dispatchFestivalBroadcast(festivalData.festival);
        }
      }
    };

    checkFestival();

    const handleFestBroadcastEvent = (e) => {
      if (e.detail) {
        setActiveFestival(e.detail);
        setIsFestivalDismissed(false);
      }
    };

    window.addEventListener('saj_festival_broadcast', handleFestBroadcastEvent);
    return () => window.removeEventListener('saj_festival_broadcast', handleFestBroadcastEvent);
  }, []);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('SAJ_app_popup_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowAppPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeAppPopup = () => {
    setShowAppPopup(false);
    sessionStorage.setItem('SAJ_app_popup_dismissed', 'true');
  };

  // Helper utility to convert VAPID public key string into Uint8Array format
  const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Push notification handler
  const saveSubscriptionToStorage = async (subscription) => {
    // Background push notifications disabled
  };

  const registerPushSubscription = async () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg.pushManager) {
          let subscription = await reg.pushManager.getSubscription();
          if (!subscription) {
            const applicationServerKey = urlB64ToUint8Array('BEXW6qmnlL19TYxTUbLNgawyJPLEe0dWursfi25_AxGvbBRu--RSdGIFU0OMfdd5mV5yOfSF19V7B0Jdwro497Y');
            subscription = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey
            });
          }
          if (subscription) {
            await saveSubscriptionToStorage(subscription);
          }
        }
      } catch (err) {
        console.warn('Push manager subscription failed:', err.message);
      }
    }
  };

  const [instaFeedUrl, setInstaFeedUrl] = useState('');
  const [instaPosts, setInstaPosts] = useState([]);

  useEffect(() => {
    const fetchInstaConfig = async () => {
      try {
        const settings = JSON.parse(localStorage.getItem('SAJ_store_settings') || '{}');
        if (settings.qr_code_url) {
          setInstaFeedUrl(settings.qr_code_url);
        }
      } catch (e) {
        console.warn("Instagram config bypassed:", e);
      }
    };
    fetchInstaConfig();
  }, []);

  const handleSendTestNotification = () => {
    sendSystemNotification(
      '👑 Shree Aradhna Jewellers',
      `✨ Notification Test: Today 22K Gold ₹${goldRates.gold22k}/g | Silver ₹${goldRates.silver}/g. Festive offers active in Gandhidham & Adipur showrooms!`
    );
  };

  const handleBroadcastToAll = async () => {
    await broadcastNotificationToAll(
      '👑 Shree Aradhna Jewellers',
      `📢 Showroom Alert to All: Today 22K Gold ₹${goldRates.gold22k}/g | Silver ₹${goldRates.silver}/g. Special festive offers active at Gandhidham & Adipur!`
    );
    alert('📢 Broadcast notification dispatched to all open devices, tabs, and notification centers!');
  };

  const handleBroadcastFestivalNow = async () => {
    const festData = getCurrentFestival();
    const fest = festData.isActive ? festData.festival : INDIAN_FESTIVALS.find(f => f.id === 'sharad_navratri');
    if (fest) {
      await dispatchFestivalBroadcast(fest, true);
      alert(`🎉 Festive message for "${fest.name}" broadcasted to all open devices, website tabs & notification trays!`);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          registerPushSubscription();
          sendSystemNotification(
            '👑 Shree Aradhna Jewellers',
            `🔔 Rate Alerts Enabled! Today 22K Gold: ₹${goldRates.gold22k}/g | Silver: ₹${goldRates.silver}/g. Gandhidham & Adipur showrooms.`
          );
        } else {
          alert('Notifications were blocked. Please enable notification permission in your browser/device settings to receive live rate updates.');
        }
      });
    } else {
      alert('Notifications are not supported on this browser.');
    }
  };

  // Auto-sync push subscription on mount for EVERY device where permission is granted, or auto-ask if default
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        registerPushSubscription();
      } else if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          requestNotificationPermission();
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    // Request notification permission right when they tap install
    requestNotificationPermission();

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User choice outcome: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      alert("To install: Tap the browser menu button (e.g. three dots in Chrome) and choose 'Add to Home Screen' or 'Install App'.");
    }
  };



  const [likedProducts, setLikedProducts] = useState({});
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [wishlistUser, setWishlistUser] = useState(() => localStorage.getItem('SAJ_wishlist_user') || null);
  const [isWishlistSignUp, setIsWishlistSignUp] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  // Sync Wishlist account state with local saving scheme session
  useEffect(() => {
    const syncUser = async () => {
      const uId = localStorage.getItem('userId');
      const wUser = localStorage.getItem('SAJ_wishlist_user');
      
      if (uId && !wUser) {
        try {
          const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
          const u = users.find(x => x.id === uId);
          if (u) {
            localStorage.setItem('SAJ_wishlist_user', u.email);
            setWishlistUser(u.email);
          }
        } catch (e) {
          console.error(e);
        }
      } else if (!uId && wUser) {
        localStorage.removeItem('SAJ_wishlist_user');
        setWishlistUser(null);
      }
    };
    syncUser();
  }, [isWishlistModalOpen]);

  const handleWishlistLogout = () => {
    localStorage.removeItem('SAJ_wishlist_user');
    localStorage.removeItem('userId');
    setWishlistUser(null);
  };

  const handleWishlistAuth = async (e) => {
    e.preventDefault();
    setWishlistLoading(true);
    setWishlistError(null);

    const elements = e.target.elements;
    const emailVal = elements.wishlistEmail.value;
    const passwordVal = elements.wishlistPassword.value;

    try {
      const users = JSON.parse(localStorage.getItem('SAJ_users') || '[]');
      if (isWishlistSignUp) {
        const nameVal = elements.wishlistName.value;
        const phoneVal = elements.wishlistPhone.value;

        if (users.some(u => u.email.toLowerCase() === emailVal.toLowerCase())) {
          throw new Error('Email already registered.');
        }

        const newUser = {
          id: 'user_' + Date.now(),
          email: emailVal.trim(),
          password: passwordVal,
          full_name: nameVal.trim(),
          phone_number: phoneVal.trim(),
          created_at: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('SAJ_users', JSON.stringify(users));
        localStorage.setItem('userId', newUser.id);
        localStorage.setItem('SAJ_wishlist_user', newUser.email);
        setWishlistUser(newUser.email);
        alert('Account created and synced successfully! You are now logged in.');
      } else {
        const found = users.find(u => u.email.toLowerCase() === emailVal.toLowerCase() && u.password === passwordVal);
        if (!found) {
          throw new Error('Invalid email or password');
        }

        localStorage.setItem('userId', found.id);
        localStorage.setItem('SAJ_wishlist_user', found.email);
        setWishlistUser(found.email);
        alert('Logged in and synced successfully!');
      }
    } catch (err) {
      setWishlistError(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Live Gold Rates & Admin Panel State
  const [goldRates, setGoldRates] = useState(() => {
    const saved = localStorage.getItem('SAJ_gold_rates');
    return saved ? { hide24k: true, ...JSON.parse(saved) } : {
      gold24k: 15500,
      gold22k: 14200,
      gold18k: 11625,
      silver: 98,
      hide24k: true,
      lastUpdated: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
      updatedAt: Date.now()
    };
  });

  const [showPwaNotification, setShowPwaNotification] = useState(false);
  const [pwaNotificationData, setPwaNotificationData] = useState({
    title: 'LIVE RATE ALERT',
    body: 'Gold rates updated! Check today\'s latest hallmarked rates.'
  });

  useEffect(() => {
    document.title = "Shree Aradhna Jewellers | Premium Gold & Silver Jewellery";
  }, []);

  // Listen for custom notifications triggered anywhere (Current Window, Cross-Tab BroadcastChannel, or Supabase Realtime)
  useEffect(() => {
    const handleNotificationPayload = (payload) => {
      if (!payload) return;
      const title = payload.title || '👑 SHREE ARADHNA JEWELLERS';
      const body = payload.body || 'Live updates from Shree Aradhna Jewellers';

      setPwaNotificationData({ title, body });
      setShowPwaNotification(true);
      setTimeout(() => setShowPwaNotification(false), 7000);

      // Trigger native notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
              reg.showNotification(title, {
                body,
                icon: '/assets/logo.png',
                badge: '/assets/logo.png',
                tag: `notif-${Date.now()}`
              });
            });
          } else {
            new Notification(title, {
              body,
              icon: '/assets/logo.png',
              badge: '/assets/logo.png',
              tag: `notif-${Date.now()}`
            });
          }
        } catch (e) {}
      }
    };

    // 1. Current Window Custom Event
    const handleCustomNotify = (e) => handleNotificationPayload(e.detail);
    window.addEventListener('saj_custom_notification', handleCustomNotify);

    // 2. Cross-Tab BroadcastChannel for all open tabs & PWA instances
    let bc = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('saj_notifications');
        bc.onmessage = (event) => handleNotificationPayload(event.data);
      }
    } catch (e) {}

    // 3. Supabase Realtime Channel
    let supabaseChannel = null;
    try {
      if (isSupabaseConfigured()) {
        supabaseChannel = supabase
          .channel('saj_public_broadcast')
          .on('broadcast', { event: 'new_notification' }, (payload) => {
            handleNotificationPayload(payload.payload);
          })
          .subscribe();
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('saj_custom_notification', handleCustomNotify);
      if (bc) bc.close();
      if (supabaseChannel) supabase.removeChannel(supabaseChannel);
    };
  }, []);

  // Real-time Rate Sync Across All Open Tabs & Windows (LocalStorage + BroadcastChannel)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'SAJ_gold_rates' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setGoldRates(prev => ({ ...prev, ...parsed }));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleRatesUpdatedEvent = (e) => {
      if (e.detail) {
        setGoldRates(prev => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('saj_rates_updated', handleRatesUpdatedEvent);

    let ratesBc = null;
    try {
      if ('BroadcastChannel' in window) {
        ratesBc = new BroadcastChannel('saj_rates_channel');
        ratesBc.onmessage = (event) => {
          if (event.data) {
            setGoldRates(prev => ({ ...prev, ...event.data }));
          }
        };
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('saj_rates_updated', handleRatesUpdatedEvent);
      if (ratesBc) ratesBc.close();
    };
  }, []);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone && goldRates.gold22k) {
      const timer = setTimeout(() => {
        setPwaNotificationData({
          title: '👑 LIVE RATE ALERT',
          body: `Gold rates updated! 22K: ₹${goldRates.gold22k}/g | Silver: ₹${goldRates.silver}/g.`
        });
        setShowPwaNotification(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [goldRates]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Rate Edit Form States
  const [temp24k, setTemp24k] = useState(goldRates.gold24k || 15500);
  const [temp22k, setTemp22k] = useState(goldRates.gold22k || 14000);
  const [temp18k, setTemp18k] = useState(goldRates.gold18k || 5740);
  const [tempSilver, setTempSilver] = useState(goldRates.silver || 235);
  const [tempHide24k, setTempHide24k] = useState(goldRates.hide24k !== false);

  // Product Upload States
  const [upTitle, setUpTitle] = useState('');
  const [upCategory, setUpCategory] = useState('LADIES');
  const [upSubCategory, setUpSubCategory] = useState('ALL');
  const [upEarringType, setUpEarringType] = useState('ALL');
  const [upWeight, setUpWeight] = useState('');
  const [upPurity, setUpPurity] = useState('');
  const [upImageFile, setUpImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileNameLower = (file.name || '').toLowerCase();
    const fileTypeLower = (file.type || '').toLowerCase();

    const isHeicOrHeif = fileNameLower.endsWith('.heic') || 
                         fileNameLower.endsWith('.heif') || 
                         fileNameLower.endsWith('.heics') || 
                         fileNameLower.endsWith('.heifs') || 
                         fileTypeLower.includes('heic') || 
                         fileTypeLower.includes('heif');

    if (isHeicOrHeif) {
      setIsConvertingHeic(true);
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.85
        });
        const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        const newFileName = file.name.replace(/\.(heic|heif|heics|heifs)$/i, '.jpg');
        const convertedFile = new File([resultBlob], newFileName, { type: 'image/jpeg' });
        setUpImageFile(convertedFile);
      } catch (err) {
        console.error("HEIC/HEIF conversion error:", err);
        alert("Could not convert HEIC/HEIF photo. Please select a JPG or PNG image.");
      } finally {
        setIsConvertingHeic(false);
      }
    } else {
      setUpImageFile(file);
    }
  };

  // Load public rates on startup
  useEffect(() => {
    const fetchRatesAndProducts = async () => {
      // 1. Fetch live rates from Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const { data: dbRates } = await supabase
            .from('saj_rates')
            .select('*')
            .eq('id', 1)
            .maybeSingle();

          if (dbRates) {
            setGoldRates(prev => ({ hide24k: true, ...prev, ...dbRates }));
            localStorage.setItem('SAJ_rates', JSON.stringify(dbRates));
          }
        } catch (err) {
          console.warn("Supabase rates fetch fallback:", err.message);
        }
      }

      // 2. Local storage / rates.json fallback
      try {
        const storedRates = localStorage.getItem('SAJ_rates');
        if (storedRates) {
          setGoldRates(prev => ({ hide24k: true, ...prev, ...JSON.parse(storedRates) }));
        } else {
          const res = await fetch('/assets/rates.json');
          if (res.ok) {
            const jsonRates = await res.json();
            setGoldRates(prev => ({ hide24k: true, ...prev, ...jsonRates }));
          }
        }
      } catch (e) {
        console.warn("Rates loading fallback:", e);
      }
      
      // 3. Products catalog state
      let productsList = [];
      if (isSupabaseConfigured()) {
        try {
          const { data: pData } = await supabase
            .from('saj_products')
            .select('*')
            .order('created_at', { ascending: false });
          if (pData && pData.length > 0) {
            productsList = pData.map(p => ({
              id: p.id,
              title: p.title,
              category: p.category,
              subCategory: p.subcategory || 'ALL',
              purity: p.description?.split('-')[0]?.trim() || '22K Hallmarked Gold',
              weight: p.weight || '',
              url: p.image || '/assets/logo.png',
              price: p.price
            }));
          }
        } catch (dbErr) {
          console.warn("Supabase products fetch fallback:", dbErr);
        }
      }

      if (productsList.length === 0) {
        try {
          productsList = JSON.parse(localStorage.getItem('SAJ_custom_products') || '[]');
        } catch {
          productsList = [];
        }
      }
      setDbProducts(productsList);
    };
    fetchRatesAndProducts();
  }, []);

  // Auto-advance banner carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance models slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        setLightboxProduct(product);
      }
    }
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };


  const toggleLike = (id) => {
    const isAdding = !likedProducts[id];
    setLikedProducts(prev => ({ ...prev, [id]: isAdding }));
    if (isAdding) {
      setIsWishlistModalOpen(true);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setActiveSubCategory('ALL');
    setActiveEarringType('ALL');
    const element = document.getElementById('showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubCategoryClick = (sub) => {
    setActiveSubCategory(sub);
    setActiveEarringType('ALL'); // reset earring type when changing sub-cat
  };

  const handleGoToMainAdmin = () => {
    window.location.href = '/admin';
  };

  // Admin login and update logic
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'arka@12';
    if (passcode === envPasscode || passcode === 'arka@12') {
      setIsAuthed(true);
      setErrorMsg('');
      setTemp24k(goldRates.gold24k || 15500);
      setTemp22k(goldRates.gold22k || 14000);
      setTemp18k(goldRates.gold18k || 5740);
      setTempSilver(goldRates.silver || 235);
      setTempHide24k(goldRates.hide24k !== false);
    } else {
      setErrorMsg('Invalid Passcode');
    }
  };

    const handleUploadProduct = async (e) => {
    e.preventDefault();
    if (!upImageFile) return alert("Please select an image");
    setIsUploading(true);

    try {
      // Step 1: Optimize and downscale image to prevent quota blowout
      const optimizedFile = await optimizeImageForStorage(upImageFile, 1200, 1200, 0.82);
      const fileExt = (optimizedFile.name || 'jpg').split('.').pop();
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      let finalImageUrl = null;

      // Step 2: Try uploading to Supabase Storage bucket 'product_images'
      if (isSupabaseConfigured()) {
        try {
          const { error: uploadErr } = await supabase.storage
            .from('product_images')
            .upload(fileName, optimizedFile, { cacheControl: '3600', upsert: true });

          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from('product_images').getPublicUrl(fileName);
            finalImageUrl = urlData?.publicUrl;

            // Also persist in Supabase saj_products table
            await supabase.from('saj_products').insert([{
              title: upTitle,
              category: upCategory,
              subcategory: upSubCategory,
              weight: upWeight,
              image: finalImageUrl,
              description: `${upPurity || '22K Gold'} - ${upEarringType || ''}`
            }]);
          }
        } catch (storageEx) {
          console.warn("Supabase product storage upload fallback:", storageEx.message);
        }
      }

      // Step 3: Fallback to compact Data URL for LocalStorage
      if (!finalImageUrl) {
        finalImageUrl = await fileToDataUrl(optimizedFile);
      }

      const finalProduct = {
        id: Date.now().toString(),
        title: upTitle,
        category: upCategory,
        subCategory: upSubCategory,
        earringType: upEarringType,
        purity: upPurity,
        weight: upWeight,
        url: finalImageUrl
      };

      // Save locally in localStorage
      try {
        const localCustoms = JSON.parse(localStorage.getItem('SAJ_custom_products') || '[]');
        localCustoms.unshift(finalProduct);
        localStorage.setItem('SAJ_custom_products', JSON.stringify(localCustoms));
      } catch (errLoc) {
        console.error("Local storage save error:", errLoc);
      }

      alert('Product uploaded successfully!');
      
      // Update state immediately
      setDbProducts(prev => [finalProduct, ...prev]);

      // Reset form
      setUpTitle('');
      setUpWeight('');
      setUpPurity('');
      setUpImageFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading product: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportProductsZip = async () => {
    setIsExportingZip(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const combinedExport = [...dbProducts, ...allProducts];
      zip.file('catalog_info.json', JSON.stringify(combinedExport, null, 2));
      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Shree_Aradhna_Jewellers_Products.zip';
      link.click();
      alert('Products ZIP Export Complete!');
    } catch (err) {
      console.error('ZIP Export Error:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleSaveRates = async (e) => {
    e.preventDefault();
    const now = new Date().toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
    const newRates = {
      ...goldRates,
      gold24k: Number(temp24k),
      gold22k: Number(temp22k),
      gold18k: Number(temp18k),
      silver: Number(tempSilver),
      hide24k: tempHide24k,
      lastUpdated: now
    };

    setGoldRates(newRates);
    localStorage.setItem('SAJ_gold_rates', JSON.stringify(newRates));

    const ratePayload = {
      gold24k: Number(temp24k),
      gold22k: Number(temp22k),
      gold18k: Number(temp18k),
      silver: Number(tempSilver),
      hide24k: tempHide24k
    };
    localStorage.setItem('SAJ_rates', JSON.stringify(ratePayload));

    // Broadcast updated rates to all open tabs immediately
    window.dispatchEvent(new CustomEvent('saj_rates_updated', { detail: ratePayload }));
    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('saj_rates_channel');
        bc.postMessage(ratePayload);
        bc.close();
      }
    } catch (e) {}

    let cloudSaved = false;
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('saj_rates').upsert({
          id: 1,
          gold24k: Number(temp24k),
          gold22k: Number(temp22k),
          gold18k: Number(temp18k),
          silver: Number(tempSilver),
          updated_at: new Date().toISOString()
        });
        if (!error) cloudSaved = true;
      } catch (err) {
        console.warn("Supabase rate save failed:", err.message);
      }
    }

    if (cloudSaved) {
      alert(`✅ Live Rates updated & saved to Supabase Cloud Database!\n\n• 22K Gold: ₹${temp22k}/g\n• Silver: ₹${tempSilver}/g\n\nSynced live across all devices and customers worldwide.`);
    } else {
      alert(`⚠️ Rates updated in Local Storage (Localhost Mode)!\n\n• 22K Gold: ₹${temp22k}/g\n• Silver: ₹${tempSilver}/g\n\n📌 Note: Supabase Cloud Database is not connected, so this is currently saved only on this machine.\nTo sync live across all customers' mobile phones and computers worldwide, connect your Supabase Cloud Database in Section 1.`);
    }
    setIsAdminOpen(false);
  };

  const handleAdminLogout = () => {
    setIsAuthed(false);
    setPasscode('');
    setErrorMsg('');
  };

  // Filter products based on selected main + sub + earring type
  const filteredProducts = (() => {
    const combinedProducts = [...dbProducts, ...allProducts];
    
    // Top-level ALL
    if (activeCategory === 'ALL') {
      if (activeSubCategory !== 'ALL') {
        return combinedProducts.filter(p => {
          const sub = (p.subCategory || p.sub_category || '').trim().toUpperCase();
          return sub === activeSubCategory;
        });
      }
      return combinedProducts;
    }

    // Direct RINGS collection tab
    if (activeCategory === 'RINGS') {
      let rings = combinedProducts.filter(p => {
        const sub = (p.subCategory || p.sub_category || '').trim().toUpperCase();
        return sub === 'RINGS' || (p.title || '').toUpperCase().includes('RING');
      });
      if (activeSubCategory === 'LADIES RINGS') {
        return rings.filter(p => p.category === 'LADIES');
      }
      if (activeSubCategory === 'GENTS RINGS') {
        return rings.filter(p => p.category === 'GENTS');
      }
      return rings;
    }

    // Direct EARRINGS collection tab
    if (activeCategory === 'EARRINGS') {
      let earrings = combinedProducts.filter(p => {
        return p.category === 'EARRINGS' || p.subCategory === 'EARRINGS' || (p.category === 'LADIES' && p.subCategory === 'EARRINGS');
      });
      if (activeSubCategory !== 'ALL') {
        earrings = earrings.filter(p => {
          const eType = (p.earringType || '').toUpperCase();
          const titleUpper = (p.title || '').toUpperCase();
          if (activeSubCategory === 'DAILY WEAR TOPS' || activeSubCategory === 'STUDS') {
            return eType === 'STUDS' || titleUpper.includes('STUD') || titleUpper.includes('TOPS');
          }
          if (activeSubCategory === 'HOOPS') {
            return eType === 'HOOPS' || titleUpper.includes('HOOP') || titleUpper.includes('BALI');
          }
          if (activeSubCategory === 'FANCY') {
            return eType === 'HOOPS' || titleUpper.includes('HUGGIE') || titleUpper.includes('FLORAL');
          }
          return eType === activeSubCategory;
        });
      }
      return earrings;
    }

    // Other categories: LADIES, GENTS, WEDDING SET
    let base = combinedProducts.filter(p => {
      return p.category === activeCategory;
    });

    if (activeSubCategory !== 'ALL') {
      base = base.filter(p => {
        let sub = (p.subCategory || p.sub_category || '').trim().toUpperCase();
        const titleUpper = (p.title || '').toUpperCase();
        if (titleUpper.includes('BANGLE') || titleUpper.includes('GBN') || titleUpper.includes('KADA')) {
          sub = 'BANGLES';
        } else if (titleUpper.includes('SHORT MANGALSUTRA') || titleUpper.includes('GMS')) {
          sub = 'SHORT MANGALSUTRA';
        } else if (titleUpper.includes('LONG MANGALSUTRA') || titleUpper.includes('GGT')) {
          sub = 'LONG MANGALSUTRA';
        } else if (titleUpper.includes('RING')) {
          sub = 'RINGS';
        } else if (titleUpper.includes('BRACELET')) {
          sub = 'BRACELETS';
        } else if (titleUpper.includes('CHAIN')) {
          sub = 'CHAINS';
        } else if (titleUpper.includes('NECKLACE') || titleUpper.includes('CHOKER') || titleUpper.includes('PENDANT')) {
          sub = 'NECKLACES';
        }
        return sub === activeSubCategory;
      });
    }

    return base;
  })();

  return (
    <div className="app-container">
      
      {/* Unified Sticky Header Stack: Live Rates Ticker -> Brand Navbar -> Festival Ribbon */}
      <div className="site-header-sticky-wrapper">
        {/* Animated Live Gold Rates Ticker Bar */}
        <div className="gold-ticker-bar">
          <div className="ticker-content-wrapper">
            <div className="ticker-items">
              <span className="ticker-live-dot">
                <span className="ping-dot"></span>
                LIVE RATE
              </span>
              <span className="ticker-item" style={{ fontWeight: 700, color: '#ffffff' }}>SHREE ARADHNA JEWELLERS:</span>

              {!goldRates.hide24k && goldRates.gold24k > 0 && (
                <>
                  <span className="ticker-item">24K GOLD: <strong>₹{goldRates.gold24k}/g</strong></span>
                  <span className="ticker-item-separator"> | </span>
                </>
              )}
              <span className="ticker-item">22K GOLD: <strong>₹{goldRates.gold22k}/g</strong></span>
              <span className="ticker-item-separator"> | </span>
              <span className="ticker-item">18K GOLD: <strong>₹{goldRates.gold18k}/g</strong></span>
              <span className="ticker-item-separator"> | </span>
              <span className="ticker-item">SILVER: <strong>₹{goldRates.silver}/g</strong></span>
              <span className="ticker-item-separator"> | </span>
              <span className="ticker-item" style={{ color: '#ffffff', fontWeight: 500, fontSize: '9px' }}>[UPDATED: {goldRates.lastUpdated}]</span>
              
              {/* Duplicated loop for infinite scrolling marquee */}
              <span className="ticker-item-separator" style={{ margin: '0 20px' }}> | </span>

              {!goldRates.hide24k && goldRates.gold24k > 0 && (
                <>
                  <span className="ticker-item">24K GOLD: <strong>₹{goldRates.gold24k}/g</strong></span>
                  <span className="ticker-item-separator"> | </span>
                </>
              )}
              <span className="ticker-item">22K GOLD: <strong>₹{goldRates.gold22k}/g</strong></span>
              <span className="ticker-item-separator"> | </span>
              <span className="ticker-item">18K GOLD: <strong>₹{goldRates.gold18k}/g</strong></span>
              <span className="ticker-item-separator"> | </span>
              <span className="ticker-item">SILVER: <strong>₹{goldRates.silver}/g</strong></span>
              <span className="ticker-item-separator"> | </span>
              <span className="ticker-item" style={{ color: '#ffffff', fontWeight: 500, fontSize: '9px' }}>[UPDATED: {goldRates.lastUpdated}]</span>
            </div>
          </div>
        </div>

        {/* 1. Header & Navigation */}
        <header className="header-main">
          <div className="nav-container">
            
            <a href="#" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/assets/logo.png" alt="SHREE ARADHNA JEWELLERS Logo" className="brand-logo-img" style={{ height: '42px', width: '42px', borderRadius: '8px', objectFit: 'contain' }} />
              <div className="brand-text-container">
                <h1 className="brand-name" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', fontFamily: 'inherit', color: 'inherit', display: 'inline' }}>SHREE ARADHNA JEWELLERS</h1>
                <span className="brand-subtitle">GANDHIDHAM & ADIPUR</span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              <a href="#" className="nav-link">HOME</a>
              <a href="#categories" className="nav-link">CATEGORIES</a>
              <a href="#showcase" className="nav-link">COLLECTIONS</a>
              <a href="#bestsellers" className="nav-link">BEST SELLERS</a>
              <a href="#contact" className="nav-link">CONTACT</a>
              
              {localStorage.getItem('userId') ? (
                <a href="/" onClick={(e) => { e.preventDefault(); localStorage.removeItem('userId'); window.location.href = '/'; }} className="nav-link">LOGOUT</a>
              ) : (
                <a href="/login" className="nav-link" style={{ color: 'var(--royal-gold)', fontWeight: 'bold' }}>LOGIN / REGISTER</a>
              )}
            </nav>

            {/* Call button */}
            <a href="tel:+919638888170" className="call-btn" title="Call Branch 1 (Gandhidham): 9638888170 | Branch 2 (Adipur): 7202921222">
              <Phone className="icon-sm" />
              <span>CALL NOW</span>
            </a>

            {/* Wishlist Header Button */}
            <button 
              onClick={() => setIsWishlistModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--peacock-green)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                padding: '6px',
                marginRight: '12px'
              }}
              aria-label="View Wishlist"
              className="header-wishlist-btn"
            >
              <Heart style={{ width: '20px', height: '20px', fill: Object.values(likedProducts).filter(Boolean).length > 0 ? 'var(--peacock-green)' : 'none' }} />
              {Object.values(likedProducts).filter(Boolean).length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--royal-gold)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  fontSize: '8px',
                  width: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700'
                }}>
                  {Object.values(likedProducts).filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="icon-md" /> : <Menu className="icon-md" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="mobile-nav">
              <a href="#" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">HOME</a>
              <a href="#categories" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">CATEGORIES</a>
              <a href="#showcase" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">COLLECTIONS</a>
              <a href="#bestsellers" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">BEST SELLERS</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">CONTACT</a>
              
              {localStorage.getItem('userId') ? (
                <a href="/" onClick={(e) => { e.preventDefault(); localStorage.removeItem('userId'); window.location.href = '/'; }} className="mobile-nav-link">LOGOUT</a>
              ) : (
                <a href="/login" className="mobile-nav-link">LOGIN / REGISTER</a>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <a href="tel:+919638888170" className="mobile-call-btn" style={{ justifyContent: 'center' }}>
                  <Phone className="icon-sm" />
                  <span>GANDHIDHAM: 9638888170</span>
                </a>
                <a href="tel:+917202921222" className="mobile-call-btn" style={{ justifyContent: 'center', background: '#ffffff', color: 'var(--peacock-green)', border: '1.5px solid var(--peacock-green)' }}>
                  <Phone className="icon-sm" />
                  <span>ADIPUR: 7202921222</span>
                </a>
              </div>
            </div>
          )}
        </header>

        {/* Automated Indian & Gujarati Festival Greeting Banner */}
        {activeFestival && !isFestivalDismissed && (
          <div 
            className="festival-greeting-bar"
            style={{
              background: 'linear-gradient(90deg, #7b1122 0%, #9c152b 25%, #b8860b 50%, #9c152b 75%, #7b1122 100%)',
              backgroundSize: '200% auto',
              color: '#ffffff',
              padding: isMobile ? '8px 36px 8px 12px' : '10px 48px 10px 20px',
              textAlign: 'center',
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: '600',
              letterSpacing: '0.4px',
              position: 'relative',
              zIndex: 998,
              boxShadow: '0 4px 15px rgba(123, 17, 34, 0.25)',
              borderBottom: '1px solid rgba(255, 215, 0, 0.35)',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            {isMobile ? (
              /* Mobile Layout (Clean Vertical Proportion with Gujarati Focus) */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' }}>{activeFestival.icon}</span>
                  <span style={{ color: '#ffd700', fontWeight: '800', letterSpacing: '0.5px' }}>
                    {activeFestival.nameGujarati ? activeFestival.nameGujarati : activeFestival.name}
                  </span>
                  <span style={{ 
                    background: 'rgba(255, 215, 0, 0.2)', 
                    border: '1px solid rgba(255, 215, 0, 0.4)', 
                    color: '#ffeaa7', 
                    fontSize: '9px', 
                    padding: '1px 6px', 
                    borderRadius: '10px',
                    fontWeight: '700'
                  }}>
                    શુભ પર્વ
                  </span>
                </div>
                <div style={{ color: '#ffffff', fontSize: '10.5px', lineHeight: '1.35', opacity: 0.95 }}>
                  {activeFestival.greetingGujarati || activeFestival.greeting}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ color: '#ffeaa7', fontSize: '10px', fontStyle: 'italic' }}>
                    • {activeFestival.offer}
                  </span>
                  <a 
                    href="#showcase" 
                    onClick={() => handleCategoryClick('WEDDING SET')}
                    style={{
                      padding: '3px 10px',
                      background: '#ffd700',
                      color: '#7b1122',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.4px',
                      display: 'inline-block',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Explore Collection →
                  </a>
                  <button
                    type="button"
                    onClick={handleBroadcastFestivalNow}
                    style={{
                      padding: '3px 8px',
                      background: 'rgba(255, 215, 0, 0.25)',
                      border: '1px solid #ffd700',
                      color: '#ffd700',
                      borderRadius: '16px',
                      fontSize: '9.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📢 Broadcast
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop Layout */
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' }}>{activeFestival.icon}</span>
                <span style={{ color: '#ffd700', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  {activeFestival.nameGujarati ? `${activeFestival.nameGujarati} (${activeFestival.name}):` : `${activeFestival.name}:`}
                </span>
                <span style={{ color: '#ffffff' }}>{activeFestival.greetingGujarati || activeFestival.greeting}</span>
                <span style={{ color: '#ffeaa7', fontSize: '12px', fontStyle: 'italic' }}>
                  • {activeFestival.offer}
                </span>
                <a 
                  href="#showcase" 
                  onClick={() => handleCategoryClick('WEDDING SET')}
                  style={{
                    marginLeft: '8px',
                    padding: '4px 12px',
                    background: '#ffd700',
                    color: '#7b1122',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  Explore Festive Collection →
                </a>
                <button
                  type="button"
                  onClick={handleBroadcastFestivalNow}
                  style={{
                    marginLeft: '6px',
                    padding: '4px 12px',
                    background: 'rgba(255, 215, 0, 0.25)',
                    border: '1px solid #ffd700',
                    color: '#ffd700',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Broadcast this festive message to all open devices and tabs"
                >
                  📢 Broadcast Message
                </button>
              </div>
            )}

            {/* Dismiss button neatly positioned in top-right corner, NEVER overlapping text */}
            <button 
              onClick={() => setIsFestivalDismissed(true)}
              aria-label="Dismiss greeting"
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 215, 0, 0.35)',
                color: '#ffd700',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '700',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: '8px',
                top: isMobile ? '8px' : '50%',
                transform: isMobile ? 'none' : 'translateY(-50%)',
                padding: 0
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. Hero Banner Slider Carousel */}
      <section className="hero-section">
        {bannerImages.map((banner, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
          >
            <a href="#contact" style={{ display: 'block', width: '100%', height: 'auto', textDecoration: 'none' }} title="Visit Showroom - Shree Aradhna Jewellers">
              <img 
                src={banner.desktopUrl} 
                alt={banner.line2}
                className="hero-banner-full"
                loading="eager"
              />
            </a>
          </div>
        ))}

        {/* Carousel Indicators */}
        {bannerImages.length > 1 && (
          <div className="carousel-indicators">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`indicator-dot ${index === activeSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {bannerImages.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="carousel-nav-btn prev"
              aria-label="Previous slide"
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', border: '1px solid #c5c2ba' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }} fill="none" stroke="var(--peacock-green)" strokeWidth="1.5">
                <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                <circle cx="12" cy="12" r="2.5" fill="var(--peacock-green)" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="carousel-nav-btn next"
              aria-label="Next slide"
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', border: '1px solid #c5c2ba' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }} fill="none" stroke="var(--peacock-green)" strokeWidth="1.5">
                <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                <circle cx="12" cy="12" r="2.5" fill="var(--peacock-green)" />
              </svg>
            </button>
          </>
        )}


      </section>

      {/* Live Jewel Rates Card */}
      <section className="live-rates-card-section" style={{ background: '#fcfaf8', padding: '40px 20px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          border: '1px solid rgba(123, 17, 34, 0.2)',
          padding: '32px',
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: 'var(--text-dark)',
            margin: '0 0 24px 0',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span className="ping-dot" style={{ position: 'relative', top: '0', transform: 'none' }}></span>
            TODAY'S LIVE RATES
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px'
          }}>
            {/* 24K Gold */}
            {!goldRates.hide24k && goldRates.gold24k > 0 && (
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(123, 17, 34, 0.25)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '700', letterSpacing: '1px', textAlign: 'center', marginBottom: '12px' }}>24K GOLD <span style={{fontSize: '10px', fontWeight: '500', opacity: 0.8}}>(99.9%)</span></div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--royal-gold)', textAlign: 'center', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  ₹{goldRates.gold24k} <span style={{fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)'}}>/ gm</span>
                </div>
              </div>
            )}
            
            {/* 22K Gold */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(123, 17, 34, 0.25)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '700', letterSpacing: '1px', textAlign: 'center', marginBottom: '12px' }}>22K GOLD <span style={{fontSize: '10px', fontWeight: '500', opacity: 0.8}}>(91.6%)</span></div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--royal-gold)', textAlign: 'center', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                ₹{goldRates.gold22k} <span style={{fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)'}}>/ gm</span>
              </div>
            </div>
            
            {/* Silver */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(123, 17, 34, 0.25)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '700', letterSpacing: '1px', textAlign: 'center', marginBottom: '12px' }}>SILVER</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#6b7280', textAlign: 'center', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                ₹{goldRates.silver} <span style={{fontSize: '13px', fontWeight: '500', color: 'var(--text-gray)'}}>/ gm</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', fontSize: '10px', color: 'var(--text-gray)', fontWeight: '500' }}>
            LAST UPDATED: {goldRates.lastUpdated}
          </div>
        </div>
      </section>

      {/* 4. Shop By Category (Sliding Carousel Style) */}
      <section id="categories" className="categories-section" style={{ background: '#fff', padding: '60px 0 40px', overflow: 'hidden' }}>
        <div className="section-inner" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 className="section-pretitle">SHOP BY CATEGORY</h2>
            <h3 className="section-title">The collection everyone is talking about</h3>
            <div className="title-divider" style={{ margin: '15px auto 0' }} />
          </div>

          <div className="category-slider-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '100%', overflow: 'hidden', padding: isMobile ? '0 10px' : '0' }}>
            
            {/* Left Control Arrow */}
            {isMobile && (
              <button 
                onClick={prevCatSlide}
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: '#ffffff',
                  border: '1px solid rgba(123, 17, 34, 0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  color: 'var(--peacock-green)'
                }}
                aria-label="Previous category"
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            {/* Slide Container Viewport */}
            <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <div 
                style={{
                  display: 'flex',
                  transition: 'transform 0.4s ease-in-out',
                  transform: `translateX(-${catSlideIndex * (isMobile ? 86 : 0)}%)`,
                  gap: '20px'
                }}
              >
                {marqueeCategories.map((mCat) => (
                  <div 
                    key={mCat.name} 
                    onClick={() => handleCategoryClick(mCat.name)}
                    style={{
                      flex: isMobile ? '0 0 84%' : '0 0 calc(33.333% - 14px)',
                      background: '#ffffff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(123, 17, 34, 0.15)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      paddingBottom: '16px',
                      transition: 'transform 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    className="category-card-slide"
                  >
                    <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={mCat.img} alt={mCat.label} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                        className="cat-slide-img"
                      />
                      {mCat.name === 'WEDDING SET' && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'linear-gradient(135deg, #7b1122, #580a17)',
                          color: '#ffffff',
                          fontSize: '9px',
                          fontWeight: '800',
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          boxShadow: '0 4px 12px rgba(123, 17, 34, 0.5)',
                          fontFamily: 'var(--font-sans)',
                          animation: 'pulse-badge 2s ease-in-out infinite'
                        }}>
                          ✨ Available
                        </div>
                      )}
                    </div>
                    <h4 style={{ 
                      margin: '12px 0 0', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      letterSpacing: '1px', 
                      color: 'var(--text-dark)', 
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-sans)'
                    }}>
                      {mCat.label}
                    </h4>
                    {mCat.name === 'WEDDING SET' && (
                      <p style={{
                        margin: '4px 0 0',
                        fontSize: '9px',
                        color: 'var(--royal-gold)',
                        fontWeight: '600',
                        fontFamily: 'var(--font-sans)',
                        letterSpacing: '0.5px'
                      }}>
                        New Collection In Stock
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Control Arrow */}
            {isMobile && (
              <button 
                onClick={nextCatSlide}
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: '#ffffff',
                  border: '1px solid rgba(123, 17, 34, 0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  color: 'var(--peacock-green)'
                }}
                aria-label="Next category"
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            {/* Mobile Slide Indicator Dots for the 3 Collections */}
            {isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', width: '100%' }}>
                {marqueeCategories.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCatSlideIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    style={{
                      width: catSlideIndex === dotIdx ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: catSlideIndex === dotIdx ? 'var(--royal-gold)' : 'rgba(123, 17, 34, 0.2)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 5. Interactive Jewelry Showcase & Category Filters */}
      <section id="showcase" className="showcase-section">
        <div className="section-inner">
          
          <div className="section-header">
            <h2 className="section-pretitle">SHOP BY COLLECTION</h2>
            <h3 className="section-title">Explore our diverse selections</h3>
            <p className="section-header-sub">BIS Hallmarked â€¢ Custom Handcrafted Designs</p>
            <div className="title-divider" />
          </div>

          {/* Main Collection Tabs (GIVA-Style Premium Menu Links) */}
          <div className="tabs-scroll-container hide-scrollbar" style={{ borderBottom: '1px solid rgba(123, 17, 34, 0.15)', paddingBottom: '0', marginBottom: '20px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSubCategory('ALL'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeCategory === cat ? '2.5px solid var(--peacock-green)' : '2.5px solid transparent',
                  color: activeCategory === cat ? 'var(--peacock-green)' : '#8c8c8c',
                  padding: '8px 4px 10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '1.2px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  borderRadius: 0
                }}
                className="main-nav-tab"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub-Category Tabs (GIVA-Style Elegant Horizontal Pill Row) */}
          {activeCategory !== 'ALL' && subCategories[activeCategory] && subCategories[activeCategory].length > 1 && (
            <div className="pills-scroll-container hide-scrollbar">
              {subCategories[activeCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubCategoryClick(sub)}
                  style={{
                    background: activeSubCategory === sub ? 'var(--peacock-green)' : '#ffffff',
                    color: activeSubCategory === sub ? '#ffffff' : '#4a4a4a',
                    border: activeSubCategory === sub ? '1px solid var(--peacock-green)' : '1px solid #e0e0e0',
                    padding: '7px 16px',
                    borderRadius: '24px',
                    fontSize: '10px',
                    fontWeight: activeSubCategory === sub ? '700' : '500',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.6px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    boxShadow: activeSubCategory === sub ? '0 2px 6px rgba(123, 17, 34, 0.25)' : '0 2px 4px rgba(0, 0, 0, 0.03)'
                  }}
                  className="sub-nav-pill"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Earring Type Tabs (3rd level, GIVA-Style elegant tiny secondary pills) */}
          {activeCategory === 'LADIES' && activeSubCategory === 'EARRINGS' && (
            <div className="pills-scroll-container hide-scrollbar" style={{ paddingBottom: '16px', gap: '6px' }}>
              {earringSubTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => { setActiveEarringType(type); setVisibleCount(16); }}
                  style={{
                    background: activeEarringType === type ? 'var(--peacock-green)' : '#ffffff',
                    color: activeEarringType === type ? '#ffffff' : '#555555',
                    border: activeEarringType === type ? '1px solid var(--peacock-green)' : '1px solid #e5e5e5',
                    padding: '5px 12px',
                    borderRadius: '24px',
                    fontSize: '9px',
                    fontWeight: activeEarringType === type ? '700' : '500',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    boxShadow: activeEarringType === type ? '0 2px 5px rgba(123, 17, 34, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
                  }}
                  className="sub-nav-pill"
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid Showcase */}
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const pricing = getProductPricing(product);
              const genderLabel = 
                product.category === 'LADIES' ? 'Women' : 
                product.category === 'GENTS' ? 'Men' : 
                product.category === 'WEDDING SET' ? 'Wedding Special' : 'Silver Collection';
              
              return (
                <div 
                  key={product.id}
                  className="product-card"
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Product Image Frame */}
                  <div className="product-image-outer" style={{ position: 'relative' }}>
                    <div className="product-image-inner" onClick={() => setLightboxProduct(product)} style={{ cursor: 'pointer', position: 'relative' }}>
                      <img 
                        src={product.url} alt={product.title} className="product-image"
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                      />
                      
                      {/* Corner Wishlist Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                        className={`wishlist-btn ${likedProducts[product.id] ? 'liked' : ''}`}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          zIndex: 5,
                          background: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
                          cursor: 'pointer',
                          color: likedProducts[product.id] ? '#ff4b4b' : '#888',
                          transition: 'all 0.2s ease'
                        }}
                        aria-label="Add to wishlist"
                      >
                        <Heart className="icon-sm" style={{ width: '15px', height: '15px', fill: likedProducts[product.id] ? '#ff4b4b' : 'none' }} />
                      </button>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', textAlign: 'center' }}>
                    <p style={{ 
                      margin: '0 0 8px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1a1a1a', 
                      lineHeight: 1.4, 
                      overflow: 'hidden', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical',
                      minHeight: '36px',
                      textAlign: 'center'
                    }}>
                      {product.title}
                    </p>
                    
                    {product.purity && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#b8860b',
                          background: 'rgba(218, 165, 32, 0.08)',
                          border: '1px solid rgba(218, 165, 32, 0.3)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          letterSpacing: '0.4px',
                          textTransform: 'uppercase'
                        }}>
                          ✨ {product.purity}
                        </span>
                      </div>
                    )}

                    {/* Actions Row */}
                    <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: 'auto' }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigator.clipboard.writeText(`https://www.shreearadhnajewellers.com/?product=${product.id}`);
                          alert("Product link copied to clipboard!");
                        }}
                        style={{
                          background: '#fff', border: '1px solid var(--royal-gold)', color: 'var(--royal-gold)',
                          borderRadius: '6px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Copy Share Link"
                      >
                        <Share2 size={16} />
                      </button>
                      <a
                        href={`https://wa.me/919638888170?text=Hello%20SHREE%20ARADHNA%20Jewellers,%20I%20am%20interested%20in%20buying%20your%20${encodeURIComponent(product.title)}.%0A%0AProduct%20Link:%20https://www.shreearadhnajewellers.com/?product=${product.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          background: 'var(--royal-gold)',
                          color: '#ffffff',
                          fontWeight: '700',
                          fontSize: '11px',
                          letterSpacing: '1px',
                          padding: '10px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          transition: 'background 0.2s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        className="card-inquiry-btn"
                      >
                        INQUIRE
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeCategory === 'WEDDING SET' && (
            <div 
              className="wedding-showcase-card"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #faf5f5 100%)',
                border: '1.5px solid rgba(123, 17, 34, 0.2)',
                borderRadius: '20px',
                boxShadow: '0 8px 30px rgba(123, 17, 34, 0.08)',
                margin: '20px 0 30px',
                padding: isMobile ? '12px' : '18px',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(320px, 46%) 1fr',
                gap: isMobile ? '16px' : '28px',
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Image banner - Framed with Elegant Border Space */}
              <div style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                background: '#4a0b14', 
                width: '100%', 
                minHeight: isMobile ? '360px' : '490px',
                height: '100%',
                display: 'flex',
                borderRadius: '14px',
                border: '1.5px solid rgba(212, 175, 55, 0.35)',
                boxShadow: '0 8px 24px rgba(74, 11, 20, 0.22)'
              }}>
                <img 
                  src="/assets/wedding_collection_banner.jpg" 
                  alt="Royal Wedding Collection - Shree Aradhna Jewellers" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 62%',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(123, 17, 34, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '18px',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 2
                }}>
                  <span>👑</span>
                  <span>BRIDAL SPECIAL COLLECTION</span>
                </div>
              </div>

              {/* Details & CTA */}
              <div style={{ padding: isMobile ? '6px 4px 12px' : '12px 16px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{
                  background: 'var(--royal-gold)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '800',
                  letterSpacing: '1.5px',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '12px',
                  alignSelf: 'flex-start'
                }}>
                  ✨ BRIDAL MASTERPIECE
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? '22px' : '28px',
                  color: 'var(--peacock-green)',
                  margin: '0 0 12px',
                  fontWeight: '700',
                  letterSpacing: '0.8px',
                  lineHeight: '1.2'
                }}>
                  Royal Wedding Collection
                </h3>
                <p style={{
                  fontSize: isMobile ? '12.5px' : '13.5px',
                  lineHeight: '1.65',
                  color: 'var(--text-muted)',
                  margin: '0 0 18px'
                }}>
                  Exquisite handcrafted bridal jewellery in pure BIS 916 hallmarked gold, enriched with certified ruby stones, pearls, and matching chandelier earrings. Tailored bespoke sets crafted to order for your special day.
                </p>

                {/* Features Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '0 0 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#b8860b' }}>
                    <span style={{ fontSize: '14px' }}>👑</span>
                    <span>Complete Bridal Set (Heritage Necklace + Chandelier Earrings)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--peacock-green)' }}>
                    <span style={{ fontSize: '14px' }}>✓</span>
                    <span>100% Certified BIS 916 Hallmarked Pure Gold</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '14px' }}>💎</span>
                    <span>Natural Ruby Stones, Emerald Center & Seed Pearls</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <a 
                    href="https://wa.me/919638888170?text=Hello%20SHREE%20ARADHNA%20Jewellers,%20I%20am%20interested%20in%20the%20Royal%20Wedding%20Collection%20sets." 
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      background: 'var(--royal-gold)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: isMobile ? '10px 18px' : '12px 24px',
                      borderRadius: '30px',
                      fontSize: isMobile ? '10px' : '11px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(123, 17, 34, 0.25)'
                    }}
                  >
                    💬 BOOK BRIDAL CONSULTATION
                  </a>
                  <a 
                    href="#contact"
                    style={{
                      background: '#ffffff',
                      color: 'var(--peacock-green)',
                      border: '1.5px solid var(--peacock-green)',
                      textDecoration: 'none',
                      padding: isMobile ? '10px 18px' : '12px 24px',
                      borderRadius: '30px',
                      fontSize: isMobile ? '10px' : '11px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    📍 VISIT SHOWROOM
                  </a>
                </div>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 && activeCategory !== 'WEDDING SET' && (
            <div className="custom-order-box">
              <span className="custom-order-title">
                BESPOKE HANDCRAFTED DESIGNS
              </span>
              <p className="custom-order-desc">
                We craft bespoke handcrafted pieces matching your exact specifications for {activeSubCategory !== 'ALL' ? activeSubCategory : activeCategory}. Please contact our Gandhidham or Adipur showrooms on WhatsApp to design your dream piece.
              </p>
              <a 
                href="https://wa.me/919638888170?text=Hello%20SHREE%20ARADHNA%20Jewellers,%20I%20want%20to%20place%20a%20custom%20order." 
                target="_blank"
                rel="noreferrer"
                className="custom-order-link"
              >
                TALK TO DESIGNER →
              </a>
            </div>
          )}

        </div>
      </section>



      {/* 6. Best Sellers Gallery Horizontal Marquee Strip */}
      {bestSellerImages && bestSellerImages.length > 0 && (
      <section id="bestsellers" className="models-marquee-section">
        <div className="section-inner" style={{ maxWidth: '100%', padding: '0 0' }}>
          
          <div className="section-header">
            <h3 className="section-title">BEST SELLERS</h3>
            <div className="title-divider" />
          </div>

          <div className="models-marquee-container">
            <div className="models-marquee-row">
              {/* Duplicate the best sellers list twice for a seamless infinite loop */}
              {[...bestSellerImages, ...bestSellerImages].map((item, index) => (
                <div key={index} className="model-marquee-card">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="model-marquee-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 7. Showroom Location & Contact */}
      <section id="contact" className="contact-section">
        <div className="section-inner">
          <div className="contact-grid">
            
            {/* Showroom info & Details */}
            <div className="contact-info-block">
              <h2 className="section-pretitle">VISIT OUR SHOWROOMS</h2>
              <h3 className="showroom-title">SHREE ARADHNA JEWELLERS</h3>
              <p className="showroom-desc">
                Step into a world of pure heritage gold, hallmarked jewellery, and timeless artistry. Visit either of our 2 prestigious showrooms located in Gandhidham and Adipur, Gujarat.
              </p>

              <div className="info-cards-stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Branch 1: Gandhidham */}
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid rgba(123, 17, 34, 0.18)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(123, 17, 34, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{
                      background: 'var(--royal-gold)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '1px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      textTransform: 'uppercase'
                    }}>BRANCH 1 · GANDHIDHAM</span>
                    <span style={{ fontSize: '11px', color: '#7b1122', fontWeight: '700' }}>⭐ GOLD SOUK</span>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--peacock-green)', margin: '0 0 10px', fontWeight: '700' }}>
                    Gandhidham Showroom
                  </h4>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <MapPin className="icon-sm" style={{ color: 'var(--royal-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-dark)' }}>
                        PLOT NO = 244, SHOP NO. 2 , GOLD SOUK SECTOR 1 A, 246, MAIN BAZAR, near SWAGAT RESTAURANT, Ward 12B, Gandhidham, Gujarat 370201
                      </p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=Gold+Souk+Sector+1A+Gandhidham+Gujarat+370201" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="whatsapp-link" 
                        style={{ marginTop: '6px', fontSize: '11px', display: 'inline-block' }}
                      >
                        VIEW ON GOOGLE MAPS &rarr;
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <Clock className="icon-sm" style={{ color: 'var(--royal-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                      Open Daily: 10:30 AM to 08:30 PM
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(123, 17, 34, 0.08)' }}>
                    <a 
                      href="tel:+919638888170" 
                      style={{
                        flex: '1 1 auto',
                        background: 'var(--royal-gold)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={14} /> CALL: 9638888170
                    </a>
                    <a 
                      href="https://wa.me/919638888170?text=Hello%20SHREE%20ARADHNA%20Jewellers%20(Gandhidham%20Branch),%20I%20have%20an%20inquiry." 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        flex: '1 1 auto',
                        background: '#ffffff',
                        border: '1.5px solid var(--peacock-green)',
                        color: 'var(--peacock-green)',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      💬 WHATSAPP
                    </a>
                    <a 
                      href="https://www.instagram.com/shree_aradhana_jewellers?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw==" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        width: '100%',
                        background: 'rgba(123, 17, 34, 0.05)',
                        border: '1px solid rgba(123, 17, 34, 0.15)',
                        color: 'var(--peacock-green)',
                        textDecoration: 'none',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      📸 @shree_aradhana_jewellers
                    </a>
                  </div>
                </div>

                {/* Branch 2: Adipur */}
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid rgba(123, 17, 34, 0.18)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(123, 17, 34, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{
                      background: 'var(--royal-gold)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '1px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      textTransform: 'uppercase'
                    }}>BRANCH 2 · ADIPUR</span>
                    <span style={{ fontSize: '11px', color: '#7b1122', fontWeight: '700' }}>⭐ MADANSHI CHOWK</span>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--peacock-green)', margin: '0 0 10px', fontWeight: '700' }}>
                    Adipur Showroom
                  </h4>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <MapPin className="icon-sm" style={{ color: 'var(--royal-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-dark)' }}>
                        SEZ-23/24, Madanshi Chowk, Adipur, Kutch, Gujarat
                      </p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=Madanshi+Chowk+Adipur+Kutch+Gujarat" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="whatsapp-link" 
                        style={{ marginTop: '6px', fontSize: '11px', display: 'inline-block' }}
                      >
                        VIEW ON GOOGLE MAPS &rarr;
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <Clock className="icon-sm" style={{ color: 'var(--royal-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                      Open Daily: 10:30 AM to 08:30 PM
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(123, 17, 34, 0.08)' }}>
                    <a 
                      href="tel:+917202921222" 
                      style={{
                        flex: '1 1 auto',
                        background: 'var(--royal-gold)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={14} /> CALL: 7202921222
                    </a>
                    <a 
                      href="https://wa.me/917202921222?text=Hello%20SHREE%20ARADHNA%20Jewellers%20(Adipur%20Branch),%20I%20have%20an%20inquiry." 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        flex: '1 1 auto',
                        background: '#ffffff',
                        border: '1.5px solid var(--peacock-green)',
                        color: 'var(--peacock-green)',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      💬 WHATSAPP
                    </a>
                    <a 
                      href="https://www.instagram.com/aradhanagoldhouse?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        width: '100%',
                        background: 'rgba(123, 17, 34, 0.05)',
                        border: '1px solid rgba(123, 17, 34, 0.15)',
                        color: 'var(--peacock-green)',
                        textDecoration: 'none',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      📸 @aradhanagoldhouse
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="contact-form-block">
              <h4 className="form-card-title">Book an Appointment</h4>
              <p className="form-card-subtitle">
                Fill the form below to receive a personalized bridal collection catalog or schedule a virtual preview call.
              </p>
              
              <form onSubmit={async (e) => { 
                e.preventDefault(); 
                const formData = new FormData(e.target);
                const branchVal = formData.get('branch') || 'Gandhidham Branch';
                const inquiry = {
                  id: Date.now(),
                  name: formData.get('name'),
                  phone: formData.get('phone'),
                  branch: branchVal,
                  category: formData.get('category'),
                  message: formData.get('message'),
                  date: new Date().toLocaleString()
                };

                if (isSupabaseConfigured()) {
                  try {
                    await supabase.from('inquiries').insert([{
                      name: formData.get('name'),
                      phone: formData.get('phone'),
                      branch: branchVal,
                      notes: formData.get('message'),
                      inquiry_type: formData.get('category') || 'Appointment'
                    }]);
                  } catch (err) {
                    console.warn("Supabase inquiry save fallback:", err.message);
                  }
                }

                const existing = JSON.parse(localStorage.getItem('SAJ_inquiries') || '[]');
                localStorage.setItem('SAJ_inquiries', JSON.stringify([inquiry, ...existing]));
                alert(`Thank you! Our ${branchVal} representative will reach out to you shortly.`); 
                e.target.reset();
              }} className="contact-form">
                <div className="form-group">
                  <label className="input-label">Select Preferred Showroom</label>
                  <select name="branch" className="form-select" required>
                    <option value="Gandhidham Branch (Gold Souk)">Branch 1: Gandhidham (Gold Souk)</option>
                    <option value="Adipur Branch (Madanshi Chowk)">Branch 2: Adipur (Madanshi Chowk)</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="input-label">Your Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      className="form-input"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Your Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      className="form-input"
                      placeholder="e.g. +91 99999 99999"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Interested Category</label>
                  <select name="category" className="form-select">
                    <optgroup label="Gents Collection">
                      <option>Gents - Rings</option>
                      <option>Gents - Chains</option>
                      <option>Gents - Bracelets</option>
                      <option>Gents - Lockets</option>
                    </optgroup>
                    <optgroup label="Ladies Collection">
                      <option>Ladies - Bangles</option>
                      <option>Ladies - Short Mangalsutra</option>
                      <option>Ladies - Long Mangalsutra</option>
                      <option>Ladies - Rings</option>
                      <option>Ladies - Necklaces</option>
                      <option>Ladies - Bracelets</option>
                      <option>Ladies Earrings - Daily Wear Tops</option>
                      <option>Ladies Earrings - Jumkas</option>
                      <option>Ladies Earrings - Sui Dhaga</option>

                      <option>Ladies Earrings - Buthi</option>
                      <option>Ladies Earrings - Kanchains</option>
                      <option>Ladies Earrings - Fancy</option>
                    </optgroup>
                    <optgroup label="Earrings Collection">
                      <option>Daily Wear Tops</option>
                      <option>Jhumkas</option>
                      <option>Sui Dhaga</option>
                      <option>Buthi</option>
                      <option>Kanchains</option>
                      <option>Fancy Earrings</option>
                    </optgroup>
                    <optgroup label="Wedding Collection">
                      <option>Royal Wedding Set</option>
                      <option>Bridal Choker & Necklace</option>
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Additional Message</label>
                  <textarea 
                    name="message"
                    className="form-textarea"
                    placeholder="Describe your design preference, weight, and requirements..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="form-submit-btn"
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 7.6. Instagram Feed Section */}
      <section className="instagram-feed-section" style={{
        background: '#ffffff',
        padding: '70px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(123, 17, 34, 0.12)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <span style={{
            color: 'var(--royal-gold)',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            SOCIAL CHANNELS
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--peacock-green)',
            fontSize: '2.2rem',
            margin: '0 0 12px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Follow Our Journey On Instagram
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Stay connected with our Gandhidham and Adipur branches for daily gold rate updates, latest BIS 916 hallmarked bridal arrivals, and behind-the-scenes artisan videos.
          </p>

          {/* Real-time Widget or API Fetch Layout */}
          {instaFeedUrl && !instaFeedUrl.includes('behold.so') && !instaFeedUrl.endsWith('.json') && (
            <div style={{ width: '100%', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(123, 17, 34, 0.15)', marginBottom: '36px', boxShadow: '0 8px 32px rgba(123, 17, 34, 0.05)' }}>
              <iframe 
                src={instaFeedUrl} 
                className="snapwidget-widget" 
                allowtransparency="true" 
                frameBorder="0" 
                scrolling="no" 
                style={{ border: 'none', overflow: 'hidden', width: '100%', height: '420px', display: 'block' }}
                title="Instagram Realtime Feed Widget"
              ></iframe>
            </div>
          )}

          {/* Dual Branch Instagram Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '20px'
          }}>
            {/* Card Branch 1 */}
            <div style={{
              background: 'linear-gradient(145deg, #ffffff, #faf6f6)',
              border: '1.5px solid rgba(123, 17, 34, 0.18)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(123, 17, 34, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 14px rgba(220, 39, 67, 0.3)'
                }}>
                  <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                
                <span style={{
                  background: 'rgba(123, 17, 34, 0.08)',
                  color: 'var(--peacock-green)',
                  fontSize: '10px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  BRANCH 1 · GANDHIDHAM
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '20px',
                  color: 'var(--peacock-green)',
                  margin: '12px 0 6px',
                  fontWeight: '700'
                }}>
                  @shree_aradhana_jewellers
                </h3>
                
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 24px', maxWidth: '320px' }}>
                  Gold Souk Gandhidham showroom. Follow for exquisite wedding sets, temple jewellery, and festive drops.
                </p>
              </div>

              <a 
                href="https://www.instagram.com/shree_aradhana_jewellers?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  background: 'var(--royal-gold)',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(123, 17, 34, 0.25)',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <span>FOLLOW ON INSTAGRAM</span> &rarr;
              </a>
            </div>

            {/* Card Branch 2 */}
            <div style={{
              background: 'linear-gradient(145deg, #ffffff, #faf6f6)',
              border: '1.5px solid rgba(123, 17, 34, 0.18)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(123, 17, 34, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 14px rgba(220, 39, 67, 0.3)'
                }}>
                  <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>

                <span style={{
                  background: 'rgba(123, 17, 34, 0.08)',
                  color: 'var(--peacock-green)',
                  fontSize: '10px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  BRANCH 2 · ADIPUR
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '20px',
                  color: 'var(--peacock-green)',
                  margin: '12px 0 6px',
                  fontWeight: '700'
                }}>
                  @aradhanagoldhouse
                </h3>
                
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 24px', maxWidth: '320px' }}>
                  Madanshi Chowk Adipur showroom. Follow for real-time gold rates, daily wear jewellery, and exclusive offers.
                </p>
              </div>

              <a 
                href="https://www.instagram.com/aradhanagoldhouse?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  background: 'var(--royal-gold)',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(123, 17, 34, 0.25)',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <span>FOLLOW ON INSTAGRAM</span> &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5. Download App Section */}
      <section className="app-download-section" style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(123, 17, 34, 0.12)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="/assets/logo.png" 
            alt="App Logo" 
            style={{ 
              height: '72px', 
              width: '72px', 
              borderRadius: '16px', 
              boxShadow: '0 8px 24px rgba(123, 17, 34, 0.2)', 
              marginBottom: '20px',
              objectFit: 'cover'
            }} 
          />
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--peacock-green)',
            fontSize: '2rem',
            margin: '0 0 12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Experience Shree Aradhna Jewellers on Mobile
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            color: '#666666',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            margin: '0 0 32px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Install our official Web App on your iOS or Android device. Track live gold rates, browse handcrafted bridal collections, and inquire seamlessly with our Gandhidham & Adipur showrooms.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Install Button (Android/Chrome/General) */}
            <button
              onClick={handleInstallClick}
              style={{
                background: 'var(--royal-gold)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(123, 17, 34, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              className="pwa-install-btn"
            >
              📥 Install Web App
            </button>

            {/* Enable Price Alerts Button (Calls requestNotificationPermission under user gesture) */}
            <button
              onClick={requestNotificationPermission}
              style={{
                background: 'var(--peacock-green)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(123, 17, 34, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              className="pwa-alerts-btn"
            >
              🔔 Enable Rate Alerts
            </button>

            {/* Test Notification Button */}
            {/* Test Notification Button */}
            <button
              onClick={handleSendTestNotification}
              style={{
                background: '#7b1122',
                color: '#ffd700',
                border: '1.5px solid #ffd700',
                padding: '14px 24px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(123, 17, 34, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              className="pwa-test-btn"
            >
              🔔 Test Notification
            </button>

            {/* Broadcast to All Button */}
            <button
              onClick={handleBroadcastToAll}
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
                color: '#7b1122',
                border: '1.5px solid #ffd700',
                padding: '14px 24px',
                borderRadius: '30px',
                fontWeight: '800',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              className="pwa-broadcast-btn"
            >
              📢 Broadcast Live Rates
            </button>

            {/* Broadcast Festive Message Button */}
            <button
              onClick={handleBroadcastFestivalNow}
              style={{
                background: 'linear-gradient(135deg, #7b1122 0%, #9c152b 100%)',
                color: '#ffd700',
                border: '1.5px solid #ffd700',
                padding: '14px 24px',
                borderRadius: '30px',
                fontWeight: '800',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(123, 17, 34, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              className="pwa-festive-btn"
            >
              🪔 Broadcast Festive Message
            </button>

            {/* iOS Instructions Trigger */}
            <button
              onClick={() => setIsIosHelpOpen(true)}
              style={{
                background: '#ffffff',
                color: 'var(--peacock-green)',
                border: '1px solid rgba(123, 17, 34, 0.3)',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              className="pwa-ios-btn"
            >
              🍎 iOS Setup Guide
            </button>
          </div>
        </div>

        {/* iOS Helper Modal */}
        {isIosHelpOpen && (
          <div
            onClick={() => setIsIosHelpOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(123, 17, 34, 0.15)',
                borderRadius: '20px',
                maxWidth: '400px',
                width: '100%',
                padding: '30px',
                boxShadow: '0 24px 64px rgba(123, 17, 34, 0.15)',
                position: 'relative',
                textAlign: 'left'
              }}
            >
              <button
                onClick={() => setIsIosHelpOpen(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  border: 'none', background: 'none', fontSize: '18px',
                  cursor: 'pointer', color: '#888'
                }}
              >
                ✕
              </button>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--peacock-green)',
                fontSize: '1.3rem',
                margin: '0 0 16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                iPhone & iPad Setup
              </h3>
              <ol style={{
                margin: 0, paddingLeft: '20px',
                fontFamily: 'var(--font-sans)', color: '#4a4a4a',
                fontSize: '13px', lineHeight: '1.8'
              }}>
                <li style={{ marginBottom: '10px' }}>Open <strong>Safari</strong> and go to <strong>www.shreearadhnajewellers.com</strong>.</li>
                <li style={{ marginBottom: '10px' }}>Tap the <strong>Share</strong> button (square icon with an arrow pointing up) at the bottom toolbar.</li>
                <li style={{ marginBottom: '10px' }}>Scroll down and select <strong>"Add to Home Screen"</strong> from the list of options.</li>
                <li>Tap <strong>"Add"</strong> at the top right to complete the installation.</li>
              </ol>
            </div>
          </div>
        )}
      </section>

      {/* 8. Footer */}
      <footer className="footer-main">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-brand-title">SHREE ARADHNA JEWELLERS</span>
            <span className="footer-brand-sub">GANDHIDHAM & ADIPUR, GUJARAT</span>
          </div>

          <div className="footer-branches" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            width: '100%',
            padding: '24px 0',
            borderTop: '1px solid rgba(123, 17, 34, 0.15)',
            borderBottom: '1px solid rgba(123, 17, 34, 0.15)',
            margin: '20px 0',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-dark)' }}>
              <strong style={{ color: 'var(--peacock-green)', display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                📍 BRANCH 1 (GANDHIDHAM)
              </strong>
              PLOT NO = 244, SHOP NO. 2 , GOLD SOUK SECTOR 1 A, 246, MAIN BAZAR, near SWAGAT RESTAURANT, Ward 12B, Gandhidham, Gujarat 370201<br />
              <div style={{ marginTop: '8px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="tel:+919638888170" style={{ color: 'var(--peacock-green)', fontWeight: '700', textDecoration: 'none' }}>
                  📞 +91 96388 88170
                </a>
                <a href="https://www.instagram.com/shree_aradhana_jewellers?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" style={{ color: 'var(--royal-gold)', fontWeight: '700', textDecoration: 'none' }}>
                  📸 @shree_aradhana_jewellers
                </a>
              </div>
            </div>

            <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-dark)' }}>
              <strong style={{ color: 'var(--peacock-green)', display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                📍 BRANCH 2 (ADIPUR)
              </strong>
              SEZ-23/24, Madanshi Chowk, Adipur, Kutch, Gujarat<br />
              <div style={{ marginTop: '8px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="tel:+917202921222" style={{ color: 'var(--peacock-green)', fontWeight: '700', textDecoration: 'none' }}>
                  📞 +91 72029 21222
                </a>
                <a href="https://www.instagram.com/aradhanagoldhouse?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" style={{ color: 'var(--royal-gold)', fontWeight: '700', textDecoration: 'none' }}>
                  📸 @aradhanagoldhouse
                </a>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <Link to="/privacy-policy" className="footer-link-item">PRIVACY POLICY</Link>
            <span className="footer-separator"> | </span>
            <Link to="/terms-of-use" className="footer-link-item">TERMS OF USE</Link>
            <span className="footer-separator"> | </span>
            <Link to="/bis-policy" className="footer-link-item">BIS HALLMARKING POLICY</Link>
            <span className="footer-separator"> | </span>
            <button onClick={() => { setIsAdminOpen(true); handleAdminLogout(); }} className="footer-link-item" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0, color: 'var(--royal-gold)', fontWeight: 'bold' }}>ADMIN PANEL</button>
          </div>

          <div className="footer-socials" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="social-label">INSTAGRAM:</span>
            <a href="https://www.instagram.com/shree_aradhana_jewellers?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="instagram-circle-btn" aria-label="Branch 1 Instagram" title="Branch 1: @shree_aradhana_jewellers">
              <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/aradhanagoldhouse?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="instagram-circle-btn" aria-label="Branch 2 Instagram" title="Branch 2: @aradhanagoldhouse">
              <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} SHREE ARADHNA JEWELLERS · GANDHIDHAM & ADIPUR. All Rights Reserved. Pure BIS Hallmarked Gold & Certified Diamonds.
        </div>
      </footer>

      {/* 8.5. Wishlist Login/Signup & Saved Items Modal Overlay */}
      {isWishlistModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={() => setIsWishlistModalOpen(false)}
        >
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            boxSizing: 'border-box'
          }}
          onClick={(e) => e.stopPropagation()}
          className="hide-scrollbar"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsWishlistModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            {/* Modal Heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Heart style={{ width: '22px', height: '22px', color: 'var(--peacock-green)', fill: 'var(--peacock-green)' }} />
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                margin: 0,
                color: 'var(--text-dark)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Saved Wishlist
              </h3>
            </div>

            {/* Auth Tab Container / Persisted Session Greeting */}
            {wishlistUser ? (
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(123, 17, 34, 0.2)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                width: '100%'
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                    SYNCED WISHLIST PROFILE
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: '700', color: 'var(--peacock-green)', fontFamily: 'var(--font-sans)' }}>
                    {wishlistUser}
                  </p>
                </div>
                <button
                  onClick={handleWishlistLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(123, 17, 34, 0.15)',
                marginBottom: '24px',
                boxSizing: 'border-box'
              }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(123, 17, 34, 0.1)', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsWishlistSignUp(false)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      borderBottom: !isWishlistSignUp ? '2.5px solid var(--peacock-green)' : '2.5px solid transparent',
                      color: !isWishlistSignUp ? 'var(--peacock-green)' : '#888',
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWishlistSignUp(true)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      borderBottom: isWishlistSignUp ? '2.5px solid var(--peacock-green)' : '2.5px solid transparent',
                      color: isWishlistSignUp ? 'var(--peacock-green)' : '#888',
                      padding: '8px 0',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Sign Up
                  </button>
                </div>
                
                {wishlistError && (
                  <div style={{
                    color: '#e53e3e',
                    background: '#fff5f5',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    border: '1px solid #fed7d7',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}>
                    {wishlistError}
                  </div>
                )}
                
                {/* Auth form synced with Saving Scheme */}
                <form onSubmit={handleWishlistAuth} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isWishlistSignUp && (
                    <>
                      <input 
                        type="text" 
                        name="wishlistName"
                        placeholder="Full Name" 
                        required
                        style={{
                          padding: '10px 14px',
                          fontSize: '12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          outline: 'none',
                          fontFamily: 'var(--font-sans)',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}
                      />
                      <input 
                        type="text" 
                        name="wishlistPhone"
                        placeholder="Phone Number" 
                        required
                        style={{
                          padding: '10px 14px',
                          fontSize: '12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          outline: 'none',
                          fontFamily: 'var(--font-sans)',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}
                      />
                    </>
                  )}
                  <input 
                    type="email" 
                    name="wishlistEmail"
                    placeholder="Email Address" 
                    required
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      boxSizing: 'border-box',
                      width: '100%'
                    }}
                  />
                  <input 
                    type="password" 
                    name="wishlistPassword"
                    placeholder="Password" 
                    required
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      boxSizing: 'border-box',
                      width: '100%'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={wishlistLoading}
                    style={{
                      background: 'var(--royal-gold)',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      marginTop: '4px',
                      boxSizing: 'border-box',
                      width: '100%',
                      opacity: wishlistLoading ? 0.7 : 1
                    }}
                  >
                    {wishlistLoading ? 'Processing...' : (isWishlistSignUp ? 'Create Profile & Sync' : 'Log In & Sync')}
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist Items List Section */}
            <div>
              <h4 style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                paddingBottom: '6px'
              }}>
                Your Items ({[...dbProducts, ...allProducts].filter(p => likedProducts[p.id]).length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto' }} className="hide-scrollbar">
                {[...dbProducts, ...allProducts].filter(p => likedProducts[p.id]).map((product) => (
                  <div 
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.04)',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Thumbnail Image */}
                    <img 
                      src={product.url} 
                      alt={product.title}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    
                    {/* Item Name */}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        color: '#1a1a1a',
                        lineHeight: '1.3',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.title}
                      </p>
                      <span style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {product.subCategory || product.category}
                      </span>
                    </div>

                    {/* Action buttons (WhatsApp inquiry and Trash remove) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={`https://wa.me/919638888170?text=Hello%20SHREE%20ARADHNA%20Jewellers,%20I%20am%20interested%20in%20buying%20your%20${encodeURIComponent(product.title)}.%0A%0AProduct%20Link:%20https://www.shreearadhnajewellers.com/?product=${product.id}%20from%20my%20wishlist.`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(37, 211, 102, 0.1)',
                          color: '#25D366',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none'
                        }}
                        title="Inquire on WhatsApp"
                      >
                        <Phone style={{ width: '13px', height: '13px', fill: '#25D366' }} />
                      </a>
                      <button
                        onClick={() => toggleLike(product.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove"
                      >
                        <X style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>
                  </div>
                ))}

                {[...dbProducts, ...allProducts].filter(p => likedProducts[p.id]).length === 0 && (
                  <p style={{ margin: '20px 0', fontSize: '11px', color: '#999', textAlign: 'center' }}>
                    Your wishlist is empty.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 9. Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content hide-scrollbar">
            <button 
              className="admin-modal-close" 
              onClick={() => setIsAdminOpen(false)}
              aria-label="Close Admin Panel"
            >
              <X className="icon-md" />
            </button>

            {!isAuthed ? (
              /* Passcode Screen */
              <form onSubmit={handleAdminLogin}>
                <h3 className="admin-form-title">ADMIN SECURITY LOGIN</h3>
                <div className="admin-form-group">
                  <label className="admin-form-label">Enter Passcode</label>
                  <input 
                    type="password" 
                    required 
                    className="admin-form-input" 
                    placeholder="Enter admin passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                  {errorMsg && <p className="admin-error-msg">{errorMsg}</p>}
                </div>
                <button type="submit" className="admin-submit-btn">ACCESS PANEL</button>
              </form>
            ) : (
              /* Live Rates Dashboard Screen */
              <>
                <form onSubmit={handleSaveRates}>
                  <h3 className="admin-form-title">LIVE RATES DASHBOARD</h3>
                


                <div className="admin-form-group">
                  <label className="admin-form-label">24K Gold Rate (₹ per gram)</label>
                  <input 
                    type="number" 
                    required 
                    className="admin-form-input" 
                    value={temp24k}
                    onChange={(e) => setTemp24k(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">22K Gold Rate (₹ per gram)</label>
                  <input 
                    type="number" 
                    required 
                    className="admin-form-input" 
                    value={temp22k}
                    onChange={(e) => setTemp22k(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">18K Gold Rate (₹ per gram)</label>
                  <input 
                    type="number" 
                    required 
                    className="admin-form-input" 
                    value={temp18k}
                    onChange={(e) => setTemp18k(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Silver Rate (₹ per gram)</label>
                  <input 
                    type="number" 
                    required 
                    className="admin-form-input" 
                    value={tempSilver}
                    onChange={(e) => setTempSilver(e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', marginBottom: '16px' }}>
                  <input 
                    type="checkbox" 
                    id="hide24kCheck"
                    checked={tempHide24k}
                    onChange={(e) => setTempHide24k(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--royal-gold)' }}
                  />
                  <label htmlFor="hide24kCheck" style={{ color: '#ffffff', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}>
                    Hide 24K Gold Rate from public display (Ticker & Live Rates Card)
                  </label>
                </div>

                <button type="submit" className="admin-submit-btn">PUBLISH LIVE RATES PUBLICLY</button>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center', lineHeight: '1.4' }}>
                  
                </p>
              </form>

              <form onSubmit={handleUploadProduct} style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed var(--royal-gold)' }}>
                <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px', letterSpacing: '2px', textAlign: 'center' }}>UPLOAD NEW PRODUCT</h4>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Title</label>
                  <input type="text" className="admin-form-input" required value={upTitle} onChange={e => setUpTitle(e.target.value)} placeholder="e.g. 22K Gold Antique Bangle" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select className="admin-form-input" value={upCategory} onChange={e => { setUpCategory(e.target.value); setUpSubCategory('ALL'); setUpEarringType('ALL'); }}>
                    {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Sub Category</label>
                  <select className="admin-form-input" value={upSubCategory} onChange={e => setUpSubCategory(e.target.value)}>
                    {subCategories[upCategory].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {upSubCategory === 'EARRINGS' && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Earring Type</label>
                    <select className="admin-form-input" value={upEarringType} onChange={e => setUpEarringType(e.target.value)}>
                      {earringSubTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
                <div className="admin-form-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Weight</label>
                    <input type="text" className="admin-form-input" value={upWeight} onChange={e => setUpWeight(e.target.value)} placeholder="e.g. 15.5g" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="admin-form-label">Purity</label>
                    <select className="admin-form-input" value={upPurity} onChange={e => setUpPurity(e.target.value)}>
                      <option value="">Select</option>
                      <option value="24K">24K</option>
                      <option value="22K">22K</option>
                      <option value="18K">18K</option>
                      <option value="92.5 Silver">92.5 Silver</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Image</label>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed rgba(123, 17, 34, 0.4)', borderRadius: '12px',
                    padding: '24px', cursor: 'pointer', background: 'rgba(123, 17, 34, 0.05)',
                    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', marginTop: '4px'
                  }}>
                    <input type="file" accept="image/*,.heic,.heif,image/heic,image/heif" required style={{ display: 'none' }} onChange={handleFileChange} />
                    {isConvertingHeic ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div className="ping-dot"></div>
                        <span style={{ fontSize: '12px', color: 'var(--royal-gold)', fontWeight: 'bold' }}>Converting iPhone HEIC Photo to JPEG...</span>
                      </div>
                    ) : upImageFile ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <img src={URL.createObjectURL(upImageFile)} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--royal-gold)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--royal-gold)' }}>Change Image ({upImageFile.name})</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '24px', color: 'var(--royal-gold)' }}>📸</div>
                        <span style={{ fontSize: '12px', color: '#ccc' }}>Tap to select product image</span>
                      </div>
                    )}
                  </label>
                </div>
                <button type="submit" disabled={isUploading} className="admin-submit-btn" style={{ background: 'var(--royal-gold)', color: 'var(--rich-black)' }}>
                  {isUploading ? 'UPLOADING...' : 'UPLOAD PRODUCT'}
                </button>
              </form>

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed var(--royal-gold)', textAlign: 'center' }}>
                <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '14px', letterSpacing: '2px' }}>EXPORT PRODUCT CATALOG</h4>
                <button 
                  type="button" 
                  onClick={handleExportProductsZip} 
                  disabled={isExportingZip}
                  className="admin-submit-btn"
                  style={{ background: '#2563eb', color: '#ffffff', fontWeight: 'bold' }}
                >
                  {isExportingZip ? 'PACKING ZIP...' : '📦 EXPORT ALL PRODUCTS (.ZIP)'}
                </button>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  (Downloads a .zip folder containing all product images & catalog metadata)
                </p>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed var(--royal-gold)', textAlign: 'center' }}>
                <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '14px', letterSpacing: '2px' }}>STORE ADMIN DASHBOARD</h4>
                <button 
                  type="button" 
                  onClick={() => window.location.href = '/admin'} 
                  className="admin-submit-btn"
                  style={{ background: 'var(--royal-gold)', color: 'var(--rich-black)', fontWeight: 'bold' }}
                >
                  OPEN ADMIN PANEL
                </button>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  (Showroom Appointments, Inquiries, UPI & Store Settings)
                </p>
              </div>

              <button 
                type="button" 
                onClick={handleAdminLogout} 
                className="admin-submit-btn"
                style={{ background: 'transparent', border: '1px solid var(--royal-gold)', color: 'var(--royal-gold)', marginTop: '24px' }}
              >
                LOGOUT FROM ADMIN
              </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* â”€â”€ Lightbox Modal (White & Pink Premium Brand Colors) â”€â”€ */}
      {lightboxProduct && (
        <div
          onClick={() => setLightboxProduct(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Modal box */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(123, 17, 34, 0.15)',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(123, 17, 34, 0.15)',
              position: 'relative'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxProduct(null)}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.05)', border: 'none',
                color: '#1a1a1a', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, lineHeight: 1
              }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Full image */}
            <img
              src={lightboxProduct.url}
              alt={lightboxProduct.title}
              style={{
                width: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                display: 'block',
                background: '#ffffff'
              }}
            />

            {/* Info panel */}
            <div style={{ padding: '24px', boxSizing: 'border-box' }}>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1.2rem',
                color: '#1a1a1a', marginBottom: '10px', fontWeight: 700,
                letterSpacing: '0.3px'
              }}>
                {lightboxProduct.title}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {lightboxProduct.purity && (
                  <span style={{ fontSize: '11px', color: 'var(--peacock-green)', background: 'rgba(123, 17, 34, 0.08)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(123, 17, 34, 0.25)', fontWeight: '600', letterSpacing: '0.5px' }}>
                    ✦ {lightboxProduct.purity}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://www.shreearadhnajewellers.com/?product=${lightboxProduct.id}`);
                    alert("Product link copied to clipboard!");
                  }}
                  style={{
                    background: '#fff', border: '1px solid var(--royal-gold)', color: 'var(--royal-gold)',
                    borderRadius: '8px', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Copy Share Link"
                >
                  <Share2 size={18} />
                </button>
                <a
                  href={`https://wa.me/919638888170?text=Hello%20SHREE%20ARADHNA%20Jewellers,%20I%20am%20interested%20in%20buying%20your%20${encodeURIComponent(lightboxProduct.title)}.%0A%0AProduct%20Link:%20https://www.shreearadhnajewellers.com/?product=${lightboxProduct.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    background: 'var(--royal-gold)', color: '#ffffff', fontWeight: 700,
                    fontSize: '12px', letterSpacing: '1.2px',
                    padding: '13px 20px', borderRadius: '8px',
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                    transition: 'background 0.2s ease'
                  }}
                  className="lightbox-whatsapp-btn"
                >
                  INQUIRE ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ PWA Standalone Rate Update Notification â”€â”€ */}
      {showPwaNotification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 10000,
            background: '#ffffff',
            border: '1px solid rgba(123, 17, 34, 0.25)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 16px 36px rgba(123, 17, 34, 0.15)',
            maxWidth: '320px',
            width: 'calc(100% - 40px)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxSizing: 'border-box'
          }}
        >
          {/* Bell Icon */}
          <div style={{
            background: 'rgba(123, 17, 34, 0.08)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0
          }}>
            🔔
          </div>

          <div style={{ flexGrow: 1 }}>
            <h4 style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--peacock-green)',
              letterSpacing: '0.5px'
            }}>
              {pwaNotificationData.title}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '11px',
              color: '#555555',
              lineHeight: '1.4'
            }}>
              {pwaNotificationData.body}
            </p>
          </div>

          <button
            onClick={() => setShowPwaNotification(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#999999',
              fontSize: '14px',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Clean Animatic App Download Popup Modal */}
      {showAppPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 100%)',
            borderRadius: '24px',
            maxWidth: '440px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px 28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(123, 17, 34, 0.35)',
            position: 'relative',
            animation: 'animaticScaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Close Button */}
            <button
              onClick={closeAppPopup}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: 'rgba(123, 17, 34, 0.12)',
                border: 'none',
                color: '#555555',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              ✕
            </button>



            {/* Title & Subtitle */}
            <span style={{
              display: 'inline-block',
              fontSize: '10px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: '800',
              color: 'var(--royal-gold)',
              background: 'rgba(123, 17, 34, 0.12)',
              padding: '4px 14px',
              borderRadius: '20px',
              marginBottom: '12px'
            }}>
              OFFICIAL APP
            </span>

            <h3 style={{
              margin: '0 0 8px',
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--peacock-green)',
              lineHeight: '1.2'
            }}>
              Install SHREE ARADHNA JEWELLERS
            </h3>

            <p style={{
              margin: '0 0 22px',
              fontSize: '13px',
              color: '#555555',
              lineHeight: '1.5'
            }}>
              Get instant live 22K Gold & Silver rates, handcrafted bridal collections & showroom updates directly on your mobile home screen.
            </p>

            {/* Benefits Checklist */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid rgba(123, 17, 34, 0.25)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#333333', fontWeight: '600' }}>
                <span style={{ color: 'var(--royal-gold)', fontSize: '16px' }}>⚡</span>
                <span>Live Gold & Silver Rate Notifications</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#333333', fontWeight: '600' }}>
                <span style={{ color: 'var(--royal-gold)', fontSize: '16px' }}>💎</span>
                <span>Bespoke Jewelry Catalog & Showroom Appointments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#333333', fontWeight: '600' }}>
                <span style={{ color: 'var(--royal-gold)', fontSize: '16px' }}>📱</span>
                <span>1-Tap Fast Home Screen Access</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  closeAppPopup();
                  handleInstallClick();
                }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--royal-gold) 0%, var(--peacock-green) 100%)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(123, 17, 34, 0.4)',
                  transition: 'transform 0.2s, boxShadow 0.2s'
                }}
              >
                INSTALL APP NOW
              </button>

              <button
                onClick={closeAppPopup}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: '#777777',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Continue to Website
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
