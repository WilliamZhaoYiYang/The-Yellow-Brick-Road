export const JOURNEYS = [
    {
        id: '1',
        title: 'The Yellow Brick Road',
        image: require('../assets/journeyImages/ybr-0.jpg'),
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
        title: 'The Fellowship of the Ring',
        image: require('../assets/journeyImages/lotr-0.jpg'),
        totalSteps: 2330000,
        goal: 'Mount Doom',
        bannerItems: [
            {
                id: 'lotr-1',
                unlockedAfterSteps: 0,
                title: 'An Unexpected Journey',
                image: require('../assets/journeyImages/lotr-1.jpg'),
                detail: 'The round green door closes behind you. Your pack feels heavier than expected. Inside, the fire is still warm, the kettle still on the hook. But the road is calling.\n' +
                'You take one last look at the smoke curling from the chimney. Gandalf said you\'d be back. You\'re not so sure.\n' +
                'No going back now.'
            },
            {
                id: 'lotr-2',
                unlockedAfterSteps: 50000,
                title: 'The Black Rider',
                image: require('../assets/journeyImages/lotr-2.png'),
                detail: 'The lane is quiet in the cool purples of dusk. Too quiet.\n' +
                'On the crest of the hill you see a black shape on a black horse. The figure stops, sniffing the air, its face hidden by a black robe.\n' +
                'You duck behind an old oak on the banks of the road, heart pounding. You wait until the hoofbeats fade. Then you run.'
            },
            {
                id: 'lotr-3',
                unlockedAfterSteps: 80000,
                title: 'Lost in the Old Forest',
                image: require('../assets/journeyImages/lotr-3.png'),
                detail: 'To avoid the black riders, you decided to take the path through The Old Forest.\n' +
                'The trees lean in close. Their roots twist across the path like knuckles. Every step feels watched.\n' +
                'You\'ve passed that same crooked birch three times now. Or maybe it\'s a different one.\n' +
                'A branch creaks behind you. You spin back. Nothing.\n' +
                'The forest is herding you. But where? You pull your cloak tighter and keep walking. The only way out is through.'
            },
            {
                id: 'lotr-4',
                unlockedAfterSteps: 130000,
                title: 'At Bree',
                image: require('../assets/journeyImages/lotr-4.png'),
                detail: 'The gate looms high and dark. A creaking sign sways in the moonlight: BREE. ' +
                'Lamplight spills from the Prancing Pony\'s windows. Hoof-churned mud, voices rumbling inside, the smell of woodsmoke and ale. You pull your hood lower and slip through the gate.\n' +
                'The gatekeeper nods but doesn\'t smile.\n' +
                '\"You\'ll want a room before dark," he mutters. "Strangers aren\'t the only ones on the road tonight.\"\n' +
                'You hurry towards the inn.'
            },
            {
                id: 'lotr-5',
                unlockedAfterSteps: 350000,
                title: 'Attack at Weathertop',
                image: require('../assets/journeyImages/lotr-5.jpg'),
                detail: 'The crown of the hill is cold and broken old stones and older bones. Five shadows rise from the dark, hoods empty, voices like rusted knives.\n' +
                'Pain. Cold like drowning. A shard of ice drives into your shoulder. You swing your own blade blindly and they scatter. For now.\n' +
                'Strider finds you slumped against the stones, \"They stabbed you with a Morgul blade,\" hey says. \"We must hurry. The wound will not wait.\"'
            },
            {
                id: 'lotr-6',
                unlockedAfterSteps: 800000,
                title: 'A Short Rest',
                image: require('../assets/journeyImages/lotr-6.png'),
                detail: 'The pass is barely clinging to the cliff. Your legs give out just as the last bridge comes into view: horses, banners, the sound of falling water. Elven hands catch you before you fall.\n' +
                'You wake in a soft bed. Sunlight through carved stone. A voice tells you the river rose like a galloping herd, the waves sweeping the Black Riders away. Gone. Drowned. The Nine are no more.\n' +
                'You touch your shoulder. The wound is cool now, almost healed. You let out a sigh, you\'re safe for the first time in many weeks.'
            },
            {
                id: 'lotr-7',
                unlockedAfterSteps: 2000000,
                title: 'The Pass of Caradhras',
                image: require('../assets/journeyImages/lotr-7.png'),
                detail: 'The air thins to a knife\'s edge. Snow swirls within the dark clouds surrounding two jagged peaks. Caradhras the Cruel, the dwarves call it.\n' +
                'Your boots crunch through fresh powder. Every breath hurts. Behind you, the lowlands have vanished. Ahead is only white and rock and wind that screams like the voices of the damned trapped on these peaks.'
            },
            {
                id: 'lotr-8',
                unlockedAfterSteps: 2100000,
                title: 'At the Gates of Moria',
                image: require('../assets/journeyImages/lotr-8.png'),
                detail: 'Caradhras defeated you. Snow buried the path, wind howled you back, and the mountain itself seemed to shove you down.\n' +
                'Now you stand before a sheer cliff wall. In the dim light, two great trees carved from ancient stone flank a doorway that has no door. Faint silver lines trace a design—a star, an anvil, a hammer.\n' +
                '\"Speak, friend, and enter,\" Gandalf murmurs, studying the letters. The gate says nothing back.\n' +
                'Somewhere beneath your boots, a whole world sleeps in darkness.'
            },
            {
                id: 'lotr-9',
                unlockedAfterSteps: 2200000,
                title: 'Mirrormere',
                image: require('../assets/journeyImages/lotr-9.jpg'),
                detail: 'Moria took him. The bridge crumbled. The fiery beast fell—and Gandalf with it. You ran not daring to look back. The drums echoed in your skull for three days.\n' +
                'Now you kneel beside still water. Mirrormere. The lake is so clear it holds the stars upside down, even in daylight. Snow-capped peaks stare back at you from the depths.\n' +
                'Behind you, the others wait in silence. Ahead, the woods of Lothlórien. But here, just for a breath, the world holds still.\n' +
                'You wish he could have seen this.'
            },
            {
                id: 'lotr-10',
                unlockedAfterSteps: 2250000,
                title: 'Meeting in Lothlórien',
                image: require('../assets/journeyImages/lotr-10.png'),
                detail: 'The trees part like curtains. Silvered light spills through gilded leaves. Above you, platforms of white wood nestle in the branches, a city built atop the trees.\n' +
                'An elf descends from above, robes pale as moonlight.\n' +
                '\"The Lady Galadriel awaits,\" she says softly. \"Lay down your burden. No evil enters here.\"\n' +
                'The air smells of honey and rain. A single yellow leaf drifts gently onto your shoulder. You follow the light.'
            },
            {
                id: 'lotr-11',
                unlockedAfterSteps: 2300000,
                title: 'The Pillars of Kings',
                image: require('../assets/journeyImages/lotr-11.png'),
                detail: 'The river narrowed and the cliffs rose up. Two colossal kings carved from stone, their outstretched hands raised palm forward in a silent warning, or perhaps a welcome, that had endured for thousands of years.\n' +
                'Your boat drifted between them, small and silent, and you felt the weight of that gaze pressing down like a hand on your chest.'
            },
            {
                id: 'lotr-12',
                unlockedAfterSteps: 2330000,
                title: 'The Breaking of the Fellowship',
                image: require('../assets/journeyImages/lotr-12.png'),
                detail: 'The horn of Boromir sounded, and then everything fell apart. You watched as the fellowship collapse, the others going willingly, or unwillingly, their own way.\n' +
                'You stand at the eastern edge of the forest, the Emyn Muil rising grey and unforgiving ahead. Mordor is out there, waiting. You grip the Ring beneath your shirt, feel its weight like a stone around your neck, and step forward into the empty land.'
            },
        ],
    },
    {
        id: '3',
        title: 'Tongariro Alpine Crossing',
        image: require('../assets/journeyImages/tac-0.jpg'),
        totalSteps: 35000,
        goal: 'Ketetahi Car Park',
        bannerItems: [
            {
                id: 'tac-1',
                unlockedAfterSteps: 0,
                title: 'Mangatepopo Car Park',
                image: require('../assets/journeyImages/tac-1.jpg'),
                detail: 'You begin at the Mangatepopo car park, the volcanic peak of Ngāuruhoe looming dark against the sky. The track stretches roughly 20 kilometres of exposed, breathtaking terrain. This is no gentle stroll. This is walking through the bones of the earth.',
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