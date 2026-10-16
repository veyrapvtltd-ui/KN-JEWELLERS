/**
 * INDIAN FESTIVALS AUTOMATIC GREETINGS & BROADCAST ENGINE
 * Shree Aradhna Jewellers (Gandhidham & Adipur)
 * Automatically detects upcoming and ongoing Indian festivals,
 * broadcasts festive greetings, and displays celebratory banners.
 */

export const INDIAN_FESTIVALS = [
  {
    id: 'makar_sankranti',
    name: 'Makar Sankranti & Uttarayan',
    nameHindi: 'मकर संक्रांति एवं उत्तरायण',
    nameGujarati: 'મકર સંક્રાંતિ અને ઉત્તરાયણ',
    icon: '🪁',
    dates: {
      '2026': ['2026-01-14', '2026-01-15'],
      '2027': ['2027-01-14', '2027-01-15'],
      '2028': ['2028-01-14', '2028-01-15']
    },
    title: '🪁 Happy Makar Sankranti & Uttarayan from Shree Aradhna Jewellers!',
    greeting: 'Wishing you and your family high-flying joy, sweet moments, and golden prosperity this Uttarayan.',
    offer: 'Explore handcrafted lightweight gold & auspicious silver coin collections at Gandhidham & Adipur.',
    themeColor: '#ff7700',
    accentColor: '#ffe8cc'
  },
  {
    id: 'republic_day',
    name: 'Republic Day',
    nameHindi: 'गणतंत्र दिवस',
    nameGujarati: 'પ્રજાસત્તાક દિન',
    icon: '🇮🇳',
    dates: {
      '2026': ['2026-01-26'],
      '2027': ['2027-01-26'],
      '2028': ['2028-01-26']
    },
    title: '🇮🇳 Happy 77th Republic Day - Proudly Indian',
    greeting: 'Celebrating Indian heritage, unity, and timeless artistic craftsmanship with pure BIS 916 hallmarked jewellery.',
    offer: 'Visit our Gandhidham & Adipur showrooms to experience royal heritage jewellery.',
    themeColor: '#0055a5',
    accentColor: '#e6f0fa'
  },
  {
    id: 'maha_shivratri',
    name: 'Maha Shivratri',
    nameHindi: 'महाशिवरात्रि',
    nameGujarati: 'મહા શિવરાત્રી',
    icon: '🔱',
    dates: {
      '2026': ['2026-02-15'],
      '2027': ['2027-03-06'],
      '2028': ['2028-02-23']
    },
    title: '🔱 Har Har Mahadev! Auspicious Maha Shivratri Greetings',
    greeting: 'May Lord Shiva bless your life with divine peace, strength, good health, and abundant prosperity.',
    offer: 'Sacred pure 999 silver Shivling, Bel-patra & puja vessels available at special festive rates.',
    themeColor: '#7b1122',
    accentColor: '#fbebee'
  },
  {
    id: 'holi',
    name: 'Holi & Dhuleti',
    nameHindi: 'होली एवं धुलेंडी',
    nameGujarati: 'હોળી અને ધૂળેટી',
    icon: '🎨',
    dates: {
      '2026': ['2026-03-03', '2026-03-04'],
      '2027': ['2027-03-22', '2027-03-23'],
      '2028': ['2028-03-11', '2028-03-12']
    },
    title: '🎨 Happy Holi & Dhuleti from Shree Aradhna Jewellers!',
    greeting: 'May your life be filled with vibrant golden colors of joy, love, harmony, and prosperity.',
    offer: 'Celebrate the colors of spring with sparkling designer gold & diamond collections.',
    themeColor: '#e63946',
    accentColor: '#fde8ea'
  },
  {
    id: 'chaitra_navratri',
    name: 'Gudi Padwa & Chaitra Navratri',
    nameHindi: 'गुड़ी पड़वा एवं चैत्र नवरात्रि',
    nameGujarati: 'ચૈત્ર નવરાત્રી અને ગુડી પડવો',
    icon: '🌸',
    dates: {
      '2026': ['2026-03-19', '2026-03-20'],
      '2027': ['2027-04-07', '2027-04-08'],
      '2028': ['2028-03-27', '2028-03-28']
    },
    title: '🌸 Shubh Chaitra Navratri & New Beginnings!',
    greeting: 'May Goddess Durga shower you and your family with divine grace, good health, and success.',
    offer: 'Auspicious new gold designs now available at our Gandhidham and Adipur showrooms.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },
  {
    id: 'akshaya_tritiya',
    name: 'Akshaya Tritiya (Akha Teej)',
    nameHindi: 'अक्षय तृतीया (अखा तीज)',
    nameGujarati: 'અક્ષય તૃતીયા (અખા ત્રીજ)',
    icon: '🪙',
    dates: {
      '2026': ['2026-04-19', '2026-04-20'],
      '2027': ['2027-05-09', '2027-05-10'],
      '2028': ['2028-04-27', '2028-04-28']
    },
    title: '🪙 Shubh Akshaya Tritiya! An Auspicious Day for Pure Gold',
    greeting: 'Gold purchased on Akshaya Tritiya multiplies prosperity forever. Invest in pure BIS 916 hallmarked gold today.',
    offer: 'Special Akshaya Tritiya Gold Coin discounts & lowest making charges at Gandhidham & Adipur!',
    themeColor: '#b8860b',
    accentColor: '#fdf7e7'
  },
  {
    id: 'eid_ul_fitr',
    name: 'Eid-ul-Fitr',
    nameHindi: 'ईद-उल-फ़ितर',
    nameGujarati: 'ઈદ-ઉલ-ફિત્ર',
    icon: '🌙',
    dates: {
      '2026': ['2026-03-20', '2026-03-21'],
      '2027': ['2027-03-10', '2027-03-11'],
      '2028': ['2028-02-27', '2028-02-28']
    },
    title: '🌙 Eid Mubarak from Shree Aradhna Jewellers!',
    greeting: 'May the blessings of Allah fill your life with peace, happiness, and golden prosperity.',
    offer: 'Celebrate with our exquisite handcrafted diamond & gold festive collections.',
    themeColor: '#2d6a4f',
    accentColor: '#eaf4ee'
  },
  {
    id: 'raksha_bandhan',
    name: 'Raksha Bandhan',
    nameHindi: 'रक्षाबंधन',
    nameGujarati: 'રક્ષાબંધન',
    icon: '🎁',
    dates: {
      '2026': ['2026-08-27', '2026-08-28'],
      '2027': ['2027-08-16', '2027-08-17'],
      '2028': ['2028-08-05', '2028-08-06']
    },
    title: '🎁 Happy Raksha Bandhan! Celebrate the Eternal Bond',
    greeting: 'Gift your beloved sister the eternal shine of pure hallmarked gold pendants, earrings, and silver rakhis.',
    offer: 'Exclusive Rakhi Gift jewellery sets with special festive gift packaging available.',
    themeColor: '#7b1122',
    accentColor: '#faebee'
  },
  {
    id: 'janmashtami',
    name: 'Shree Krishna Janmashtami',
    nameHindi: 'श्री कृष्ण जन्माष्टमी',
    nameGujarati: 'શ્રી કૃષ્ણ જન્માષ્ટમી',
    icon: '🦚',
    dates: {
      '2026': ['2026-09-03', '2026-09-04'],
      '2027': ['2027-08-24', '2027-08-25'],
      '2028': ['2028-08-12', '2028-08-13']
    },
    title: '🦚 Jai Shree Krishna! Shubh Janmashtami Greetings',
    greeting: 'May the divine flute of Lord Krishna bring endless melody, peace, and abundance into your home.',
    offer: 'Divine pure 999 silver Laddu Gopal idols, gold flutes & lockets at our Gandhidham & Adipur showrooms.',
    themeColor: '#1d3557',
    accentColor: '#eef3f9'
  },
  {
    id: 'ganesh_chaturthi',
    name: 'Ganesh Chaturthi',
    nameHindi: 'गणेश चतुर्थी',
    nameGujarati: 'ગણેશ ચતુર્થી',
    icon: '🐘',
    dates: {
      '2026': ['2026-09-14', '2026-09-15', '2026-09-16'],
      '2027': ['2027-09-04', '2027-09-05'],
      '2028': ['2028-08-24', '2028-08-25']
    },
    title: '🐘 Ganpati Bappa Morya! Auspicious Ganesh Chaturthi Greetings',
    greeting: 'May Lord Ganesha remove all obstacles and shower his divine blessings of prosperity and wisdom on you.',
    offer: 'Pure hallmarked Ganesha gold lockets and 999 silver puja articles now in stock.',
    themeColor: '#e76f51',
    accentColor: '#fdf1ee'
  },
  {
    id: 'sharad_navratri',
    name: 'Sharad Navratri & Durga Puja',
    nameHindi: 'शारदीय नवरात्रि एवं दुर्गा पूजा',
    nameGujarati: 'નવરાત્રી મહોત્સવ અને દુર્ગા પૂજા',
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
    title: '🪔 Shubh Navratri! Celebrating 9 Nights of Divine Grace',
    greeting: 'Shree Aradhna Jewellers wishes you and your family a joyous, vibrant and blessed Navratri.',
    offer: 'Dazzle every night with our 4 Featured Collections: Gents, Ladies, Earrings & Royal Wedding Sets.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'dussehra',
    name: 'Dussehra & Vijayadashami',
    nameHindi: 'दशहरा एवं विजयादशमी',
    nameGujarati: 'દશેરા અને વિજયાદશમી',
    icon: '🏹',
    dates: {
      '2026': ['2026-10-20'],
      '2027': ['2027-10-09'],
      '2028': ['2028-10-28']
    },
    title: '🏹 Shubh Dussehra! Victory of Light & Righteousness',
    greeting: 'Celebrate the victory of good over evil. May this Vijayadashami bring golden triumphs to your endeavors.',
    offer: 'Special Dussehra gold purchases with certificate of BIS hallmarking guarantee.',
    themeColor: '#b8860b',
    accentColor: '#fbf5e7'
  },
  {
    id: 'karwa_chauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    nameGujarati: 'કરવા ચોથ',
    icon: '💍',
    dates: {
      '2026': ['2026-10-29'],
      '2027': ['2027-10-19'],
      '2028': ['2028-11-06']
    },
    title: '💍 Happy Karwa Chauth! Celebrating Eternal Love',
    greeting: 'Honoring the timeless bond of devotion and lifelong partnership with radiant gold and diamond treasures.',
    offer: 'Exquisite short & long mangalsutras, lightweight bridal bangles and diamond rings on special display.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'pushya_nakshatra',
    name: 'Pushya Nakshatra (Auspicious Gold Day)',
    nameHindi: 'पुष्य नक्षत्र',
    nameGujarati: 'પુષ્ય નક્ષત્ર',
    icon: '⭐',
    dates: {
      '2026': ['2026-11-01', '2026-11-02'],
      '2027': ['2027-10-22', '2027-10-23'],
      '2028': ['2028-11-09', '2028-11-10']
    },
    title: '⭐ Shubh Pushya Nakshatra - The Most Auspicious Day for Gold',
    greeting: 'Ancient scriptures revere Pushya Nakshatra as the supreme mahurat to acquire gold for everlasting Lakshmi.',
    offer: 'Pure 24K Gold Coins & 22K Hallmarked Jewellery booking open at Gandhidham & Adipur showrooms.',
    themeColor: '#b8860b',
    accentColor: '#fdf6e7'
  },
  {
    id: 'dhanteras',
    name: 'Dhanteras & Lakshmi Pujan',
    nameHindi: 'धनतेरस एवं लक्ष्मी पूजन',
    nameGujarati: 'ધનતેરસ અને લક્ષ્મી પૂજન',
    icon: '✨',
    dates: {
      '2026': ['2026-11-06'],
      '2027': ['2027-10-27'],
      '2028': ['2028-11-14']
    },
    title: '✨ Shubh Dhanteras! Divine Blessings of Wealth & Health',
    greeting: 'May Lord Dhanvantari and Goddess Mahalakshmi bestow eternal health, wealth, and golden fortune upon your home.',
    offer: 'Exclusive Dhanteras gold & silver coins, bridal wedding chokers, and designer jewellery available all day.',
    themeColor: '#d4af37',
    accentColor: '#fff9e6'
  },
  {
    id: 'diwali',
    name: 'Diwali & Deepavali (Festival of Lights)',
    nameHindi: 'दीपावली (रोशनी का महापर्व)',
    nameGujarati: 'દિવાળી (રોશનીનો મહાપર્વ)',
    icon: '🪔',
    dates: {
      '2026': ['2026-11-08'],
      '2027': ['2027-10-29'],
      '2028': ['2028-11-16']
    },
    title: '🪔 Shubh Deepavali from Shree Aradhna Jewellers!',
    greeting: 'May the radiant glow of diyas illuminate your life with infinite joy, harmony, and golden abundance.',
    offer: 'Wishing our cherished patrons in Gandhidham, Adipur, and across Gujarat a very Happy Diwali!',
    themeColor: '#7b1122',
    accentColor: '#fdecee'
  },
  {
    id: 'nutan_varsh',
    name: 'Nutan Varshabhinandan (Gujarati New Year)',
    nameHindi: 'नूतन वर्षाभिनंदन (गुजराती नववर्ष)',
    nameGujarati: 'નૂતન વર્ષાભિનંદન (બેસતું વર્ષ)',
    icon: '🎉',
    dates: {
      '2026': ['2026-11-09'],
      '2027': ['2027-10-30'],
      '2028': ['2028-11-17']
    },
    title: '🎉 સાલ મુબારક & નૂતન વર્ષાભિનંદન!',
    greeting: 'Shree Aradhna Jewellers wishes you a prosperous, healthy and auspicious New Year filled with golden milestones.',
    offer: 'Start your new year with the timeless purity of 22K BIS Hallmarked gold.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'bhai_dooj',
    name: 'Bhai Dooj / Bhau Beej',
    nameHindi: 'भाई दूज',
    nameGujarati: 'ભાઈ બીજ',
    icon: '💫',
    dates: {
      '2026': ['2026-11-10'],
      '2027': ['2027-10-31'],
      '2028': ['2028-11-18']
    },
    title: '💫 Happy Bhai Dooj! Celebrating Brother-Sister Affection',
    greeting: 'Cherish this beautiful bond with timeless gold gifts that reflect everlasting care and protection.',
    offer: 'Gift pure gold pendants, silver coin sets, and designer chains with special gift packaging.',
    themeColor: '#b8860b',
    accentColor: '#fcf6e8'
  },
  {
    id: 'labh_pancham',
    name: 'Labh Pancham (Shubh Muhurat)',
    nameHindi: 'लाभ पंचम (सौभाग्य पंचमी)',
    nameGujarati: 'લાભ પાંચમ (શુભ મુહૂર્ત)',
    icon: '📈',
    dates: {
      '2026': ['2026-11-14'],
      '2027': ['2027-11-04'],
      '2028': ['2028-11-22']
    },
    title: '📈 Shubh Labh Pancham! Auspicious Business Muhurat',
    greeting: 'May your business and family prosper manifolds with the divine blessings of Shubh & Labh.',
    offer: 'Auspicious day to inaugurate new gold purchases and investments at Gandhidham & Adipur.',
    themeColor: '#7b1122',
    accentColor: '#fcebee'
  },
  {
    id: 'guru_nanak_jayanti',
    name: 'Guru Nanak Jayanti & Dev Diwali',
    nameHindi: 'गुरु नानक जयंती एवं देव दिवाली',
    nameGujarati: 'ગુરુ નાનક જયંતિ અને દેવ દિવાળી',
    icon: '✨',
    dates: {
      '2026': ['2026-11-24'],
      '2027': ['2027-11-14'],
      '2028': ['2028-12-02']
    },
    title: '✨ Gurpurab Di Lakh Lakh Vadhaiyan & Shubh Dev Diwali',
    greeting: 'May Guru Nanak Dev Ji inspire your life with truth, compassion, wisdom, and eternal prosperity.',
    offer: 'Pure gold & silver spiritual lockets available at special festive celebration rates.',
    themeColor: '#e0a96d',
    accentColor: '#fbf4ea'
  },
  {
    id: 'new_year',
    name: 'New Year Celebrations',
    nameHindi: 'नववर्ष की शुभकामनाएं',
    nameGujarati: 'નવા વર્ષની શુભેચ્છાઓ',
    icon: '🥂',
    dates: {
      '2026': ['2026-01-01', '2026-12-31'],
      '2027': ['2027-01-01', '2027-12-31'],
      '2028': ['2028-01-01', '2028-12-31']
    },
    title: '🥂 Happy New Year from Shree Aradhna Jewellers!',
    greeting: 'Wishing you a glittering New Year filled with good health, cherished memories, and golden milestones.',
    offer: 'Step into the new year with our latest modern, lightweight everyday gold & diamond collections.',
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

  // Check custom override if set by admin
  try {
    if (typeof window !== 'undefined') {
      const customOverride = localStorage.getItem('SAJ_active_festival_override');
      if (customOverride) {
        const found = INDIAN_FESTIVALS.find(f => f.id === customOverride);
        if (found) {
          return {
            isActive: true,
            isCustomOverride: true,
            festival: found,
            dateStr
          };
        }
      }
    }
  } catch (e) {}

  // Search in festival calendar
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

  // Not today, find next upcoming festival
  const upcoming = getNextUpcomingFestival(targetDate);

  return {
    isActive: false,
    nextFestival: upcoming,
    dateStr
  };
}

/**
 * Finds the next upcoming Indian festival from the given date
 */
export function getNextUpcomingFestival(fromToday = new Date()) {
  const todayStr = getISTDateString(fromToday);
  const currentYear = todayStr.split('-')[0];

  let closestFestival = null;
  let minDiffDays = 9999;

  for (const fest of INDIAN_FESTIVALS) {
    const yearDates = fest.dates[currentYear] || fest.dates[String(Number(currentYear) + 1)] || [];
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
    date: todayStr,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('SAJ_festival_broadcast_history', JSON.stringify(history.slice(0, 50)));

  // Try browser push notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(festival.title, {
        body: `${festival.greeting}\n${festival.offer}`,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        tag: `festival-${festival.id}`
      });
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }

  // Dispatch custom DOM event so website banner reactively updates
  window.dispatchEvent(new CustomEvent('saj_festival_broadcast', { detail: festival }));
  return true;
}
