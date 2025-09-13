// Word list data for Who's The Spy game
const WORD_LIST = [
  {
    "topic": "Animals",
    "civilian": "Horse",
    "spy": "Donkey"
  },
  {
    "topic": "Tech",
    "civilian": "Linux",
    "spy": "Unix"
  },
  {
    "topic": "Fruits",
    "civilian": "Orange",
    "spy": "Mandarin"
  },
  {
    "topic": "Food",
    "civilian": "Pizza",
    "spy": "Calzone"
  },
  {
    "topic": "Music",
    "civilian": "Jazz",
    "spy": "Blues"
  },
  {
    "topic": "Sports",
    "civilian": "Cricket",
    "spy": "Baseball"
  },
  {
    "topic": "Tech",
    "civilian": "Chrome",
    "spy": "Firefox"
  },
  {
    "topic": "Sports",
    "civilian": "Formula 1",
    "spy": "NASCAR"
  },
  {
    "topic": "Fruits",
    "civilian": "Watermelon",
    "spy": "Cantaloupe"
  },
  {
    "topic": "Movies",
    "civilian": "Avatar",
    "spy": "Aquaman"
  },
  {
    "topic": "Landmarks",
    "civilian": "Big Ben",
    "spy": "Leaning Tower of Pisa"
  },
  {
    "topic": "Food",
    "civilian": "Coffee",
    "spy": "Tea"
  },
  {
    "topic": "Countries",
    "civilian": "India",
    "spy": "Pakistan"
  },
  {
    "topic": "Movies",
    "civilian": "Titanic",
    "spy": "Poseidon"
  },
  {
    "topic": "Music",
    "civilian": "R&B",
    "spy": "Soul"
  },
  {
    "topic": "Countries",
    "civilian": "Spain",
    "spy": "Portugal"
  },
  {
    "topic": "Music",
    "civilian": "Classical",
    "spy": "Opera"
  },
  {
    "topic": "Landmarks",
    "civilian": "Niagara Falls",
    "spy": "Victoria Falls"
  },
  {
    "topic": "Countries",
    "civilian": "France",
    "spy": "Italy"
  },
  {
    "topic": "Landmarks",
    "civilian": "Eiffel Tower",
    "spy": "Tokyo Tower"
  },
  {
    "topic": "Sports",
    "civilian": "Golf",
    "spy": "Mini Golf"
  },
  {
    "topic": "Animals",
    "civilian": "Dog",
    "spy": "Wolf"
  },
  {
    "topic": "Food",
    "civilian": "Fried Rice",
    "spy": "Biryani"
  },
  {
    "topic": "Fruits",
    "civilian": "Grapes",
    "spy": "Raisins"
  },
  {
    "topic": "Sports",
    "civilian": "Boxing",
    "spy": "Wrestling"
  },
  {
    "topic": "Countries",
    "civilian": "UK",
    "spy": "Ireland"
  },
  {
    "topic": "Landmarks",
    "civilian": "Pyramids of Giza",
    "spy": "Chichen Itza"
  },
  {
    "topic": "Food",
    "civilian": "Sushi",
    "spy": "Sashimi"
  },
  {
    "topic": "Music",
    "civilian": "K-Pop",
    "spy": "J-Pop"
  },
  {
    "topic": "Animals",
    "civilian": "Tiger",
    "spy": "Leopard"
  },
  {
    "topic": "Countries",
    "civilian": "Germany",
    "spy": "Austria"
  },
  {
    "topic": "Food",
    "civilian": "Bread",
    "spy": "Baguette"
  },
  {
    "topic": "Countries",
    "civilian": "Russia",
    "spy": "Ukraine"
  },
  {
    "topic": "Landmarks",
    "civilian": "Mount Everest",
    "spy": "K2"
  },
  {
    "topic": "Animals",
    "civilian": "Lion",
    "spy": "Cheetah"
  },
  {
    "topic": "Sports",
    "civilian": "Football",
    "spy": "Rugby"
  },
  {
    "topic": "Landmarks",
    "civilian": "Colosseum",
    "spy": "Roman Forum"
  },
  {
    "topic": "Movies",
    "civilian": "Star Wars",
    "spy": "Star Trek"
  },
  {
    "topic": "Movies",
    "civilian": "The Godfather",
    "spy": "Goodfellas"
  },
  {
    "topic": "Animals",
    "civilian": "Elephant",
    "spy": "Mammoth"
  },
  {
    "topic": "Tech",
    "civilian": "Python",
    "spy": "Java"
  },
  {
    "topic": "Movies",
    "civilian": "Toy Story",
    "spy": "Finding Nemo"
  },
  {
    "topic": "Music",
    "civilian": "Country",
    "spy": "Folk"
  },
  {
    "topic": "Tech",
    "civilian": "Facebook",
    "spy": "Instagram"
  },
  {
    "topic": "Countries",
    "civilian": "China",
    "spy": "Japan"
  },
  {
    "topic": "Animals",
    "civilian": "Whale",
    "spy": "Orca"
  },
  {
    "topic": "Tech",
    "civilian": "Windows",
    "spy": "MacOS"
  },
  {
    "topic": "Music",
    "civilian": "EDM",
    "spy": "Techno"
  },
  {
    "topic": "Landmarks",
    "civilian": "Statue of Liberty",
    "spy": "Christ the Redeemer"
  },
  {
    "topic": "Food",
    "civilian": "Burger",
    "spy": "Sandwich"
  },
  {
    "topic": "Animals",
    "civilian": "Frog",
    "spy": "Toad"
  },
  {
    "topic": "Tech",
    "civilian": "TikTok",
    "spy": "Reels"
  },
  {
    "topic": "Landmarks",
    "civilian": "Sydney Opera House",
    "spy": "Burj Khalifa"
  },
  {
    "topic": "Food",
    "civilian": "Ice Cream",
    "spy": "Gelato"
  },
  {
    "topic": "Animals",
    "civilian": "Cat",
    "spy": "Lynx"
  },
  {
    "topic": "Music",
    "civilian": "Rap",
    "spy": "Hip Hop"
  },
  {
    "topic": "Fruits",
    "civilian": "Pineapple",
    "spy": "Guava"
  },
  {
    "topic": "Animals",
    "civilian": "Shark",
    "spy": "Dolphin"
  },
  {
    "topic": "Landmarks",
    "civilian": "Great Wall of China",
    "spy": "Hadrian's Wall"
  },
  {
    "topic": "Food",
    "civilian": "Taco",
    "spy": "Burrito"
  },
  {
    "topic": "Movies",
    "civilian": "Spiderman",
    "spy": "Superman"
  },
  {
    "topic": "Movies",
    "civilian": "Avengers",
    "spy": "Justice League"
  },
  {
    "topic": "Countries",
    "civilian": "South Korea",
    "spy": "North Korea"
  },
  {
    "topic": "Fruits",
    "civilian": "Strawberry",
    "spy": "Raspberry"
  },
  {
    "topic": "Countries",
    "civilian": "Brazil",
    "spy": "Argentina"
  },
  {
    "topic": "Fruits",
    "civilian": "Banana",
    "spy": "Plantain"
  },
  {
    "topic": "Sports",
    "civilian": "Hockey",
    "spy": "Lacrosse"
  },
  {
    "topic": "Food",
    "civilian": "Pasta",
    "spy": "Noodles"
  },
  {
    "topic": "Movies",
    "civilian": "Batman",
    "spy": "Iron Man"
  },
  {
    "topic": "Tech",
    "civilian": "Twitter",
    "spy": "Threads"
  },
  {
    "topic": "Sports",
    "civilian": "Volleyball",
    "spy": "Beach Volleyball"
  },
  {
    "topic": "Music",
    "civilian": "Reggae",
    "spy": "Ska"
  },
  {
    "topic": "Tech",
    "civilian": "YouTube",
    "spy": "Vimeo"
  },
  {
    "topic": "Landmarks",
    "civilian": "Taj Mahal",
    "spy": "Golden Temple"
  },
  {
    "topic": "Fruits",
    "civilian": "Mango",
    "spy": "Papaya"
  },
  {
    "topic": "Music",
    "civilian": "Metal",
    "spy": "Punk"
  },
  {
    "topic": "Tech",
    "civilian": "Google",
    "spy": "Bing"
  },
  {
    "topic": "Animals",
    "civilian": "Eagle",
    "spy": "Hawk"
  },
  {
    "topic": "Music",
    "civilian": "Pop",
    "spy": "Rock"
  },
  {
    "topic": "Movies",
    "civilian": "Frozen",
    "spy": "Moana"
  },
  {
    "topic": "Tech",
    "civilian": "iPhone",
    "spy": "Samsung Galaxy"
  },
  {
    "topic": "Movies",
    "civilian": "Inception",
    "spy": "Interstellar"
  },
  {
    "topic": "Sports",
    "civilian": "Basketball",
    "spy": "Netball"
  },
  {
    "topic": "Fruits",
    "civilian": "Apple",
    "spy": "Pear"
  },
  {
    "topic": "Food",
    "civilian": "Cake",
    "spy": "Brownie"
  },
  {
    "topic": "Sports",
    "civilian": "Tennis",
    "spy": "Badminton"
  },
  {
    "topic": "Fruits",
    "civilian": "Plum",
    "spy": "Cherry"
  },
  {
    "topic": "Fruits",
    "civilian": "Peach",
    "spy": "Apricot"
  },
  {
    "topic": "Countries",
    "civilian": "USA",
    "spy": "Canada"
  },
  {
    "topic": "Sports",
    "civilian": "Kabaddi",
    "spy": "Wrestling"
  }
];

// Function to get random word pair by category
function getRandomWordPair(category = 'all') {
    let filteredWords = WORD_LIST;
    
    if (category !== 'all') {
        filteredWords = WORD_LIST.filter(word => word.topic.toLowerCase() === category.toLowerCase());
    }
    
    if (filteredWords.length === 0) {
        // Fallback to all words if category is empty
        filteredWords = WORD_LIST;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex];
}

// Function to get all available categories
function getCategories() {
    const categories = [...new Set(WORD_LIST.map(word => word.topic.toLowerCase()))];
    return categories.sort();
}
