export const TOURNAMENT_INFO = {
    name: 'Thengaha Night Cricket Tournament',
    nameHindi: 'ठेंगहा नाइट क्रिकेट टूर्नामेंट',
    organizer: 'KCC',
    organizerFull: 'Kamal Cricket Club',
    organizerHindi: 'कमल क्रिकेट क्लब',
    presents: 'KCC Presents',
    season: 'Season 2',
    seasonHindi: 'सीज़न 2',
    year: 2026,
    tagline: 'माइनस बाउंड्री नाइट क्रिकेट टूर्नामेंट',
    description:
        'संग्रामपुर क्षेत्र के ठेंगहा में बहुप्रतीक्षित ठेंगहा नाइट क्रिकेट टूर्नामेंट का शुभारंभ 14 मार्च से होने जा रहा है।',
    startDate: '2026-03-14',
    startDateHindi: '14 मार्च 2026',
    lastRegistrationDate: '10 मार्च 2026',
    lastRegistrationDateEn: 'March 10, 2026',
    entryFee: 2500,
    entryFeeDisplay: '₹2,500',
    venue: 'ठेंगहा, संग्रामपुर',
    venueEn: 'Thengaha, Sangrampur',
    totalPlayers: 12,
    rosterPlayers: 11,
    playingPlayers: 9,
    substitutes: 3,
    maxTeams: 32,
    offlinePaymentAddress: 'MAA AMBEY ELECTRONICS, SHRIRAM MARKET, THENGAHA, AMETHI',
    locationLink: 'https://maps.app.goo.gl/3KGXxbTFCJg5hFNm7?g_st=aw',
};

export const CONTACTS = {
    entry: [
        { name: 'पुलक मिश्र', nameEn: 'Pulak Mishra', phone: '9984671212' },
        { name: 'संजीव शर्मा', nameEn: 'Sanjeev Sharma', phone: '7905505001' },
    ],
    info: [
        { name: 'अनुपम मिश्र', nameEn: 'Anupam Mishra', phone: '9670906666' },
        { name: 'हनुमान प्रसाद मिश्र', nameEn: 'Hanuman Prasad Mishra', phone: '9984610610' },
        { name: 'सोनू मौर्य', nameEn: 'Sonu Maurya', phone: '7007746313' },
    ],
    primary: '9670906666',
};

export const PRIZES = [
    {
        title: 'प्रथम पुरस्कार',
        titleEn: '1st Prize',
        amount: '₹51,000',
        icon: '🏆',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/30',
        textColor: 'text-amber-700 dark:text-amber-400',
    },
    {
        title: 'द्वितीय पुरस्कार',
        titleEn: '2nd Prize',
        amount: '₹31,000',
        icon: '🥈',
        bg: 'bg-slate-50 dark:bg-slate-500/10',
        border: 'border-slate-200 dark:border-slate-500/30',
        textColor: 'text-slate-700 dark:text-slate-300',
    },
    {
        title: 'मैन ऑफ द सीरीज़',
        titleEn: 'Man of the Series',
        amount: '₹11,000',
        icon: '🌟',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/30',
        textColor: 'text-emerald-700 dark:text-emerald-400',
    },
];

export const SPECIAL_AWARDS = [
    { title: 'बेस्ट फील्डर', titleEn: 'Best Fielder', amount: '₹1,100', icon: '🏃' },
    { title: 'बेस्ट बॉलर', titleEn: 'Best Bowler', amount: '₹1,100', icon: '🎯' },
    { title: 'बेस्ट बैट्समैन', titleEn: 'Best Batsman', amount: '₹1,100', icon: '🏏' },
    { title: 'बेस्ट दर्शक', titleEn: 'Best Spectator', amount: '₹500', icon: '👏' },
    { title: 'बेस्ट अंपायर', titleEn: 'Best Umpire', amount: '₹500', icon: '⚖️' },
];

export const RULES = [
    'माइनस बाउंड्री प्रारूप',
    'प्रत्येक टीम में 12 खिलाड़ी (9 प्लेइंग + 3 सबस्टीट्यूट)',
    'प्रत्येक खिलाड़ी का नाम और आधार नंबर अनिवार्य',
    'एक आधार नंबर से केवल एक ही टीम में रजिस्ट्रेशन',
    'एंट्री फीस ₹2,500 पूरी जमा करना अनिवार्य',
    'कुल 32 टीमों की सीमा - पहले आओ, पहले पाओ',
    'रजिस्ट्रेशन की अंतिम तिथि 10 मार्च',
    'टूर्नामेंट 14 मार्च से प्रारंभ',
    'नाइट मैच - फ्लडलाइट में',
    'ऑर्गनाइज़र का निर्णय अंतिम होगा',
];

export const GALLERY_IMAGES = Array.from({ length: 39 }, (_, i) => {
    const num = String(i + 2).padStart(4, '0');
    return `/gallery/IMG-20260221-WA${num}.jpg`;
});

export const HIGHLIGHT_VIDEO_YT = 'https://www.youtube.com/embed/zFAg-Yxg8ek';

export const UTR_GUIDES = [
    {
        app: 'Google Pay (GPay)',
        icon: '💳',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/20',
        steps: [
            'पेमेंट करने के बाद ✅ Success स्क्रीन देखें',
            '"Transaction Details" या "View Receipt" पर क्लिक करें',
            'UPI Ref No. / UTR Number दिखेगा (e.g. 425698741258)',
            'इस 12 अंकों के नंबर को कॉपी करें',
        ],
    },
    {
        app: 'PhonePe',
        icon: '💜',
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        border: 'border-purple-200 dark:border-purple-500/20',
        steps: [
            'पेमेंट के बाद ✅ Success स्क्रीन पर "UPI Ref ID" देखें',
            'या History → Transaction पर क्लिक करें',
            '"UTR" या "UPI Reference Number" कॉपी करें',
            'यह 12 अंकों का नंबर होता है',
        ],
    },
    {
        app: 'Paytm',
        icon: '💙',
        color: 'text-cyan-600 dark:text-cyan-400',
        bg: 'bg-cyan-50 dark:bg-cyan-500/10',
        border: 'border-cyan-200 dark:border-cyan-500/20',
        steps: [
            'पेमेंट के बाद "Payment Successful" स्क्रीन देखें',
            '"Transaction ID" पर क्लिक करें',
            'या Passbook → UPI → Transaction Details में जाएं',
            '"UPI Ref No" (12 अंक) कॉपी करें',
        ],
    },
];
