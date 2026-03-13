import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Choice from "./Choice";
import {
  ACTION_OFFSET,
  CARD_HEIGHT,
  CARD_WIDTH,
  OUT_OF_SCREEN,
  VERTICAL_MARGIN,
} from "../utils/constants";

const UserCard = forwardRef(function UserCard(
  { user, isFirst, index, tiltSign, onRemove },
  ref,
) {
  if (!user) return null;

  const { photoUrl, firstName, lastName, age, skills } = user;

  const swipe = useRef(new Animated.ValueXY()).current;

  // ✅ Tracks if this card has been flung off screen
  const isSwiped = useRef(false);

  // ✅ Expose swipeOut so parent (FooterButton) can trigger it
  useImperativeHandle(ref, () => ({
    swipeOut(direction) {
      Animated.timing(swipe, {
        toValue: { x: direction * OUT_OF_SCREEN, y: 0 },
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        isSwiped.current = true;
        onRemove();
      });
    },
  }));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      swipe.setValue({ x: dx, y: dy });
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const isActionActive = Math.abs(dx) > ACTION_OFFSET;
      const direction = Math.sign(dx);

      if (isActionActive) {
        Animated.timing(swipe, {
          toValue: { x: direction * OUT_OF_SCREEN, y: dy },
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // ✅ Mark swiped BEFORE onRemove so the card
          //    returns null on the re-render triggered by state change
          isSwiped.current = true;
          onRemove();
          // ❌ Removed swipe.setValue({ x: 0, y: 0 }) — this was the flash
        });
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // ✅ If already swiped away, bail out before rendering anything
  if (isSwiped.current) return null;

  const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ["8deg", "0deg", "-8deg"],
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [25, ACTION_OFFSET],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-ACTION_OFFSET, -25],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };

  const renderChoice = useCallback(
    () => (
      <>
        <Animated.View
          style={[
            styles.choiceContainer,
            styles.likeContainer,
            { opacity: likeOpacity },
          ]}
        >
          <Choice type="like" />
        </Animated.View>
        <Animated.View
          style={[
            styles.choiceContainer,
            styles.nopeContainer,
            { opacity: nopeOpacity },
          ]}
        >
          <Choice type="nope" />
        </Animated.View>
      </>
    ),
    [likeOpacity, nopeOpacity],
  );

  return (
    <Animated.View
      style={[styles.container, isFirst && animatedCardStyle]}
      {...(isFirst ? panResponder.panHandlers : {})}
    >
      <Image source={{ uri: photoUrl }} style={styles.image} />
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.9)"]}
        style={styles.gradient}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.textTitle}>
          {firstName} {lastName}, {age}
        </Text>
        <Text style={styles.text}>{skills.join(", ")}</Text>
      </View>

      {isFirst && renderChoice()}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: VERTICAL_MARGIN,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    margin: 10,
    alignSelf: "center",
    borderRadius: 35,
    overflow: "hidden",
    justifyContent: "flex-end",
    zIndex: 20,
  },
  infoContainer: {
    padding: 10,
    bottom: 10,
    height: 100,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  likeContainer: {
    left: 45,
    transform: [{ rotate: "-30deg" }],
  },
  nopeContainer: {
    right: 45,
    transform: [{ rotate: "30deg" }],
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    borderRadius: 35,
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
  textTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: -20,
  },
  choiceContainer: {
    position: "absolute",
    top: 100,
    zIndex: 20,
  },
});

export default UserCard;
