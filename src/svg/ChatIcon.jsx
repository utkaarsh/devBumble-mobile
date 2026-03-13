import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ChatIcon = ({ color = "#949494", ...props }) => (
  <Svg
    width={26}
    height={25}
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M23.502 12.5002C23.502 18.2356 18.8525 22.8851 13.117 22.8851C10.7787 22.8851 8.62087 22.1123 6.88504 20.8081C2.0398 23.2313 1.34746 22.5389 4.1214 17.6926C3.2378 16.1652 2.73208 14.3917 2.73208 12.5002C2.73208 6.76473 7.38158 2.11523 13.117 2.11523C18.8525 2.11523 23.502 6.76473 23.502 12.5002Z"
      fill={color}
    />
  </Svg>
);

export default ChatIcon;
