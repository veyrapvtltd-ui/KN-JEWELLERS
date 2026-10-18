/**
 * COMPREHENSIVE ALL-INDIAN & GUJARATI FESTIVALS ENGINE (MAIN GUJARATI FOCUS)
 * Shree Aradhna Jewellers (Gandhidham & Adipur, Kutch, Gujarat)
 * Full automated detection across 2026, 2027, and 2028.
 * Features dedicated Gujarati traditions: Ashadhi Beej (Kutchi New Year),
 * Vagh Baras, Dhanteras Chopda Pujan, Bestu Varas (Saal Mubarak), Labh Pancham,
 * Sheetala Satam, Poshi Poonam, Jayaparvati Vrat, Navratri Garba, and more!
 */

export const INDIAN_FESTIVALS = [
  // ==========================================
  // --- GUJARATI & ALL-INDIAN FESTIVALS ---
  // ==========================================

  // --- JANUARY ---
  {
    id: 'new_year',
    name: 'New Year Celebrations',
    nameHindi: 'नववर्ष की शुभकामनाएं',
    nameGujarati: 'નવા વર્ષની હાર્દિક શુભેચ્છાઓ',
    category: 'national_heritage',
    isGujaratiMain: true,
    icon: '🥂',
    dates: {
      '2026': ['2026-01-01'],
      '2027': ['2027-01-01'],
      '2028': ['2028-01-01']
    },
    title: '🥂 Happy New Year from Shree Aradhna Jewellers!',
    greeting: 'Wishing you a glittering New Year filled with good health, cherished memories, and golden milestones.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ તરફથી આપ સૌને નૂતન વર્ષની હાર્દિક શુભકામનાઓ.',
    offer: 'Step into the new year with our latest modern, lightweight everyday gold & diamond collections.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  },
  {
    id: 'poshi_poonam',
    name: 'Poshi Poonam (Maa Amba Pragatya Din)',
    nameHindi: 'पोषी पूर्णिमा (माँ अंबा प्राकट्य दिवस)',
    nameGujarati: 'પોષી પૂનમ (માં અંબા પ્રાગટ્ય મહોત્સવ)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🪔',
    dates: {
      '2026': ['2026-01-03'],
      '2027': ['2027-01-22'],
      '2028': ['2028-01-11']
    },
    title: '🪔 બોલો અંબે માત કી જય! શુભ પોષી પૂનમ',
    greeting: 'માં અંબાના પ્રાગટ્ય પર્વ પોષી પૂનમની આપ સૌ ભક્તજનોને હાર્દિક શુભકામનાઓ.',
    greetingGujarati: 'માં અંબા આપના કુટુંબ પર સદાય સુખ, શાંતિ અને સમૃદ્ધિની કૃપા વરસાવે.',
    offer: 'માં અંબાના પવિત્ર સુવર્ણ લોકેટ અને 999 શુદ્ધ ચાંદીના સિક્કા ઉપલબ્ધ.',
    themeColor: '#b8860b',
    accentColor: '#fdf6e7'
  },
  {
    id: 'guru_gobind_singh',
    name: 'Guru Gobind Singh Jayanti',
    nameHindi: 'गुरु गोबिंद सिंह जयंती',
    nameGujarati: 'ગુરુ ગોબિંદ સિંહ જયંતિ',
    category: 'divine_muhurat',
    icon: '⚔️',
    dates: {
      '2026': ['2026-01-05'],
      '2027': ['2027-01-14'],
      '2028': ['2028-01-03']
    },
    title: '⚔️ Shubh Prakash Parv - Guru Gobind Singh Jayanti',
    greeting: 'May the teachings of bravery, compassion, and righteousness illuminate your path always.',
    greetingGujarati: 'ગુરુ ગોબિંદ સિંહજીના પ્રકાશ પર્વની હાર્દિક શુભેચ્છાઓ.',
    offer: 'Divine pure 999 silver coins and gold sacred pendants available across all branches.',
    themeColor: '#d4af37',
    accentColor: '#fdf8ea'
  },
  {
    id: 'lohri',
    name: 'Lohri Festival',
    nameHindi: 'लोहड़ी महापर्व',
    nameGujarati: 'લોહરી પર્વ',
    category: 'spring_harvest',
    icon: '🔥',
    dates: {
      '2026': ['2026-01-13'],
      '2027': ['2027-01-13'],
      '2028': ['2028-01-13']
    },
    title: '🔥 Happy Lohri! May the Sacred Fire Burn Bright',
    greeting: 'May the bonfire of Lohri bring immense warmth, happiness, and bountiful golden prosperity.',
    greetingGujarati: 'લોહરીના પવિત્ર પર્વની હાર્દિક શુભેચ્છાઓ.',
    offer: 'Special bridal gold bangles and traditional necklaces for new brides celebrating Lohri.',
    themeColor: '#e76f51',
    accentColor: '#fdf1ee'
  },
  {
    id: 'makar_sankranti',
    name: 'Makar Sankranti, Uttarayan & Vasi Uttarayan',
    nameHindi: 'मकर संक्रांति एवं उत्तरायण',
    nameGujarati: 'મકર સંક્રાંતિ, ઉત્તરાયણ અને વાસી ઉત્તરાયણ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🪁',
    dates: {
      '2026': ['2026-01-14', '2026-01-15'],
      '2027': ['2027-01-14', '2027-01-15'],
      '2028': ['2028-01-14', '2028-01-15']
    },
    title: '🪁 કાઈપો છે! ઉત્તરાયણ અને વાસી ઉત્તરાયણની ખૂબ ખૂબ શુભેચ્છાઓ',
    greeting: 'આપનું જીવન આકાશની જેમ ઊંચું ઊડે અને સોના જેવી ચમક પ્રસરે એવી શ્રી આરાધના જ્વેલર્સની મંગલ કામના.',
    greetingGujarati: 'તિલ-ગુળની મીઠાશ અને સોનાની શુદ્ધતા સાથે ઉત્તરાયણની મંગલકામનાઓ.',
    offer: 'Special lightweight gold jewellery & auspicious pure silver kite charms at Gandhidham & Adipur.',
    themeColor: '#ff7700',
    accentColor: '#ffe8cc'
  },
  {
    id: 'pongal',
    name: 'Pongal Harvest Festival',
    nameHindi: 'पोंगल महापर्व',
    nameGujarati: 'પોંગલ મહોત્સવ',
    category: 'spring_harvest',
    icon: '🌾',
    dates: {
      '2026': ['2026-01-15'],
      '2027': ['2027-01-15'],
      '2028': ['2028-01-15']
    },
    title: '🌾 Happy Pongal! Overflowing Joy & Abundance',
    greeting: 'May the harvest of happiness and golden fortunes overflow in your home this auspicious Pongal.',
    greetingGujarati: 'પોંગલના પર્વ પર સુખ અને સમૃદ્ધિની મંગલકામના.',
    offer: 'Special gold coins and auspicious Lakshmi silver articles at festival rates.',
    themeColor: '#2a9d8f',
    accentColor: '#e8f5f3'
  },
  {
    id: 'republic_day',
    name: 'Republic Day',
    nameHindi: 'गणतंत्र दिवस',
    nameGujarati: 'પ્રજાસત્તાક દિન - ગૌરવવંત ભારત',
    category: 'national_heritage',
    icon: '🇮🇳',
    dates: {
      '2026': ['2026-01-26'],
      '2027': ['2027-01-26'],
      '2028': ['2028-01-26']
    },
    title: '🇮🇳 Happy Republic Day - Proudly Indian',
    greeting: 'Celebrating Indian heritage, unity, and timeless craftsmanship with pure BIS 916 hallmarked jewellery.',
    greetingGujarati: 'પ્રજાસત્તાક દિનની હાર્દિક શુભકામનાઓ - 100% હોલમાર્ક શુદ્ધ સોનું.',
    offer: 'Visit our Gandhidham & Adipur showrooms to experience royal Indian heritage jewellery.',
    themeColor: '#0055a5',
    accentColor: '#e6f0fa'
  },
  {
    id: 'vasant_panchami',
    name: 'Vasant Panchami & Saraswati Puja',
    nameHindi: 'बसंत पंचमी एवं सरस्वती पूजा',
    nameGujarati: 'વસંત પંચમી અને સરસ્વતી પૂજા',
    category: 'spring_harvest',
    isGujaratiMain: true,
    icon: '🌼',
    dates: {
      '2026': ['2026-01-23', '2026-01-24'],
      '2027': ['2027-02-11'],
      '2028': ['2028-01-31']
    },
    title: '🌼 Shubh Vasant Panchami! Welcoming Golden Spring',
    greeting: 'May Goddess Saraswati bestow divine wisdom, creativity, and graceful golden blessings upon you.',
    greetingGujarati: 'માં સરસ્વતી આપના જીવનમાં જ્ઞાન અને સુવર્ણ સમૃદ્ધિ આપે એવી વસંત પંચમીની શુભેચ્છાઓ.',
    offer: 'Yellow gold & lightweight floral jewellery collection now on special display.',
    themeColor: '#e0a96d',
    accentColor: '#fcf6ec'
  },

  // --- FEBRUARY ---
  {
    id: 'maha_shivratri',
    name: 'Maha Shivratri (Bhavnath Mela & Shiva Aradhana)',
    nameHindi: 'महाशिवरात्रि',
    nameGujarati: 'મહા શિવરાત્રી - હર હર મહાદેવ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🔱',
    dates: {
      '2026': ['2026-02-15', '2026-02-16'],
      '2027': ['2027-03-06'],
      '2028': ['2028-02-23']
    },
    title: '🔱 હર હર મહાદેવ! મહા શિવરાત્રીની પાવન શુભકામનાઓ',
    greeting: 'ભગવાન ભોળાનાથ આપના પરિવાર પર સુખ, શાંતિ, નિરોગી આયુષ્ય અને સમૃદ્ધિની કૃપા વરસાવે.',
    greetingGujarati: 'દેવોના દેવ મહાદેવની કૃપાથી આપના દરેક સંકલ્પ સિદ્ધ થાય એવી પ્રાર્થના.',
    offer: 'Sacred pure 999 silver Shivling, Bel-patra & puja vessels available at special festive rates.',
    themeColor: '#7b1122',
    accentColor: '#fbebee'
  },

  // --- MARCH ---
  {
    id: 'holi',
    name: 'Holi, Holika Dahan & Dhuleti',
    nameHindi: 'होली एवं धुलेंडी',
    nameGujarati: 'હોળી, હોલિકા દહન અને ધૂળેટી',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🎨',
    dates: {
      '2026': ['2026-03-03', '2026-03-04'],
      '2027': ['2027-03-22', '2027-03-23'],
      '2028': ['2028-03-11', '2028-03-12']
    },
    title: '🎨 રંગોત્સવ ધૂળેટી અને હોળી પર્વની હાર્દિક શુભકામનાઓ!',
    greeting: 'આપનું જીવન સુવર્ણ રંગો, પ્રેમ, આનંદ અને અખૂટ સમૃદ્ધિથી છલકાઈ રહે.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ તરફથી આપ સૌને ધૂળેટીની રંગબેરંગી શુભકામનાઓ.',
    offer: 'Celebrate the festival of colors with glittering 22K gold & diamond jewellery.',
    themeColor: '#e63946',
    accentColor: '#fde8ea'
  },
  {
    id: 'cheti_chand',
    name: 'Cheti Chand (Jhulelal Jayanti - Kutchi/Sindhi New Year)',
    nameHindi: 'चेटी चंड (झूलेलाल जयंती)',
    nameGujarati: 'ચેટી ચંડ (ઝુલેલાલ જયંતિ - કચ્છી/સિંધી નૂતન વર્ષ)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🌊',
    dates: {
      '2026': ['2026-03-20'],
      '2027': ['2027-04-08'],
      '2028': ['2028-03-28']
    },
    title: '🌊 આયોલાલ સભઈ ચવો ઝુલેલાલ! ચેટી ચંડ જૂં લાખ લાખ વાધાયૂં',
    greeting: 'ગાંધીધામ, આદિપુર અને સમગ્ર કચ્છ-ગુજરાતના ભાઈ-બહેનોને ચેટી ચંડની મંગલકામનાઓ.',
    greetingGujarati: 'ભગવાન ઝુલેલાલ આપ સૌના ઘરમાં શાંતિ, ઐશ્વર્ય અને સુવર્ણ સમૃદ્ધિ આપે.',
    offer: 'Special handcrafted Jhulelal gold & silver pendants and coins at Gandhidham & Adipur.',
    themeColor: '#0077b6',
    accentColor: '#e7f5fb'
  },
  {
    id: 'chaitra_navratri',
    name: 'Gudi Padwa & Chaitra Navratri',
    nameHindi: 'गुड़ी पड़वा एवं चैत्र नवरात्रि',
    nameGujarati: 'ચૈત્ર નવરાત્રી અને ગુડી પડવો',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🌸',
    dates: {
      '2026': ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22', '2026-03-23'],
      '2027': ['2027-04-07', '2027-04-08', '2027-04-09'],
      '2028': ['2028-03-27', '2028-03-28', '2028-03-29']
    },
    title: '🌸 શુભ ચૈત્ર નવરાત્રી અને નૂતન વર્ષારંભ!',
    greeting: 'માં આદ્યશક્તિ દુર્ગા આપના પરિવાર પર અખૂટ આશીર્વાદ વરસાવે.',
    greetingGujarati: 'ચૈત્ર નવરાત્રીના પાવન અવસરે આપના ઘરમાં સુવર્ણ લક્ષ્મીનો વાસ થાય.',
    offer: 'Auspicious new gold designs and navratna jewellery at our Gandhidham and Adipur showrooms.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },
  {
    id: 'ram_navami',
    name: 'Ram Navami',
    nameHindi: 'श्री राम नवमी',
    nameGujarati: 'શ્રી રામ નવમી - જય શ્રી રામ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🏹',
    dates: {
      '2026': ['2026-03-27'],
      '2027': ['2027-04-15'],
      '2028': ['2028-04-04']
    },
    title: '🏹 મર્યાદા પુરુષોત્તમ ભગવાન શ્રી રામ નવમીની હાર્દિક શુભકામનાઓ',
    greeting: 'ભગવાન શ્રી રામચંદ્રજી આપના જીવનમાં સત્ય, શાંતિ અને સમૃદ્ધિની પ્રેરણા આપે.',
    greetingGujarati: 'જય શ્રી રામ! રામ નવમીના પાવન પર્વે આપના કુટુંબનું કલ્યાણ થાય.',
    offer: 'Sacred Ayodhya Ram Mandir pure silver coins and Ram Darbar gold medallions available.',
    themeColor: '#e07a5f',
    accentColor: '#faeae6'
  },
  {
    id: 'mahavir_jayanti',
    name: 'Mahavir Janma Kalyanak (Mahavir Jayanti)',
    nameHindi: 'महावीर जन्म कल्याणक',
    nameGujarati: 'મહાવીર જન્મ કલ્યાણક - જય જિનેન્દ્ર',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🕊️',
    dates: {
      '2026': ['2026-03-31'],
      '2027': ['2027-04-19'],
      '2028': ['2028-04-08']
    },
    title: '🕊️ જય જિનેન્દ્ર! ભગવાન મહાવીર જન્મ કલ્યાણકની મંગલકામનાઓ',
    greeting: 'જીવો અને જીવવા દો - અહિંસા પરમો ધર્મના સંદેશ સાથે શાંતિ અને સમૃદ્ધિની પ્રાર્થના.',
    greetingGujarati: 'ભગવાન મહાવીરના આશીર્વાદથી આપના જીવનમાં દિવ્ય શાંતિ અને પવિત્રતા ફેલાય.',
    offer: 'Auspicious Navkar Mantra pure silver plates & Jain spiritual gold jewellery in stock.',
    themeColor: '#7b1122',
    accentColor: '#fbebee'
  },

  // --- APRIL ---
  {
    id: 'hanuman_jayanti',
    name: 'Hanuman Jayanti',
    nameHindi: 'हनुमान जयंती',
    nameGujarati: 'શ્રી હનુમાન જયંતિ - કષ્ટભંજન દેવ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🚩',
    dates: {
      '2026': ['2026-04-02'],
      '2027': ['2027-04-21'],
      '2028': ['2028-04-10']
    },
    title: '🚩 જય બજરંગબલી! શ્રી હનુમાન જયંતિની મંગલ શુભકામનાઓ',
    greeting: 'કષ્ટભંજન સાળંગપુર હનુમાનજી દાદા આપના સર્વ સંકટો દૂર કરી બળ અને બુદ્ધિ અર્પે.',
    greetingGujarati: 'પવનસુત હનુમાનજી આપના પરિવારની સદા રક્ષા કરે.',
    offer: 'Pure Gold and 999 Silver Hanumanji amulets and lockets available.',
    themeColor: '#c85a17',
    accentColor: '#faede7'
  },
  {
    id: 'baisakhi_vishu',
    name: 'Baisakhi, Vishu & Puthandu',
    nameHindi: 'बैसाखी एवं विशु',
    nameGujarati: 'બૈસાખી અને વિશુ ઉત્સવ',
    category: 'spring_harvest',
    icon: '🌾',
    dates: {
      '2026': ['2026-04-14'],
      '2027': ['2027-04-14'],
      '2028': ['2028-04-13']
    },
    title: '🌾 Happy Baisakhi, Vishu & Regional New Years!',
    greeting: 'Celebrating the bountiful golden harvest with auspicious beginnings across India.',
    greetingGujarati: 'નવા વર્ષ અને લણણીના ઉત્સવની હાર્દિક શુભેચ્છાઓ.',
    offer: 'Auspicious gold buying with guaranteed BIS 916 hallmarking at Gandhidham & Adipur.',
    themeColor: '#f4a261',
    accentColor: '#fef5ee'
  },
  {
    id: 'akshaya_tritiya',
    name: 'Akshaya Tritiya (Akha Teej - Supreme Gold Day)',
    nameHindi: 'अक्षય तृतीया (अखा तीज - स्वर्ण महामुहूर्त)',
    nameGujarati: 'અક્ષય તૃતીયા (અખા ત્રીજ - સોનું ખરીદવાનું પરમ મુહૂર્ત)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🪙',
    dates: {
      '2026': ['2026-04-19', '2026-04-20'],
      '2027': ['2027-05-09', '2027-05-10'],
      '2028': ['2028-04-27', '2028-04-28']
    },
    title: '🪙 શુભ અખા ત્રીજ! અક્ષય પુણ્ય અને અક્ષય લક્ષ્મીનું પર્વ',
    greeting: 'અખા ત્રીજે ખરીદેલું સોનું અખંડ સૌભાગ્ય અને અક્ષય સમૃદ્ધિ લાવે છે. શુદ્ધ BIS 916 હોલમાર્ક સોનું વસાવો.',
    greetingGujarati: 'આજના શુભ મુહૂર્તે શ્રી આરાધના જ્વેલર્સ તરફથી અક્ષય સમૃદ્ધિની મંગલકામનાઓ.',
    offer: 'Special Akshaya Tritiya Gold Coin discounts & lowest making charges at Gandhidham & Adipur!',
    themeColor: '#b8860b',
    accentColor: '#fdf7e7'
  },

  // --- MAY & JUNE ---
  {
    id: 'buddha_purnima',
    name: 'Buddha Purnima',
    nameHindi: 'बुद्ध पूर्णिमा',
    nameGujarati: 'બુદ્ધ પૂર્ણિમા',
    category: 'divine_muhurat',
    icon: '🪷',
    dates: {
      '2026': ['2026-05-01'],
      '2027': ['2027-05-20'],
      '2028': ['2028-05-09']
    },
    title: '🪷 Peaceful Buddha Purnima Greetings',
    greeting: 'May the teachings of peace, enlightenment, and mindful compassion fill your home with tranquility.',
    greetingGujarati: 'બુદ્ધ પૂર્ણિમાની શાંતિમય શુભકામનાઓ.',
    offer: 'Pure timeless gold & platinum bands embodying purity and harmony.',
    themeColor: '#3d5a80',
    accentColor: '#ecf1f6'
  },
  {
    id: 'eid_ul_fitr',
    name: 'Eid-ul-Fitr (Ramadan Eid)',
    nameHindi: 'ईद-उल-फ़ितर',
    nameGujarati: 'ઈદ-ઉલ-ફિત્ર મુબારક',
    category: 'divine_muhurat',
    icon: '🌙',
    dates: {
      '2026': ['2026-03-20', '2026-03-21'],
      '2027': ['2027-03-10', '2027-03-11'],
      '2028': ['2028-02-27', '2028-02-28']
    },
    title: '🌙 Eid Mubarak from Shree Aradhna Jewellers!',
    greeting: 'May the blessings of Allah fill your life with peace, happiness, and golden prosperity.',
    greetingGujarati: 'આપ સૌને ઈદ મુબારકની હાર્દિક શુભકામનાઓ.',
    offer: 'Celebrate with our exquisite handcrafted diamond & gold festive collections.',
    themeColor: '#2d6a4f',
    accentColor: '#eaf4ee'
  },
  {
    id: 'eid_ul_adha',
    name: 'Eid-ul-Adha (Bakrid)',
    nameHindi: 'ईद-उल-अज़हा (बकरीद)',
    nameGujarati: 'ઈદ-ઉલ-અઝહા (બકરીઈદ)',
    category: 'divine_muhurat',
    icon: '✨',
    dates: {
      '2026': ['2026-05-27', '2026-05-28'],
      '2027': ['2027-05-17', '2027-05-18'],
      '2028': ['2028-05-05', '2028-05-06']
    },
    title: '✨ Eid-ul-Adha Mubarak! Season of Devotion & Joy',
    greeting: 'Wishing you and your beloved family peace, unity, good health, and joyful celebrations.',
    greetingGujarati: 'ઈદ-ઉલ-અઝહાની મુબારકબાદ.',
    offer: 'Royal heritage gold chokers and diamond bangles now available at Gandhidham & Adipur.',
    themeColor: '#1b4332',
    accentColor: '#e8f0ec'
  },

  // --- JULY (ASHADHI BEEJ - KUTCHI NEW YEAR) ---
  {
    id: 'ashadhi_beej_kutch',
    name: 'Ashadhi Beej (Kutchhi Naye Vareh - Kutchi New Year & Rath Yatra)',
    nameHindi: 'अषाढ़ी बीज (कच्छी नववर्ष एवं रथ यात्रा)',
    nameGujarati: 'અષાઢી બીજ (કચ્છી નયે વરેહ - કચ્છી નવું વર્ષ અને રથયાત્રા)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🚩',
    dates: {
      '2026': ['2026-07-16'],
      '2027': ['2027-07-05'],
      '2028': ['2028-06-24']
    },
    title: '🚩 અષાઢી બીજ - કચ્છી નયે વરેહ જૂં લાખ લાખ વધાયૂં!',
    greeting: 'ગાંધીધામ, આદિપુર અને વિશ્વભરના સમસ્ત કચ્છી ભાઈઓ-બહેનોને કચ્છી નવા વર્ષની હાર્દિક શુભકામનાઓ.',
    greetingGujarati: 'ભગવાન જગન્નાથજી અને માં આશાપુરા આપના ઘરમાં અખૂટ લક્ષ્મી અને ખુશીઓ લાવે.',
    offer: 'કચ્છી નૂતન વર્ષે વિશેષ સુવર્ણ સિક્કા અને હોલમાર્ક દાગીના પર આકર્ષક ઓફર ગાંધીધામ અને આદિપુર શોરૂમ ખાતે.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  },
  {
    id: 'jayaparvati_vrat',
    name: 'Jayaparvati Vrat & Molakat (Aluna Vrat)',
    nameHindi: 'जयापार्वती व्रत (अलुणा व्रत)',
    nameGujarati: 'જયાપાર્વતી વ્રત અને મોળાકત (અલૂણા)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🌸',
    dates: {
      '2026': ['2026-07-25', '2026-07-26', '2026-07-27', '2026-07-28', '2026-07-29'],
      '2027': ['2027-07-15', '2027-07-16', '2027-07-17', '2027-07-18', '2027-07-19'],
      '2028': ['2028-07-03', '2028-07-04', '2028-07-05', '2028-07-06', '2028-07-07']
    },
    title: '🌸 શુભ જયાપાર્વતી વ્રત - અખંડ સૌભાગ્યની પ્રાર્થના',
    greeting: 'માં પાર્વતી આપની દીકરીઓ અને બહેનોને અખંડ સૌભાગ્ય, દીર્ઘાયુષ્ય અને સુખ-શાંતિ આપે.',
    greetingGujarati: 'જયાપાર્વતી વ્રતના પાવન અવસરે સુવર્ણ કંકણ અને ચેઈનની વિશેષ શ્રેણી.',
    offer: 'Special lightweight gold chains & bracelets for auspicious Jayaparvati gifting.',
    themeColor: '#b8860b',
    accentColor: '#fdf7e7'
  },
  {
    id: 'guru_purnima',
    name: 'Guru Purnima',
    nameHindi: 'गुरु पूर्णिमा',
    nameGujarati: 'ગુરુ પૂર્ણિમા - ગુરુદેવો ભવઃ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🌕',
    dates: {
      '2026': ['2026-07-29'],
      '2027': ['2027-07-18'],
      '2028': ['2028-07-06']
    },
    title: '🌕 શુભ ગુરુ પૂર્ણિમા! પૂજ્ય ગુરુજનોના ચરણોમાં વંદન',
    greeting: 'ગુરુ બ્રહ્મા ગુરુ વિષ્ણુ ગુરુ દેવો મહેશ્વરા - જ્ઞાન આપનાર સર્વ ગુરુજનોને પ્રણામ.',
    greetingGujarati: 'ગુરુ પૂર્ણિમાના પાવન દિવસે જીવનમાં જ્ઞાન અને સદ્વિચારનો પ્રકાશ ફેલાય એવી કામના.',
    offer: 'Pure silver Guru paduka, spiritual malas, and gold gifting coins available.',
    themeColor: '#d4af37',
    accentColor: '#fff9e6'
  },

  // --- AUGUST ---
  {
    id: 'independence_day',
    name: 'Independence Day (15th August)',
    nameHindi: 'स्वतंत्रता दिवस',
    nameGujarati: 'સ્વાતંત્ર્ય દિન - ૧૫મી ઓગસ્ટ',
    category: 'national_heritage',
    icon: '🇮🇳',
    dates: {
      '2026': ['2026-08-15'],
      '2027': ['2027-08-15'],
      '2028': ['2028-08-15']
    },
    title: '🇮🇳 Happy Independence Day! Vande Mataram',
    greeting: 'Saluting our great nation with the unmatched purity of 100% BIS Hallmarked jewellery.',
    greetingGujarati: 'સ્વાતંત્ર્ય દિનની આપ સૌ દેશવાસીઓને હાર્દિક શુભકામનાઓ.',
    offer: 'Freedom festive offers across all gold and silver collections at Gandhidham & Adipur.',
    themeColor: '#ff7700',
    accentColor: '#ffeedd'
  },
  {
    id: 'raksha_bandhan',
    name: 'Raksha Bandhan',
    nameHindi: 'रक्षाबंधन',
    nameGujarati: 'પવિત્ર રક્ષાબંધન - ભાઈ-બહેનનો અમર સ્નેહ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🎁',
    dates: {
      '2026': ['2026-08-27', '2026-08-28'],
      '2027': ['2027-08-16', '2027-08-17'],
      '2028': ['2028-08-05', '2028-08-06']
    },
    title: '🎁 રક્ષાબંધનની હાર્દિક શુભકામનાઓ! ભાઈ-બહેનનો અતૂટ પ્રેમ',
    greeting: 'બહેનના રક્ષણ અને સ્નેહના આ પવિત્ર તહેવારે ભેટ આપો 100% હોલમાર્ક શુદ્ધ સોનાના દાગીના.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ તરફથી રક્ષાબંધનની મંગલકામનાઓ.',
    offer: 'Exclusive Silver Rakhis, Gold Pendants & Earring Gift sets on display.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  },

  // --- SEPTEMBER (GUJARATI SHRADDHA, SHEETALA SATAM & JANMASHTAMI) ---
  {
    id: 'randhan_chhath',
    name: 'Randhan Chhath',
    nameHindi: 'रांधन छठ',
    nameGujarati: 'રાંધણ છઠ - શીતળા સાતમની પૂર્વતૈયારી',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🍲',
    dates: {
      '2026': ['2026-09-02'],
      '2027': ['2027-08-23'],
      '2028': ['2028-08-11']
    },
    title: '🍲 શુભ રાંધણ છઠ - પરંપરાગત ગુજરાતી તહેવાર',
    greeting: 'આવતીકાલની શીતળા સાતમ માટે ભોજન તૈયાર કરવાનો આનંદમય ગુજરાતી પર્વ.',
    greetingGujarati: 'આપના ઘરમાં સુખ, શાંતિ અને અન્નપૂર્ણા માંના આશીર્વાદ સદા રહે.',
    offer: 'Explore handcrafted pure silver utensils and dining articles.',
    themeColor: '#588157',
    accentColor: '#edf3ed'
  },
  {
    id: 'sheetala_satam',
    name: 'Sheetala Satam (Gujarati Tradition)',
    nameHindi: 'शीतला सातम',
    nameGujarati: 'શીતળા સાતમ - ઠંડા ભોજનનો પાવન પર્વ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🪔',
    dates: {
      '2026': ['2026-09-03'],
      '2027': ['2027-08-24'],
      '2028': ['2028-08-12']
    },
    title: '🪔 શીતળા સાતમની હાર્દિક શુભકામનાઓ!',
    greeting: 'માં શીતળા આપના પરિવારને સદાય નીરોગી, દીર્ઘાયુ અને ખુશહાલ રાખે એવી પ્રાર્થના.',
    greetingGujarati: 'પરંપરાગત ગુજરાતી પર્વ શીતળા સાતમે શ્રી આરાધના જ્વેલર્સની મંગલકામનાઓ.',
    offer: 'Special discounts on lightweight everyday gold earrings & bangles.',
    themeColor: '#2a9d8f',
    accentColor: '#e8f5f3'
  },
  {
    id: 'janmashtami',
    name: 'Shree Krishna Janmashtami & Nand Mahotsav (Dwarkadhish Jayanti)',
    nameHindi: 'श्री कृष्ण जन्माष्टमी एवं नंद महोत्सव',
    nameGujarati: 'શ્રી કૃષ્ણ જન્માષ્ટમી અને નંદ મહોત્સવ - હાથી ઘોડા પાલખી, જય કન્હૈયા લાલ કી!',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🦚',
    dates: {
      '2026': ['2026-09-03', '2026-09-04'],
      '2027': ['2027-08-24', '2027-08-25'],
      '2028': ['2028-08-12', '2028-08-13']
    },
    title: '🦚 નંદ ઘેર આનંદ ભયો, જય કન્હૈયા લાલ કી! જન્માષ્ટમીની વધાઈ',
    greeting: 'દ્વારકાધીશ ભગવાન શ્રી કૃષ્ણ આપના ઘરમાં અખૂટ આનંદ, શાંતિ અને સુવર્ણ સમૃદ્ધિ વરસાવે.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ તરફથી જન્માષ્ટમી મહાપર્વની હાર્દિક શુભકામનાઓ.',
    offer: 'Pure 999 Silver Laddu Gopal idols, gold flutes & lockets at Gandhidham & Adipur showrooms.',
    themeColor: '#1d3557',
    accentColor: '#eef3f9'
  },
  {
    id: 'paryushan_samvatsari',
    name: 'Paryushan Parva & Samvatsari (Michhami Dukkadam)',
    nameHindi: 'पर्युषण पर्व एवं संवत्सरी (मिच्छामि दुक्कड़म्)',
    nameGujarati: 'પર્યુષણ મહાપર્વ અને સંવત્સરી - મિચ્છામિ દુક્કડમ્',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🙏',
    dates: {
      '2026': ['2026-09-08', '2026-09-09', '2026-09-15'],
      '2027': ['2027-08-29', '2027-08-30', '2027-09-05'],
      '2028': ['2028-08-17', '2028-08-18', '2028-08-24']
    },
    title: '🙏 મિચ્છામિ દુક્કડમ્ - શ્રી આરાધના જ્વેલર્સ તરફથી ક્ષમાપના',
    greeting: 'જાણતા કે અજાણતા આપના મનને કોઈ દુઃખ પહોંચાડ્યું હોય તો શુદ્ધ અંતઃકરણપૂર્વક મિચ્છામિ દુક્કડમ્.',
    greetingGujarati: 'સર્વ જીવો પ્રત્યે મૈત્રીભાવ અને પ્રેમ રહે એવી મંગલ કામના.',
    offer: 'Auspicious sacred pure silver Jain puja thalis and sacred coins available.',
    themeColor: '#7b1122',
    accentColor: '#fbebee'
  },
  {
    id: 'ganesh_chaturthi',
    name: 'Ganesh Chaturthi',
    nameHindi: 'गणेश चतुर्थी',
    nameGujarati: 'શ્રી ગણેશ ચતુર્થી - ગણપતિ બાપ્પા મોરિયા!',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🐘',
    dates: {
      '2026': ['2026-09-14', '2026-09-15', '2026-09-16'],
      '2027': ['2027-09-04', '2027-09-05'],
      '2028': ['2028-08-24', '2028-08-25']
    },
    title: '🐘 ગણપતિ બાપ્પા મોરિયા! ગણેશ ચતુર્થીની શુભકામનાઓ',
    greeting: 'વિઘ્નહર્તા શ્રી ગણેશજી આપના સર્વ વિઘ્નો હરી રિદ્ધિ-સિદ્ધિ અને સુવર્ણ સમૃદ્ધિ આપે.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ ગાંધીધામ અને આદિપુર તરફથી ગણેશોત્સવની વધાઈ.',
    offer: 'Pure hallmarked Ganesha gold lockets and 999 silver puja articles now in stock.',
    themeColor: '#e76f51',
    accentColor: '#fdf1ee'
  },
  {
    id: 'anant_chaturdashi',
    name: 'Anant Chaturdashi (Ganesh Visarjan)',
    nameHindi: 'अनंत चतुर्दशी',
    nameGujarati: 'અનંત ચતુર્દશી - પુઢચ્યા વર્ષી લવકર યા',
    category: 'divine_muhurat',
    icon: '✨',
    dates: {
      '2026': ['2026-09-24'],
      '2027': ['2027-09-14'],
      '2028': ['2028-09-03']
    },
    title: '✨ અનંત ચતુર્દશીની મંગલકામનાઓ',
    greeting: 'બાપ્પાના આશીર્વાદ સદાય આપના જીવનમાં અનંત સુખ-શાંતિ લાવે.',
    greetingGujarati: 'અનંત ચતુર્દશીએ સોના-ચાંદીના શુભ દાગીનાની શ્રેણી.',
    offer: 'Special discounts on 22K gold rings and lightweight pendants at both showrooms.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },

  // --- OCTOBER (SHARAD NAVRATRI, DUSSEHRA & SHARAD PURNIMA) ---
  {
    id: 'gandhi_jayanti',
    name: 'Mahatma Gandhi Jayanti (Gujarat Pride)',
    nameHindi: 'महात्मा गांधी जयंती',
    nameGujarati: 'મહાત્મા ગાંધી જયંતિ - ગુજરાતનું ગૌરવ',
    category: 'national_heritage',
    isGujaratiMain: true,
    icon: '👓',
    dates: {
      '2026': ['2026-10-02'],
      '2027': ['2027-10-02'],
      '2028': ['2028-10-02']
    },
    title: '👓 રાષ્ટ્રપિતા મહાત્મા ગાંધી જયંતિની સ્મૃતિ વંદના',
    greeting: 'સત્ય અને અહિંસાના પૂજારી પૂજ્ય બાપુને કોટિ કોટિ વંદન. 100% પારદર્શક અને નૈતિક વેપારની ખાતરી.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ - પ્રમાણિકતા અને શુદ્ધતાનું વિશ્વાસપાત્ર નામ.',
    offer: '100% transparent pricing and computerized purity testing always free for our patrons.',
    themeColor: '#588157',
    accentColor: '#edf3ed'
  },
  {
    id: 'sharad_navratri',
    name: 'Sharad Navratri Garba Mahotsav (All 9 Nights of Gujarat)',
    nameHindi: 'शारदीय नवरात्रि एवं गरबा महोत्सव',
    nameGujarati: 'નવરાત્રી મહોત્સવ - માં અંબાના ગરબાની નવ રળિયામણી રાતો',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🪔',
    dates: {
      '2026': [
        '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15',
        '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'
      ],
      '2027': [
        '2027-09-30', '2027-10-01', '2027-10-02', '2027-10-03', '2027-10-04',
        '2027-10-05', '2027-10-06', '2027-10-07', '2027-10-08', '2027-10-09'
      ],
      '2028': [
        '2028-10-19', '2028-10-20', '2028-10-21', '2028-10-22', '2028-10-23',
        '2028-10-24', '2028-10-25', '2028-10-26', '2028-10-27', '2028-10-28'
      ]
    },
    title: '🪔 જય આદ્યશક્તિ! નવરાત્રી ગરબા મહોત્સવની હાર્દિક શુભકામનાઓ',
    greeting: 'માં અંબા, માં ચામુંડા અને માં આશાપુરા આપના કુટુંબ પર અખૂટ કૃપા વરસાવે એવી મંગલ કામના.',
    greetingGujarati: 'ગરબે ઘૂમો અને ચમકો અમારા ૩ ખાસ કલેક્શન સાથે: લગ્ન સેટ, ઈયરિંગ્સ અને લેડીઝ કલેક્શન.',
    offer: 'Dazzle every night with our 3 Featured Collections: Wedding Sets, Earrings & Ladies Collections at Gandhidham & Adipur.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'dussehra',
    name: 'Dussehra, Vijayadashami & Fafda Jalebi Parv',
    nameHindi: 'दशहरा एवं विजयादशमी',
    nameGujarati: 'દશેરા, વિજયાદશમી અને ફાફડા-જલેબી પર્વ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🏹',
    dates: {
      '2026': ['2026-10-20'],
      '2027': ['2027-10-09'],
      '2028': ['2028-10-28']
    },
    title: '🏹 વિજયાદશમી (દશેરા)ની હાર્દિક શુભકામનાઓ!',
    greeting: 'અસત્ય પર સત્યના વિજયનો પાવન અવસર. ફાફડા-જલેબીની મીઠાશ અને સોનાની શુદ્ધતા સાથે ઉજવો દશેરા.',
    greetingGujarati: 'દશેરાના શુભ મુહૂર્તે સોનાની ખરીદી અતિ ઉત્તમ માનવામાં આવે છે. પધારો ગાંધીધામ અને આદિપુર.',
    offer: 'Special Dussehra gold purchases with certificate of BIS hallmarking guarantee.',
    themeColor: '#b8860b',
    accentColor: '#fbf5e7'
  },
  {
    id: 'sharad_purnima',
    name: 'Sharad Purnima (Doodh Poha Parv)',
    nameHindi: 'शरद पूर्णिमा',
    nameGujarati: 'શરદ પૂર્ણિમા - દૂધ પૌંઆ અને માં લક્ષ્મીનું આગમન',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🌕',
    dates: {
      '2026': ['2026-10-25'],
      '2027': ['2027-10-15'],
      '2028': ['2028-11-02']
    },
    title: '🌕 શરદ પૂર્ણિમાની દિવ્ય શુભકામનાઓ!',
    greeting: 'આજે રાત્રે માં લક્ષ્મી પધારે છે. ચાંદની રાત, દૂધ-પૌંઆ અને માં લક્ષ્મીના આશીર્વાદ સદા આપની સાથે રહે.',
    greetingGujarati: 'શરદ પૂનમે શુદ્ધ ચાંદીના વાસણો અને પૂજા સામગ્રીની વિશેષ શ્રેણી.',
    offer: 'Pure 999 silver bowls, spoons, and silver dinnerware on special festive showcase.',
    themeColor: '#d4af37',
    accentColor: '#fff9e6'
  },
  {
    id: 'karwa_chauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    nameGujarati: 'કરવા ચોથ - અખંડ સૌભાગ્યનું વ્રત',
    category: 'gujarati_sacred',
    icon: '💍',
    dates: {
      '2026': ['2026-10-29'],
      '2027': ['2027-10-19'],
      '2028': ['2028-11-06']
    },
    title: '💍 Happy Karwa Chauth! Celebrating Eternal Love',
    greeting: 'Honoring the timeless bond of devotion and lifelong partnership with radiant gold and diamond treasures.',
    greetingGujarati: 'કરવા ચોથના પવિત્ર તહેવારે અખંડ સૌભાગ્યની શુભકામનાઓ.',
    offer: 'Exquisite short & long mangalsutras, lightweight bridal bangles and diamond rings on special display.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },

  // --- NOVEMBER (PEAK GUJARATI DIWALI & WEDDING SEASON) ---
  {
    id: 'pushya_nakshatra',
    name: 'Pushya Nakshatra (The Supreme Gold Buying Muhurat)',
    nameHindi: 'पुष्य नक्षत्र (सोने की खरीदारी का महामुहूर्त)',
    nameGujarati: 'પુષ્ય નક્ષત્ર (સોનાની ખરીદીનું સર્વોત્તમ મુહૂર્ત)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '⭐',
    dates: {
      '2026': ['2026-11-01', '2026-11-02'],
      '2027': ['2027-10-22', '2027-10-23'],
      '2028': ['2028-11-09', '2028-11-10']
    },
    title: '⭐ શુભ પુષ્ય નક્ષત્ર - દિવાળી પૂર્વે સોનું ખરીદવાનું સર્વશ્રેષ્ઠ મુહૂર્ત!',
    greeting: 'પુષ્ય નક્ષત્રે ખરીદેલું સોનું ક્યારેય ઘટતું નથી અને સ્થિર લક્ષ્મી લાવે છે. શુદ્ધ 24K સિક્કા અને 22K હોલમાર્ક દાગીના બુક કરાવો.',
    greetingGujarati: 'ગાંધીધામ અને આદિપુર શોરૂમ ખાતે પુષ્ય નક્ષત્રનું વિશેષ આયોજન.',
    offer: 'Pure 24K Gold Coins & 22K Hallmarked Jewellery booking open at Gandhidham & Adipur showrooms.',
    themeColor: '#b8860b',
    accentColor: '#fdf6e7'
  },
  {
    id: 'vagh_baras',
    name: 'Vagh Baras / Govatsa Dwadashi (Diwali Kickoff)',
    nameHindi: 'वाघ बारस / गोवत्स द्वादशी',
    nameGujarati: 'વાઘ બારસ અને ગૌવત્સ દ્વાદશી - દિવાળી તહેવાર શરૂ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🐄',
    dates: {
      '2026': ['2026-11-05'],
      '2027': ['2027-10-26'],
      '2028': ['2028-11-13']
    },
    title: '🐄 શુભ વાઘ બારસ - દીપોત્સવી મહાપર્વનો મંગલ પ્રારંભ!',
    greeting: 'આજથી દિવાળીના પાવન દિવસો શરૂ થાય છે. ગૌમાતાના પૂજન સાથે આપના ઘરમાં લક્ષ્મીજીનું આગમન થાય.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ તરફથી વાઘ બારસની મંગલકામનાઓ.',
    offer: 'Special Diwali advance booking open with zero making charges on gold coins.',
    themeColor: '#d4af37',
    accentColor: '#fff9e6'
  },
  {
    id: 'dhanteras',
    name: 'Dhanteras & Chopda Pujan',
    nameHindi: 'धनतेरस एवं चोपड़ा पूजन',
    nameGujarati: 'ધનતેરસ, ધનવંતરિ જયંતિ અને ચોપડા ખરીદી મુહૂર્ત',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '✨',
    dates: {
      '2026': ['2026-11-06'],
      '2027': ['2027-10-27'],
      '2028': ['2028-11-14']
    },
    title: '✨ શુભ ધનતેરસ! માં લક્ષ્મી અને ધનવંતરિ આપના ઘરમાં પધારે',
    greeting: 'આજના અતિ પવિત્ર દિવસે સોનું અને ચાંદી ખરીદી ઘરમાં અખંડ લક્ષ્મી અને તંદુરસ્તી પધરાવો.',
    greetingGujarati: 'ધનતેરસે 100% હોલમાર્ક શુદ્ધ સોનાના સિક્કા અને બ્રાઈડલ સેટ્સ ગાંધીધામ અને આદિપુર શોરૂમ ખાતે ઉપલબ્ધ.',
    offer: 'Exclusive Dhanteras gold & silver coins, bridal wedding chokers, and designer jewellery available all day.',
    themeColor: '#d4af37',
    accentColor: '#fff9e6'
  },
  {
    id: 'kali_chaudas',
    name: 'Kali Chaudas / Roop Chaturdashi',
    nameHindi: 'काली चौदस / रूप चतुर्दशी',
    nameGujarati: 'કાળી ચૌદશ અને રૂપ ચૌદશ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🕯️',
    dates: {
      '2026': ['2026-11-07'],
      '2027': ['2027-10-28'],
      '2028': ['2028-11-15']
    },
    title: '🕯️ શુભ કાળી ચૌદશ અને રૂપ ચતુર્દશી',
    greeting: 'દુષ્ટ શક્તિઓ અને નકારાત્મકતાનો નાશ થાય, આપનું જીવન સુવર્ણ તેજથી પ્રકાશિત રહે.',
    greetingGujarati: 'કાળી ચૌદશની હાર્દિક શુભેચ્છાઓ - દિવાળી લક્ષ્મી પૂજનની તૈયારી.',
    offer: 'Diwali Lakshmi Pujan certified gold coins & gold jewelry in stock.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  },
  {
    id: 'diwali',
    name: 'Diwali Mahaparv & Chopda Pujan (Festival of Lights)',
    nameHindi: 'दीपावली एवं चोपड़ा पूजन',
    nameGujarati: 'દિવાળી મહાપર્વ અને ચોપડા પૂજન - દીપોત્સવી',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🪔',
    dates: {
      '2026': ['2026-11-08'],
      '2027': ['2027-10-29'],
      '2028': ['2028-11-16']
    },
    title: '🪔 દીપોત્સવી મહાપર્વ દિવાળીની હાર્દિક શુભકામનાઓ!',
    greeting: 'દીવડાઓનો પ્રકાશ આપના જીવનમાં અનંત ખુશી, શાંતિ અને સોના જેવી ઝળહળતી સમૃદ્ધિ લાવે.',
    greetingGujarati: 'ગાંધીધામ, આદિપુર અને સમગ્ર કચ્છ-ગુજરાતના તમામ વહાલા ગ્રાહકોને શ્રી આરાધના જ્વેલર્સ તરફથી શુભ દીપાવલી!',
    offer: 'Wishing our cherished patrons across Gujarat a very Happy and Prosperous Diwali!',
    themeColor: '#7b1122',
    accentColor: '#fdecee'
  },
  {
    id: 'nutan_varsh',
    name: 'Bestu Varas / Nutan Varshabhinandan (Gujarati New Year - Saal Mubarak)',
    nameHindi: 'नूतन वर्षाभिनंदन (गुजराती नववर्ष - साल मुबारक)',
    nameGujarati: 'બેસતું વર્ષ - સાલ મુબારક અને નૂતન વર્ષાભિનંદન (વિક્રમ સંવત)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🎉',
    dates: {
      '2026': ['2026-11-09'],
      '2027': ['2027-10-30'],
      '2028': ['2028-11-17']
    },
    title: '🎉 સાલ મુબારક & નૂતન વર્ષાભિનંદન! નવું વર્ષ મંગલમય બને',
    greeting: 'નવા વર્ષના રામ રામ! નવું વર્ષ આપના અને આપના પરિવાર માટે સુખ, સ્વાસ્થ્ય અને સુવર્ણ સફળતાઓથી ભરેલું રહે.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ પરિવાર તરફથી આપ સૌને સાલ મુબારક! નવા વર્ષે શુદ્ધ સોના સાથે કરો મંગલ શુભારંભ.',
    offer: 'Start your new Vikram Samvat year with the timeless purity of 22K BIS Hallmarked gold.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'govardhan_annakut',
    name: 'Govardhan Puja & Annakut Mahotsav',
    nameHindi: 'गोवर्धन पूजा एवं अन्नकूट दर्शन',
    nameGujarati: 'ગોવર્ધન પૂજા અને ભવ્ય અન્નકૂટ મહોત્સવ દર્શન',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🏔️',
    dates: {
      '2026': ['2026-11-09'],
      '2027': ['2027-10-30'],
      '2028': ['2028-11-17']
    },
    title: '🏔️ શુભ ગોવર્ધન પૂજા અને અન્નકૂટ દર્શનની વધાઈ!',
    greeting: 'ભગવાન શ્રીકૃષ્ણની કૃપાથી આપના ઘરમાં અન્ન અને ધનનો ભંડાર સદાય ભરેલો રહે.',
    greetingGujarati: 'અન્નકૂટ મહોત્સવે શુદ્ધ ચાંદીની ગાય-વાછરડું (કામધેનુ)ની મૂર્તિઓ ઉપલબ્ધ.',
    offer: 'Divine pure 999 silver Cow & Calf (Kamadhenu) idols in stock at both showrooms.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },
  {
    id: 'bhai_beej',
    name: 'Bhai Beej (Bhau Beej)',
    nameHindi: 'भाई दूज',
    nameGujarati: 'ભાઈ બીજ - ભાઈ-બહેનના પ્રેમનું પવિત્ર બંધન',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '💫',
    dates: {
      '2026': ['2026-11-10'],
      '2027': ['2027-10-31'],
      '2028': ['2028-11-18']
    },
    title: '💫 શુભ ભાઈ બીજ! ભાઈ-બહેનના સ્નેહનો મંગલ પર્વ',
    greeting: 'બહેનના વહાલ અને આશીર્વાદ ભાઈની પ્રગતિનું રહસ્ય બને. ભેટ આપો કાયમી મૂલ્ય ધરાવતું શુદ્ધ સોનું.',
    greetingGujarati: 'શ્રી આરાધના જ્વેલર્સ તરફથી ભાઈ બીજની હાર્દિક શુભકામનાઓ.',
    offer: 'Gift pure gold pendants, silver coin sets, and designer chains with special gift packaging.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },
  {
    id: 'labh_pancham',
    name: 'Labh Pancham (Auspicious Gujarati Business Opening Muhurat)',
    nameHindi: 'लाभ पंचम (सौभाग्य पंचमी - व्यापार मुहूर्त)',
    nameGujarati: 'લાભ પાંચમ (સૌભાગ્ય પંચમી - વેપાર-ધંધા શરૂ કરવાનું પરમ શુભ મુહૂર્ત)',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '📈',
    dates: {
      '2026': ['2026-11-14'],
      '2027': ['2027-11-04'],
      '2028': ['2028-11-22']
    },
    title: '📈 શુભ લાભ પાંચમ! વેપારમાં અખૂટ લાભ અને પ્રગતિનું મુહૂર્ત',
    greeting: 'લાભ પાંચમે વેપારના ચોપડા અને વ્યવસાયનો પ્રારંભ સોના જેવા તેજસ્વી નફા અને સમૃદ્ધિ સાથે થાય એવી મંગલ કામના.',
    greetingGujarati: 'લાભ પાંચમના શુભ મુહૂર્તે સોનાનું બુકિંગ ગાંધીધામ અને આદિપુર શોરૂમ ખાતે ખુલ્લું છે.',
    offer: 'Auspicious day to inaugurate new gold purchases and investments at Gandhidham & Adipur.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'chhath_puja',
    name: 'Chhath Puja Mahaparv',
    nameHindi: 'छठ पूजा महापर्व',
    nameGujarati: 'છઠ પૂજા - સૂર્યદેવની ઉપાસના',
    category: 'divine_muhurat',
    icon: '☀️',
    dates: {
      '2026': ['2026-11-15', '2026-11-16'],
      '2027': ['2027-11-05', '2027-11-06'],
      '2028': ['2028-11-23', '2028-11-24']
    },
    title: '☀️ Shubh Chhath Puja! Worshipping Bhagwan Surya & Chhathi Maiya',
    greeting: 'May the Sun God bestow health, vitality, purity, and golden illumination upon your entire family.',
    greetingGujarati: 'છઠ પૂજાની પાવન શુભકામનાઓ.',
    offer: 'Pure 999 silver Surya idols and gold puja coins on special festive display.',
    themeColor: '#f77f00',
    accentColor: '#fef3e6'
  },
  {
    id: 'tulsi_vivah',
    name: 'Dev Uthani Ekadashi & Tulsi Vivah (Gujarati Wedding Season Launch)',
    nameHindi: 'देवउठनी एकादशी एवं तुलसी विवाह (विवाह लग्न मुहूर्त शुरू)',
    nameGujarati: 'દેવ ઉઠની એકાદશી અને તુલસી વિવાહ - લગ્નગાળો શરૂ!',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '🌿',
    dates: {
      '2026': ['2026-11-20', '2026-11-21'],
      '2027': ['2027-11-10', '2027-11-11'],
      '2028': ['2028-11-28', '2028-11-29']
    },
    title: '🌿 શુભ તુલસી વિવાહ! હિન્દુ શાસ્ત્રોક્ત લગ્નગાળો શરૂ',
    greeting: 'ભગવાન વિષ્ણુ અને તુલસીજીના મંગલ વિવાહ સાથે લગ્નગાળો શરૂ થયો છે. આપના ઘરના લગ્ન માટે પધારો શ્રી આરાધના જ્વેલર્સ.',
    greetingGujarati: 'રોયલ વેડિંગ કલેક્શન: ચોકર, રાણી હાર, કંકણ અને બ્રાઈડલ સેટ્સનું ભવ્ય પ્રદર્શન.',
    offer: 'Exclusive Bridal Wedding Collection launch! Book your wedding jewellery sets today at Gandhidham & Adipur.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  },
  {
    id: 'dev_diwali',
    name: 'Dev Diwali & Guru Nanak Jayanti',
    nameHindi: 'देव दिवाली एवं गुरु नानक जयंती',
    nameGujarati: 'દેવ દિવાળી અને ગુરુ નાનક જયંતિ',
    category: 'gujarati_sacred',
    isGujaratiMain: true,
    icon: '✨',
    dates: {
      '2026': ['2026-11-24'],
      '2027': ['2027-11-14'],
      '2028': ['2028-12-02']
    },
    title: '✨ શુભ દેવ દિવાળી & ગુરપુરબ દી લાખ લાખ વધાઈયાં!',
    greeting: 'દેવતાઓની દિવાળી આપના આંગણે સદાય દિવ્ય તેજ અને અખંડ સુવર્ણ સમૃદ્ધિ પાથરે.',
    greetingGujarati: 'દેવ દિવાળીએ સોના-ચાંદીના વિશેષ દાગીના ઉપલબ્ધ.',
    offer: 'Pure gold & silver spiritual lockets available at special festive celebration rates.',
    themeColor: '#e0a96d',
    accentColor: '#fbf4ea'
  },

  // --- DECEMBER ---
  {
    id: 'gita_jayanti',
    name: 'Gita Jayanti / Mokshada Ekadashi',
    nameHindi: 'गीता जयंती / मोक्षदा एकादशी',
    nameGujarati: 'ગીતા જયંતિ / મોક્ષદા એકાદશી',
    category: 'divine_muhurat',
    isGujaratiMain: true,
    icon: '📜',
    dates: {
      '2026': ['2026-12-20'],
      '2027': ['2027-12-09'],
      '2028': ['2028-12-27']
    },
    title: '📜 શુભ ગીતા જયંતિ! શ્રીમદ્ ભગવદ્ ગીતાનો અમૃત સંદેશ',
    greeting: 'કર્મણ્યેવાધિકારસ્તે મા ફલેષુ કદાચન - ગીતાજીનું જ્ઞાન આપના જીવનને માર્ગદર્શન આપે.',
    greetingGujarati: 'ગીતા જયંતિની મંગલ શુભકામનાઓ.',
    offer: 'Sacred gold & silver Gita lockets and divine spiritual jewellery.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },
  {
    id: 'christmas',
    name: 'Merry Christmas & Season of Joy',
    nameHindi: 'क्रिसमस की हार्दिक शुभकामनाएं',
    nameGujarati: 'નાતાલ (ક્રિસમસ)ની હાર્દિક શુભેચ્છાઓ',
    category: 'national_heritage',
    icon: '🎄',
    dates: {
      '2026': ['2026-12-24', '2026-12-25'],
      '2027': ['2027-12-24', '2027-12-25'],
      '2028': ['2028-12-24', '2028-12-25']
    },
    title: '🎄 Merry Christmas from Shree Aradhna Jewellers!',
    greeting: 'Wishing you warmth, laughter, and golden memories this joyful Christmas holiday season.',
    greetingGujarati: 'નાતાલના પર્વની હાર્દિક શુભકામનાઓ.',
    offer: 'Sparkling diamond solitaires, platinum bands, and exquisite holiday gift sets.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  }
];

/**
 * Format date to YYYY-MM-DD in Indian Standard Time (Asia/Kolkata)
 */
export function getISTDateString(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch (e) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Automatically detects whether today is a festival or in a festival window.
 */
export function getCurrentFestival(targetDate = new Date()) {
  const dateStr = getISTDateString(targetDate);
  const year = dateStr.split('-')[0];

  // 1. Check custom override if set by admin
  try {
    if (typeof window !== 'undefined') {
      const customOverride = localStorage.getItem('SAJ_active_festival_override');
      if (customOverride) {
        const found = INDIAN_FESTIVALS.find(f => f.id === customOverride);
        if (found) {
          const customOffer = localStorage.getItem('SAJ_custom_festival_offer');
          return {
            isActive: true,
            isCustomOverride: true,
            festival: customOffer ? { ...found, offer: customOffer } : found,
            dateStr
          };
        }
      }
    }
  } catch (e) {}

  // 2. Search in all Indian & Gujarati festivals
  for (const fest of INDIAN_FESTIVALS) {
    const festDates = fest.dates[year] || [];
    if (festDates.includes(dateStr)) {
      return {
        isActive: true,
        isCustomOverride: false,
        festival: fest,
        dateStr
      };
    }
  }

  // 3. Not today, find next upcoming festival
  const upcoming = getNextUpcomingFestival(targetDate);

  return {
    isActive: false,
    nextFestival: upcoming,
    dateStr
  };
}

/**
 * Finds the next upcoming Indian/Gujarati festival from the given date
 */
export function getNextUpcomingFestival(fromToday = new Date()) {
  const todayStr = getISTDateString(fromToday);
  const currentYear = todayStr.split('-')[0];

  let closestFestival = null;
  let minDiffDays = 9999;

  for (const fest of INDIAN_FESTIVALS) {
    const yearDates = [
      ...(fest.dates[currentYear] || []),
      ...(fest.dates[String(Number(currentYear) + 1)] || [])
    ];
    for (const dStr of yearDates) {
      if (dStr >= todayStr) {
        const diffMs = new Date(dStr + 'T00:00:00+05:30').getTime() - new Date(todayStr + 'T00:00:00+05:30').getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < minDiffDays) {
          minDiffDays = diffDays;
          closestFestival = {
            festival: fest,
            targetDate: dStr,
            daysRemaining: diffDays
          };
        }
      }
    }
  }

  return closestFestival;
}

/**
 * Dispatches an automated festive greeting notification
 */
export async function dispatchFestivalBroadcast(festival, force = false) {
  if (!festival || typeof window === 'undefined') return false;

  const todayStr = getISTDateString();
  const storageKey = `SAJ_fest_broadcast_${festival.id}_${todayStr}`;

  if (!force && localStorage.getItem(storageKey)) {
    return false; // Already broadcasted today
  }

  // Record broadcast in local history
  localStorage.setItem(storageKey, 'true');
  const history = JSON.parse(localStorage.getItem('SAJ_festival_broadcast_history') || '[]');
  history.unshift({
    festivalId: festival.id,
    festivalName: festival.name,
    title: festival.title,
    offer: festival.offer,
    date: todayStr,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('SAJ_festival_broadcast_history', JSON.stringify(history.slice(0, 50)));

  // Try browser push notification if permitted or requested
  const notifyTitle = festival.title || festival.name || '👑 Shree Aradhna Jewellers';
  const notifyBody = `${festival.greetingGujarati || festival.greeting || ''} • ${festival.offer || 'Visit our Gandhidham & Adipur showrooms for festival offers.'}`;
  
  // Universal multi-device broadcast (local OS notification + BroadcastChannel + Supabase realtime)
  await broadcastNotificationToAll(notifyTitle, notifyBody);

  // Dispatch custom DOM event so website banner & popup reactively update
  window.dispatchEvent(new CustomEvent('saj_festival_broadcast', { detail: festival }));
  return true;
}

// Native notification debounce cache to prevent duplicate sounds/bubbles
let lastNativeNotifTag = '';
let lastNativeNotifTime = 0;

/**
 * Universal system notification sender (ServiceWorker + Native Notification + Event)
 */
export function sendSystemNotification(title, body, tag = 'saj-alert', extraPayload = null) {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const options = {
    body,
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    tag,
    vibrate: [200, 100, 200],
    data: { url: window.location.origin }
  };

  // Only fire native OS notification if not already sent within 5 seconds for this tag
  if (now - lastNativeNotifTime > 5000 || lastNativeNotifTag !== tag) {
    lastNativeNotifTag = tag;
    lastNativeNotifTime = now;

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => {
              if (reg && reg.showNotification) {
                reg.showNotification(title, options);
              }
            }).catch(() => {
              try { new Notification(title, options); } catch (err) {}
            });
          } else {
            try { new Notification(title, options); } catch (err) {}
          }
        } catch (e) {
          console.warn('Native notification failed:', e);
        }
      }
    }
  }

  // Always broadcast DOM event for in-app floating toast with complete payload
  window.dispatchEvent(new CustomEvent('saj_custom_notification', {
    detail: extraPayload || { title, body }
  }));
}

/**
 * Broadcast notification to ALL devices, tabs, PWAs, and worldwide Supabase realtime subscribers
 */
export async function broadcastNotificationToAll(title, body, extraData = {}) {
  if (typeof window === 'undefined') return;

  const senderId = extraData.senderId || (typeof window !== 'undefined'
    ? (window.__saj_client_id || (window.__saj_client_id = 'saj_' + Math.random().toString(36).substring(2, 9)))
    : 'server');

  const payload = {
    title: title || '👑 Shree Aradhna Jewellers',
    body: body || 'Live Gold Rate Update! Hallmarked 22K/24K rates & showroom offers active in Gandhidham & Adipur.',
    timestamp: new Date().toISOString(),
    senderId,
    ...extraData
  };

  // 1. Dispatch locally on current device with stable tag to prevent multiple OS bubbles
  const stableTag = extraData.rates ? 'saj-live-rate-update' : 'saj-announcement';
  sendSystemNotification(payload.title, payload.body, stableTag, payload);

  // 2. Cross-tab BroadcastChannel to wake up all open tabs & PWA instances
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('saj_notifications');
      bc.postMessage(payload);
    }
  } catch (e) {
    console.warn('BroadcastChannel error:', e);
  }

  // 3. Supabase Realtime & Persistent Store for worldwide devices
  try {
    const { isSupabaseConfigured, supabase } = await import('./supabase');
    if (isSupabaseConfigured()) {
      const channel = supabase.channel('saj_public_broadcast');
      if (channel.state === 'joined') {
        await channel.send({
          type: 'broadcast',
          event: 'new_notification',
          payload
        });
      } else {
        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.send({
              type: 'broadcast',
              event: 'new_notification',
              payload
            });
          }
        });
      }

      // Save notification to store
      try {
        await supabase.from('broadcast_notifications').insert([{
          title: payload.title,
          body: payload.body,
          created_at: payload.timestamp
        }]);
      } catch (err) {}
    }
  } catch (e) {
    console.warn('Supabase broadcast failed:', e);
  }

  // 4. Save to local broadcast history
  try {
    const history = JSON.parse(localStorage.getItem('SAJ_festival_broadcast_history') || '[]');
    history.unshift({
      festivalId: 'public-broadcast',
      festivalName: 'Public Broadcast',
      title: payload.title,
      offer: payload.body,
      date: new Date().toLocaleDateString('en-IN'),
      timestamp: payload.timestamp
    });
    localStorage.setItem('SAJ_festival_broadcast_history', JSON.stringify(history.slice(0, 50)));
  } catch (e) {}

  return payload;
}


