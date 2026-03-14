import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Text,
  ActivityIndicator,
} from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACTION_OFFSET,
  CARD_HEIGHT,
  mockData,
  OUT_OF_SCREEN,
} from "../utils/constants";
import Screen from "../components/Screen";
import FooterButton from "../components/FooterButton";
import UserCard from "../components/UserCard";
import { useSelector } from "react-redux";
import useFeedData from "../hooks/useFeedData";

export default function TinderPage() {
  const [feedData, setFeedData] = useState(mockData);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltSign = useRef(new Animated.Value(1)).current;
  const topCardRef = useRef(null);
  const { data, isLoading, error } = useFeedData();

  console.log("Fetched feed data :: ", data);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      swipe.setValue({ x: dx, y: dy });
      tiltSign.setValue(y0 > CARD_HEIGHT / 2 ? 1 : -1);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > ACTION_OFFSET;

      if (isActionActive) {
        console.log("isActionActive ", isActionActive, " ", direction);

        Animated.timing(swipe, {
          duration: 200,
          toValue: {
            x: direction * OUT_OF_SCREEN,
            y: dy,
          },
          useNativeDriver: true,
        }).start(justRemove);
      } else {
        console.log("Not active");

        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const justRemove = () => {
    console.log("Remove");

    setFeedData((prevState) => {
      const newState = prevState.slice(1);
      console.log(
        "Updated state: ",
        newState.map((x) => x.firstName + " " + x.lastName),
      );
      return newState;
    });
    swipe.setValue({ x: 0, y: 0 }); // ✅ Reset swipe after removing
  };

  const removeTopCard = useCallback(() => {
    console.log("Invoked Remove user cards");
    // setFeedData((prevState) => prevState.slice(1));
    setFeedData((prevState) => {
      const newState = prevState.slice(1);
      console.log(
        "Updated state: ",
        newState.map((x) => x.firstName + " " + x.lastName),
      );
      return newState;
    });

    // swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1D232A",
      alignItems: "center",
      zIndex: 10,
    },
  });

  const handleChoice = useCallback(
    (direction) => {
      console.log("Hell yeah");
      topCardRef.current?.swipeOut(direction);

      Animated.timing(swipe.x, {
        toValue: direction * OUT_OF_SCREEN,
        duration: 400,
        useNativeDriver: true,
      }).start(removeTopCard);
    },
    [removeTopCard, swipe.x],
  );

  useEffect(() => {
    if (feedData?.length === 0) {
      setFeedData(mockData);
    }
  }, [feedData]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  if (error) {
    return (
      <Text className="text-red-500 text-center text-lg p-4 mt-10">
        Error loading feed
      </Text>
    );
  }
  if (!feedData) return;

  return (
    <Screen style={styles.container}>
      {/* <View className="flex-row items-center flex-wrap space-x-2 px-2 py-2">
        {feedData
          ?.map((x, i) => (
            <Text
              key={i}
              className="text-center text-yellow-400 font-bold p-2 text-wrap"
            >
              {x.firstName}
            </Text>
          ))
          .reverse()}
      </View> */}

      {feedData
        ?.map((user, index) => {
          const isFirst = index === 0;
          // const isFirst = user._id === feedData[0]?._id;

          const dragHandlers = isFirst ? panResponder.panHandlers : {};

          return (
            <View key={user?._id}>
              {
                <UserCard
                  user={user}
                  isFirst={isFirst}
                  index={index}
                  // swipe={swipe}
                  // {...dragHandlers}
                  tiltSign={tiltSign}
                  onRemove={removeTopCard}
                  ref={isFirst ? topCardRef : null}
                />
              }
            </View>
          );
        })
        .reverse()}

      <FooterButton handleChoice={handleChoice} />
    </Screen>
  );
}
