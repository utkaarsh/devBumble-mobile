import { StyleSheet, View, Animated, PanResponder, Text } from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACTION_OFFSET,
  CARD_HEIGHT,
  data,
  OUT_OF_SCREEN,
} from "../utils/constants";
import Screen from "../components/Screen";
import FooterButton from "../components/FooterButton";
import UserCard from "../components/UserCard";
import { useSelector } from "react-redux";

export default function TinderPage() {
  const [feedData, setFeedData] = useState(data);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltSign = useRef(new Animated.Value(1)).current;
  const topCardRef = useRef(null);

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
    console.log(
      "Feed  logss ",
      feedData?.map((x) => x.firstName + " " + x.lastName),
    );

    if (feedData?.length === 0) {
      setFeedData(data);
    }
  }, [feedData]);

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
