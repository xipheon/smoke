/**
 * THE GAMES DATA FILE
 * ===================
 * This is the only file you need to edit to add, remove or update a game.
 * Every entry here automatically shows up on the frontpage (carousel, special
 * offers, tabbed lists, search) and gets its own page at  #/game/<id>.
 *
 * Image paths are relative to the `public/` folder, e.g. a file at
 *   public/games/my-game/header.png
 * is written here as
 *   'games/my-game/header.png'
 *
 * Recommended image sizes (same as Steam's, so things crop nicely):
 *   header      460 x 215   (used in lists and the game page sidebar)
 *   capsule     616 x 353   (used in the big frontpage carousel; optional, falls back to header)
 *   screenshots 1280 x 720  (16:9, as many as you like)
 *
 * Fields:
 *   id               URL-safe unique id (lowercase, dashes). Used in the page URL.
 *   title            Game name.
 *   shortDescription One or two sentences shown under the header image.
 *   description      Array of paragraphs for the "About This Game" section.
 *   developer        Who made it.
 *   publisher        Who "published" it.
 *   releaseDate      'YYYY-MM-DD'. Used for sorting "New & Trending".
 *   comingSoon       true = shows in "Upcoming", download button is disabled.
 *   featured         true = appears in the frontpage carousel.
 *   fakeOriginalPrice  The joke "original price" that gets slashed by 100%.
 *   tags             Array of user-tag strings.
 *   platforms        Any of: 'windows', 'mac', 'linux', 'browser'.
 *   download         { url, size, version } - url is relative to public/ or a full link
 *                    (itch.io, GitHub releases, Google Drive...). null if not available.
 *   systemRequirements  { os, processor, memory, graphics, storage, notes }
 *   reviewSummaryOverride  Optional string to replace the auto-calculated
 *                    "Very Positive" style label.
 *   carouselReason   Optional { headline, detail, icon } for the one fact shown in the
 *                    frontpage carousel (icon: 'chart' | 'star' | 'calendar').
 *                    If left out, it is picked automatically (Top Seller / Now Available / Coming Soon).
 *   reviews          Array of { author, recommended, hours, date, text, helpful, funny }
 */

export const games = [
  {
    id: 'crab-accountant',
    title: 'Crab Accountant',
    shortDescription:
      'File taxes for an entire tide pool. Every client is a crab. Every crab is being audited. You also are a crab.',
    description: [
      'The tide is coming in, and so is tax season. As the only certified accountant on Barnacle Beach, it is up to you to balance the books of hundreds of crustacean clients - with claws that cannot hold a pen.',
      'Deduct seaweed. Depreciate shells. Explain to a hermit crab why moving house every three weeks is not a business expense.',
      'Features over 40 handcrafted tax forms, a fully simulated sand economy, and one (1) seagull who works for the IRS.',
    ],
    developer: 'You (probably)',
    publisher: 'Smoke Self-Publishing Division',
    releaseDate: '2026-09-14',
    comingSoon: false,
    featured: true,
    fakeOriginalPrice: 19.99,
    tags: ['Simulation', 'Crabs', 'Paperwork', 'Relaxing', 'Psychological Horror'],
    platforms: ['windows', 'mac', 'linux'],
    header: 'games/crab-accountant/header.svg',
    capsule: 'games/crab-accountant/capsule.svg',
    screenshots: [
      'games/crab-accountant/screenshot-1.svg',
      'games/crab-accountant/screenshot-2.svg',
      'games/crab-accountant/screenshot-3.svg',
    ],
    download: {
      url: 'downloads/placeholder.txt',
      size: '84 MB',
      version: '1.0.3',
    },
    systemRequirements: {
      os: 'Windows 10+, macOS 12+, or any Linux you have argued about online',
      processor: 'Yes',
      memory: '4 GB RAM (or a very good memory)',
      graphics: 'Anything that can draw a crab',
      storage: '200 MB available space',
      notes: 'Requires a sense of humor and at least one claw.',
    },
    reviews: [
      {
        author: 'xX_CrabLord_Xx',
        recommended: true,
        hours: 47.2,
        date: '2026-09-20',
        text: 'I got audited in real life while playing this. The game prepared me. 10/10 would deduct again.',
        helpful: 412,
        funny: 98,
      },
      {
        author: 'TaxEvasionEnjoyer',
        recommended: true,
        hours: 112.8,
        date: '2026-10-02',
        text: 'The seagull from the IRS is the best villain in gaming. I have nightmares about his little hat.',
        helpful: 233,
        funny: 301,
      },
      {
        author: 'a_real_crab',
        recommended: false,
        hours: 0.4,
        date: '2026-10-11',
        text: 'Offensive. Not every crab works in finance. Some of us are artists.',
        helpful: 87,
        funny: 540,
      },
      {
        author: 'Gerald',
        recommended: true,
        hours: 3.1,
        date: '2026-10-15',
        text: 'Fun game. I do not know what a deduction is but I believe in this crab.',
        helpful: 12,
        funny: 4,
      },
    ],
  },

  {
    id: 'dungeon-of-mild-inconvenience',
    title: 'Dungeon of Mild Inconvenience',
    shortDescription:
      'A roguelike where nothing can kill you, but everything is slightly annoying. The traps are untied shoelaces.',
    description: [
      'Descend into a dungeon where every room has been carefully designed to be just a little bit irritating. The doors stick. The torches flicker at an uncomfortable frequency. The final boss replies-all.',
      'Procedurally generated hallways ensure you will never take the same slightly-too-long path twice.',
      'Permadeath has been replaced with Permasigh.',
    ],
    developer: 'You (probably)',
    publisher: 'Smoke Self-Publishing Division',
    releaseDate: '2026-06-02',
    comingSoon: false,
    featured: true,
    fakeOriginalPrice: 59.99,
    tags: ['Roguelike', 'Dungeon Crawler', 'Annoying', 'Pixel Graphics', 'Difficult (Emotionally)'],
    platforms: ['windows', 'browser'],
    header: 'games/dungeon-of-mild-inconvenience/header.svg',
    capsule: 'games/dungeon-of-mild-inconvenience/capsule.svg',
    screenshots: [
      'games/dungeon-of-mild-inconvenience/screenshot-1.svg',
      'games/dungeon-of-mild-inconvenience/screenshot-2.svg',
      'games/dungeon-of-mild-inconvenience/screenshot-3.svg',
    ],
    download: {
      url: 'downloads/placeholder.txt',
      size: '31 MB',
      version: '0.9.1-beta',
    },
    systemRequirements: {
      os: 'Windows 7 or newer (we are not picky)',
      processor: 'A potato with ambition',
      memory: '2 GB RAM',
      graphics: 'Integrated graphics, or a friend describing the screen to you',
      storage: '100 MB available space',
      notes: 'Patience not included.',
    },
    reviews: [
      {
        author: 'DarkSouls_Veteran',
        recommended: true,
        hours: 230.5,
        date: '2026-06-10',
        text: 'I have beaten every hard game ever made. This one broke me. The door in room 3 just does not open the first time. Masterpiece.',
        helpful: 1022,
        funny: 412,
      },
      {
        author: 'mildly_annoyed',
        recommended: false,
        hours: 15.0,
        date: '2026-07-01',
        text: 'The game is exactly what it says it is and I hate that it is right.',
        helpful: 301,
        funny: 287,
      },
      {
        author: 'speedrun_steve',
        recommended: true,
        hours: 88.8,
        date: '2026-08-19',
        text: 'Current world record: 4 minutes 12 seconds. 3 minutes of that is waiting for the loading screen tip to finish.',
        helpful: 76,
        funny: 190,
      },
    ],
  },

  {
    id: 'space-janitor-3000',
    title: 'Space Janitor 3000',
    shortDescription:
      'The heroes saved the galaxy. Somebody has to clean it. Mop your way across 12 lightly exploded space stations.',
    description: [
      'After every epic space battle, there is a mess. Laser scorch marks. Alien goo. A surprising amount of popcorn. That is where you come in.',
      'Armed with a zero-gravity mop and an unpaid internship, restore the galaxy to a presentable state before the next hero shows up and ruins it again.',
    ],
    developer: 'You (probably)',
    publisher: 'Smoke Self-Publishing Division',
    releaseDate: '2027-02-01',
    comingSoon: true,
    featured: true,
    fakeOriginalPrice: 29.99,
    tags: ['Sci-fi', 'Cleaning', 'Casual', 'Space', 'Unpaid Labor'],
    platforms: ['windows', 'linux'],
    header: 'games/space-janitor-3000/header.svg',
    capsule: 'games/space-janitor-3000/capsule.svg',
    screenshots: [
      'games/space-janitor-3000/screenshot-1.svg',
      'games/space-janitor-3000/screenshot-2.svg',
      'games/space-janitor-3000/screenshot-3.svg',
    ],
    download: null,
    systemRequirements: {
      os: 'Windows 10+, Linux',
      processor: 'Dual core, or two single cores holding hands',
      memory: '4 GB RAM',
      graphics: 'Anything with a fan',
      storage: '500 MB available space',
      notes: 'Mop not included.',
    },
    reviewSummaryOverride: 'No user reviews (it is not out yet, calm down)',
    reviews: [],
  },
];

/** Look up one game by its id. */
export function getGame(id) {
  return games.find((g) => g.id === id);
}
