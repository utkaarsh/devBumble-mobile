import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const LikeIcon = ({ color = "#949494", showRedIcon = false, ...props }) => (
  <Svg
    width={24}
    height={21}
    viewBox="0 0 24 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.0839844 8.08701C0.0839844 4.54378 2.80012 2.02148 6.47358 2.02148C8.87802 2.02148 10.6814 3.26262 11.75 4.98418C12.7964 3.26262 14.6442 2.02148 17.0042 2.02148C20.6776 2.02148 23.416 4.54378 23.416 8.08701C23.416 13.532 16.8261 18.2363 12.9077 20.5183C12.5515 20.7185 12.084 20.9788 11.7723 20.9788C11.4828 20.9788 10.9708 20.7185 10.5923 20.5183C6.62942 18.2763 0.0839844 13.532 0.0839844 8.08701Z"
      fill={color}
    />
    {showRedIcon && (
      <Circle
        cx={20.25}
        cy={4}
        r={2.72913}
        fill="#CD2E10"
        stroke="white"
        strokeWidth={1.45825}
      />
    )}
  </Svg>
);

export default LikeIcon;
