import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ProfileIcon = ({ color = "#949494", ...props }) => (
  <Svg
    width={26}
    height={25}
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18.8272 6.27036C18.8272 9.93485 16.2316 12.6764 12.9871 12.6493C9.76967 12.6493 7.14704 9.93485 7.14704 6.27036C7.14704 2.85016 9.76967 0 12.9871 0C16.2316 0 18.8272 2.85016 18.8272 6.27036Z"
      fill={color}
    />
    <Path
      d="M23.1803 25H2.79401C1.82066 25 1.33398 24.3214 1.33398 23.4256C1.33398 20.9012 5.01108 14.468 12.9871 14.468C20.9632 14.468 24.6673 20.9012 24.6673 23.4256C24.6673 24.3214 24.1536 25 23.1803 25Z"
      fill={color}
    />
  </Svg>
);

export default ProfileIcon;
