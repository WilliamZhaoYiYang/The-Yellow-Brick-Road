export const JOURNEYS = [
    {
        id: '1',
        title: 'The Yellow Brick Road',
        image: 'https://picsum.photos/seed/yellowbrick/800/450',
        totalSteps: 250000,
        goal: 'The Emerald City',
        description: 'A magical journey through the land of Oz. The road is paved and mostly flat, winding through poppy fields, enchanted forests, and friendly villages.' +
        'Expect whimsical encounters around every corner, but watch out for flying monkeys!',
        bannerItems: [
            {
                id: 'ybr-1',
                unlockedAfterSteps: 0,
                title: 'The Journey Begins',
                image: require('../assets/journeyImages/ybr-1.png'),
                detail: "The last thing you remember was the dreadful tornado carrying your house away from everyone you knew in little old Kansas.\n" +
                "When you woke up you found yourself in the land of Oz! The yellow brick road stretches ahead, leading towards the Emerald City.\n" +
                "With nothing but a pair of red slippers and the advice of the munchkins, you set off down the yellow brick road." 
            },
            {
                id: 'ybr-2',
                unlockedAfterSteps: 50000,
                title: 'You Met The Scarecrow',
                image: require('../assets/journeyImages/ybr-2.jpg'),
                detail: 'After 50,000 steps you\'ve come across a scarecrow longing for a brain. He swings down from his post and joins you, hoping that by walking beside you, he might pick up a few clever thoughts along the way. ',
            },
            {
                id: 'ybr-3',
                unlockedAfterSteps: 60000,
                title: 'The Scarecrow\'s Riddle',
                image: require('../assets/journeyImages/ybr-3.jpg'),
                detail: 'After an hour of walking, the scarecrow taps his burlap head.\n' + 
                '\"I found a riddle inside me. What has keys but no locks, space but no room, and you can enter but never leave?\"\n' + 
                'You think for a moment, maybe you can solve the riddle after another 10,000 steps?'
            },
            {
                id: 'ybr-4',
                unlockedAfterSteps: 70000,
                title: 'The Riddle Solved',
                image: require('../assets/journeyImages/ybr-4.jpg'),
                detail: 'You walked in silence for a bit, thinking. The scarecrow watches you with his painted on eyes.\n' +
                '\"A Keyboard,\" you say finally.\n' + 
                'The scarecrow grins at you with his stitched on mouth. \"I feel smarter already.\"'
            },
            {
                id: 'ybr-5',
                unlockedAfterSteps: 100000,
                title: 'The Tin Man Joins You',
                image: require('../assets/journeyImages/ybr-5.png'),
                detail: 'Halfway through the forest you find a rusted tin man, frozen in place. His joints screech as you help him move.\n' +
                '\"I\'ve stood here for years,\" he says\, \"waiting for a heart. May I walk with you?\"\n' +
                'You help oil his limbs and he falls in beside you, every creaky step sounding a little cheerful already.\n'
            },
            {
                id: 'ybr-6',
                unlockedAfterSteps: 150000,
                title: 'The Lion Wants Courage',
                image: require('../assets/journeyImages/ybr-6.jpg'),
                detail: 'A thunderous roar shakes the path and a lion leaps out... to immediately stumble over his own paws.\n' +
                '\"I-I\'m sorry!\" he whimpers, tail between his legs. \"I try to act as a lion should but I\'m neither brave enough nor good at it.\"\n' + 
                'You offer a hand. He peeks through his paws.\n' +
                'You find your party has grown with another new friend.'
            },
            {
                id: 'ybr-7',
                unlockedAfterSteps: 190000,
                title: 'The Poppy Field',
                image: require('../assets/journeyImages/ybr-7.jpg'),
                detail: 'The path vanishes into a sea of glowing red poppies. Their scent is sweet... too sweet.\n' +
                'The lion yawns. \"Just... a little nap...\" He stumbles.\n' +
                'The scarecrow waves a straw hand. \"Stay awake! It\'s a witches curse!\"\n' +
                'You grab the lion\'s paw and drag him forward, step by heavy step. The tin man clanks ahead.\n'
            },
            {
                id: 'ybr-8',
                unlockedAfterSteps: 200000,
                title: 'Out Of The Poppy Field',
                image: require('../assets/journeyImages/ybr-8.jpg'),
                detail: 'After almost two hours the air clears.\n' +
                'The lion shakes himself awake. \"I almost gave up, but you didn\'t.\"\n' +
                'You keep walking, now a little more determined.'
            },
            {
                id: 'ybr-9',
                unlockedAfterSteps: 230000,
                title: 'The Emerald City Awaits',
                image: require('../assets/journeyImages/ybr-9.png'),
                detail: 'The glittering spires of the Emerald City are visible on the horizon, looming huge against a violet sky.\n' +
                'You\'re almost there.'
            },
        ],
    },
    {
        id: '2',
        title: 'The Shire to Mordor',
        image: 'https://picsum.photos/seed/mordor/800/450',
        totalSteps: 4000000,
        goal: 'Mount Doom',
        bannerItems: [
            {
                id: 'lotr-1',
                unlockedAfterSteps: 0,
                title: 'Leaving the Shire',
                image: 'https://picsum.photos/seed/lotr1/600/300',
                detail: 'The Shire disappears behind you as you set off on the most important journey in Middle-earth. The road goes ever on and on.',
            },
            {
                id: 'lotr-2',
                unlockedAfterSteps: 500000,
                title: 'Weathertop',
                image: 'https://picsum.photos/seed/lotr2/600/300',
                detail: 'You\'ve reached the ruins of Amon Sûl. The Nazgûl struck here, but the Fellowship pressed on. So do you.',
            },
            {
                id: 'lotr-3',
                unlockedAfterSteps: 1200000,
                title: 'The Mines of Moria',
                image: 'https://picsum.photos/seed/lotr3/600/300',
                detail: 'Deep beneath the mountains you walk where dwarves once thrived. You shall not pass... but you did.',
            },
            {
                id: 'lotr-4',
                unlockedAfterSteps: 2000000,
                title: 'Lothlórien',
                image: 'https://picsum.photos/seed/lotr4/600/300',
                detail: 'The golden forest of the elves offers rest and counsel. Galadriel\'s mirror shows many things — but your path forward is clear.',
            },
            {
                id: 'lotr-5',
                unlockedAfterSteps: 3000000,
                title: 'The Plains of Gorgoroth',
                image: 'https://picsum.photos/seed/lotr5/600/300',
                detail: 'The desolate wastes of Mordor surround you. Every step here is a feat of will. Mount Doom burns in the distance.',
            },
        ],
    },
    {
        id: '3',
        title: 'Route 66',
        image: 'https://picsum.photos/seed/route66/800/450',
        totalSteps: 1400000,
        goal: 'Santa Monica Pier',
        bannerItems: [
            {
                id: 'r66-1',
                unlockedAfterSteps: 0,
                title: 'Chicago: Mile Zero',
                image: 'https://picsum.photos/seed/r661/600/300',
                detail: 'You\'re standing at the start of the Mother Road in Chicago. Nearly 2,500 miles of American highway stretch west to the Pacific Ocean.',
            },
            {
                id: 'r66-2',
                unlockedAfterSteps: 280000,
                title: 'St. Louis Gateway Arch',
                image: 'https://picsum.photos/seed/r662/600/300',
                detail: 'The iconic arch marks the Gateway to the West. You\'ve crossed Missouri and the great Mississippi River lies behind you.',
            },
            {
                id: 'r66-3',
                unlockedAfterSteps: 560000,
                title: 'Oklahoma Heartland',
                image: 'https://picsum.photos/seed/r663/600/300',
                detail: 'Rolling plains and roadside diners define this stretch. Route 66 was a lifeline for Dust Bowl migrants heading west — now it\'s yours too.',
            },
            {
                id: 'r66-4',
                unlockedAfterSteps: 980000,
                title: 'Grand Canyon Country',
                image: 'https://picsum.photos/seed/r664/600/300',
                detail: 'Arizona\'s red rock landscape surrounds you. The Grand Canyon sits just to the north — one of the natural wonders of the world.',
            },
            {
                id: 'r66-5',
                unlockedAfterSteps: 1250000,
                title: 'Mojave Desert',
                image: 'https://picsum.photos/seed/r665/600/300',
                detail: 'The Californian desert stretches endlessly. The heat shimmers off the asphalt, but Santa Monica and the ocean are almost within reach.',
            },
        ],
    },
];