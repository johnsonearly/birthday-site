import type { BirthdayContent } from './types'

/**
 * ✦ EDIT ME ✦
 * Everything personal lives here. Swap names, messages and photos
 * without touching any component.
 *
 * Photos: drop files into public/assets/<folder>/ using the same filenames
 * (or change the paths below). Missing images fall back to a tasteful placeholder.
 */
const HER_NAME = 'Ijeoma'
const MY_NAME = 'Johnson'

export const content: BirthdayContent = {
  herName: HER_NAME,
  myName: MY_NAME,
  heading: `Happy Birthday, ${HER_NAME}`,
  introSubtitle: 'A little universe dedicated to someone extraordinary.',
  introCta: 'ENTER MY UNIVERSE',

  // Optional soundtrack — put a file in public/assets/audio/ and set the path.
  audio: '/assets/audio/soundtrack.mp3',

  // Every file in public/assets/intro/. Frames follow each photo's natural aspect ratio.
  introPhotos: [
    { src: '/assets/intro/IMG_8722.JPG', alt: `${HER_NAME} smiling, resting her cheek on her hand`, focus: '50% 45%' },
    { src: '/assets/intro/IMG_8726.JPG', alt: 'Two friends posing in a sunlit courtyard', focus: '55% 62%' },
    { src: '/assets/intro/IMG_8727.JPG', alt: 'Two friends pulling playful faces in a selfie', focus: '50% 45%' },
    { src: '/assets/intro/IMG_8728.JPG', alt: 'Three friends smiling and making peace signs', focus: '50% 45%' },
     { src: '/assets/intro/IMG_8752.JPG', alt: 'Ijeoma in cultural attire', focus: '50% 30%' },
    // This file is a screenshot with black bars above and below — crop them away.
    { src: '/assets/intro/IMG_8729.JPG', alt: `${HER_NAME} standing in warm sunlight by a doorway`, crop: { x: 0, y: 0.307, w: 1, h: 0.39 }, focus: '50% 55%' },
  ],

  gallery: {
    heading: 'A whole universe of beautiful moments.',
    subtitle: 'And somehow, every star reminds me of you.',
    // Every file in public/assets/gallery/.
    photos: [
      { src: '/assets/gallery/IMG_8720.JPG', alt: 'Two friends smiling together outdoors', caption: 'The day everything felt easy', note: '', focus: '50% 55%' },
      { src: '/assets/gallery/IMG_8721.JPG', alt: `${HER_NAME} in an orange top, a soft tilted selfie`, caption: 'That quiet, effortless glow', note: '', focus: '55% 40%' },
      { src: '/assets/gallery/IMG_8723.JPG', alt: `${HER_NAME} with her eyes closed, smiling in golden light`, caption: 'Golden hour, golden you', note: '', focus: '45% 45%' },
      { src: '/assets/gallery/IMG_8724.JPG', alt: `${HER_NAME} standing smiling in front of a tree`, caption: 'Main character energy', note: '', focus: '55% 55%' },
      { src: '/assets/gallery/IMG_8725.JPG', alt: `${HER_NAME} smiling warmly at the camera`, caption: 'A smile I keep close', note: '', focus: '50% 40%' },
    ],
  },

  letter: {
    heading: 'A little something from me to you.',
    paragraphs: [
      `Dear ${HER_NAME},`,
      'Today is about celebrating you.',
      'I hope you never forget how special you are and how much joy you bring into the lives of the people around you.',
      'I hope this new chapter brings you beautiful opportunities, unforgettable memories, genuine happiness and everything your heart quietly wishes for.',
      'You deserve to experience life in its most beautiful forms.',
      'Thank you for being you.',
      'Happy Birthday!',
    ],
    signoff: 'With love,',
    closing: MY_NAME,
  },

  friends: {
    heading: "You're loved more than you know.",
    subtitle: 'A few words from the people who make life beautiful with you.',
    // avatar: '' shows a placeholder. Set e.g. '/assets/friends/ada.jpg' once you add the file.
    list: [
       { name: 'Blairr your lover🤭❤️', relationship: '', avatar: '', message: 'Happy birthday my babyyy,my sweetheart,my wonderful friend wishing you long life and prosperity. Thank youu for all your support, love, care, attention everything literally you’re always there for me and that’s something really rare to find in a friendship. Whenever I think about the friendships I had in FA or even all the friends I’ve had in this life it just always occur to me that nobody has been as sweet as you(I’m sure you’re feeling cringe already😂) thank you for being such a darling and good friend to me, you know whenever you call me fake or a betrayal and I tell you that I’m everything to you except that I genuinely mean it cuz hmm😂but whatever Happy birthday to my content creator,my roomie🤭,my smart! Friend your head is hot ehnn if you weren’t my friend I wonder what I’d be doing with my life chaii,my golden girl😂😂and my babyy have a great day mll Muahh.💋🌹' },
      { name: 'Blossom', relationship: '', avatar: '', message: 'Happy birthday obi,I want to honestly wish you the very best year of your life.i want you to know that you are loved and cherished.Never lose your pretty smile🩷' },
      { name: 'Hope', relationship: '', avatar: '', message: 'Happy birthday my love, I pray God grants you more wisdom, knowledge and understanding, I love you so much❤️, and I’m so grateful for our friendship it means a lot to me I pray that we will continue to grow in Jesus name, enjoy your day o, have fun don’t be like me. I love youuuuuu!.' },
      { name: 'Joyeee 😘🙃🙃 Evero', relationship: '', avatar: '', message: 'Obi you are one of the nicest persons i have ever met, you are very very beautiful, pretty, smart, funny🙃🙃🙃, cute ........ a very good social director🌚🌚... I want to wish you a very happy birthday from the bottom of my heart and i pray that as you have seen this birthday, you will see the next in wisdom, strength, knowledge IJN, i pray that the number of your days you will fulfil and you sha continue to grow in Gods wisdom and continue to impact the lives around you..... i want to say more prayers... but........ anyways enjoy your day😘❤️🌹.' },
      { name: 'Your mama🙂💕💕', relationship: '', avatar: '', message: 'Don’t forget that you’re doing your best and that’s enough. Take a moment to appreciate yourself and all you’ve accomplished, big or small. You’re worthy of love and happiness❤️ i’m always here for you💋hagd baby girl👩‍❤️‍💋‍👩💗💗i love youuuu💐' },
      { name: 'Peculiar ', relationship: '', avatar: '', message: 'Obi Favour ijeoma is a very very fine sweet and happy girl, she’s intelligent, bold and smart Always thinking good about people I love her so much 🥹🥹🥰🥹🫂🥹❤️'},
      { name: 'Duru chisomebi christabel ', relationship: '', avatar: '', message: 'Obi is a very independent lady. She is very smart,adamant, intelligent and beautiful. She brings joy to everyone amongst her and most importantly she is my cute baby🥰😍 .Happy birthday my love 💓  I love you so much  enjoy your day my princess I want you to never loose your spark always keep on shining my princess.'},
    ],
  },

  finale: {
    lead: 'One thing I hope you never forget...',
    paragraphs: [
      'You make this world a little more beautiful simply by being in it.',
      'Here’s to another year of becoming, growing, laughing and making beautiful memories.',
    ],
    closingLine: `Happy Birthday, ${HER_NAME}!`,
  },
}
