import { Dimensions } from "react-native";
// Replace the import from react-native-secure-storage with expo-secure-store
import * as SecureStore from "expo-secure-store";

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

export const CARD_HEIGHT = windowHeight * 0.75;
export const CARD_WIDTH = windowWidth * 0.85;
export const OUT_OF_SCREEN = windowWidth + 0.9 * windowWidth;

export const data = [
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
];

export const formatDate = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    y: 31536000,
    mo: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1,
  };

  for (const interval in intervals) {
    const value = Math.floor(seconds / intervals[interval]);
    if (value > 0) {
      return `${value}${interval} ago`;
    }
  }

  return "just now";
}
