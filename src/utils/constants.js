import { Dimensions } from "react-native";

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const row = windowWidth - 45;
export const col1 = row / 12;
export const col2 = col1 * 2;
export const col3 = col1 * 3;
export const col4 = col1 * 4;
export const col5 = col1 * 5;
export const col6 = row / 2;
export const col7 = col6 + col1;
export const col8 = col7 + col1;
export const col9 = col8 + col1;
export const col10 = col9 + col1;
export const col11 = col10 + col1;
export const col12 = windowWidth - 40;

export const VERTICAL_MARGIN = windowHeight * 0.022;

export const MAIN_COLORS = {
  like: "#00eda6",
  nope: "#ff006f",
};

export const ACTION_OFFSET = 100;

export const CARD_HEIGHT = windowHeight * 0.7;
export const CARD_WIDTH = windowWidth * 0.85;
export const OUT_OF_SCREEN = windowWidth + 0.9 * windowWidth;

export const mockData = [
  {
    _id: "67b5a7cdcc9d6b8add7a670c",
    about:
      "Hello, I'm soldier boy, fuck the world knows who i am why do i even have to say it",
    age: 24,
    firstName: "Soldier",
    gender: "Male",
    lastName: "Boy",
    photoUrl:
      "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202407/jensen-ackles-will-return-as-soldier-boy-for-vought-rising-credit-getty-images-280243169-16x9_0.jpg?VersionId=YG9v_ZTz_tdnitx.j2yxuFMqVamMqd_V&size=690:388",
    skills: ["Node Js", "React Js", "Javascript", "Database"],
  },
  {
    _id: "67b4a3809e7e66133c40c409",
    about: "You guys are the real hero",
    age: 32,
    firstName: "Home",
    gender: "Male",
    lastName: "Lander",
    photoUrl:
      "https://www.tvinsider.com/wp-content/uploads/2019/08/the-boys-homelander-1014x570.jpg",
    skills: ["Node Js", "React Js", "Javascript", "Database"],
  },
  {
    _id: "67acd5938cd9de01342e15f5",
    age: 21,
    firstName: "Viraj",
    gender: "Male",
    lastName: "Ranpise",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },

  {
    _id: "67b5a9660099fec6812c6fec",
    age: 37,
    firstName: "Virat",
    gender: "Male",
    lastName: "Kohli",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
  {
    _id: "67b5a9820099fec6812c6fee",
    age: 37,
    firstName: "Yashasvi",
    gender: "Male",
    lastName: "Jaiswal",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
  {
    _id: "67b5a99c0099fec6812c6ff0",
    age: 37,
    firstName: "Brock",
    gender: "Male",
    lastName: "Lesnar",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
  {
    _id: "67b5a9b00099fec6812c6ff2",
    age: 37,
    firstName: "John",
    gender: "Male",
    lastName: "Cena",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
  {
    _id: "67b5a9c80099fec6812c6ff4",
    age: 37,
    firstName: "Nikki",
    gender: "Male",
    lastName: "Bella",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
  {
    _id: "67b5a9e60099fec6812c6ff6",
    age: 37,
    firstName: "Pat",
    gender: "Male",
    lastName: "Cummins",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
  {
    _id: "67b5a9f70099fec6812c6ff8",
    age: 37,
    firstName: "Travis",
    gender: "Male",
    lastName: "Head",
    photoUrl:
      "https://www.shutterstock.com/shutterstock/photos/2247726673/display_1500/stock-vector-user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-neutral-gender-2247726673.jpg",
    skills: [],
  },
];

export const SKILLS = [
  "Python",
  "TypeScript",
  "JavaScript",
  "Rust",
  "Go",
  "Java",
  "SQL",
  "React & Next.js",
  "Node.js",
  "FastAPI",
  "Docker & Containerization",
  "Kubernetes (K8s)",
  "Infrastructure as Code (Terraform)",
  "CI/CD Pipelines",
  "Cloud Platforms (AWS/Azure/GCP)",
  "Prompt Engineering",
  "Agentic AI Development",
  "LLM API Integration",
  "Vector Databases (Pinecone/Milvus)",
  "RAG (Retrieval-Augmented Generation)",
  "System Design & Architecture",
  "Microservices",
  "API Design (REST/GraphQL)",
  "Secure Coding (OWASP)",
  "Cybersecurity Basics",
  "Git & Version Control",
  "Mobile Dev (Flutter/React Native)",
  "Performance Optimization",
  "Unit & Integration Testing",
  "Soft Skills (Communication/Agile)",
];

export const developerInterests = [
  "Mechanical Tinkering & Customization",
  "Typography & UI Design",
  "Home Lab & Server Self-hosting",
  "Film Photography",
  "Bouldering",
  "Specialty Coffee Brewing",
  "Custom Mechanical Keyboards",
  "Chess & Grand Strategy Games",
  "Sourdough & Artisanal Baking",
  "Open Source Contribution",
  "Urban Exploration & Hiking",
  "3D Printing & CAD Modeling",
  "Modular Synthesizers",
  "Hydroponics",
  "Tabletop RPGs (D&D)",
  "Woodworking",
  "Personal Finance & Investing",
  "Digital Illustration",
  "Video Game Modding",
  "Language Learning",
  "Yoga & Mindfulness",
  "Audiophile Gear (Hi-Fi)",
  "Amateur Radio (HAM)",
  "Generative Art & Shaders",
  "Sustainable Tech/Solar DIY",
  "Competitive E-sports",
  "Pottery & Ceramics",
  "Biohacking",
  "Astrophotography",
  "Philosophy & Tech Ethics",
];
