import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { Animated, PanResponder, StyleSheet } from "react-native";
import Choice from "./Choice";
import {
  ACTION_OFFSET,
  CARD_HEIGHT,
  CARD_WIDTH,
  OUT_OF_SCREEN,
  VERTICAL_MARGIN,
} from "../utils/constants";
import ViewProfile from "./ProfileCard";
import { useSendRequest } from "../hooks/useSendRequest";

const UserCard = forwardRef(function UserCard(
  { user, isFirst, tiltSign, onRemove },
  ref,
) {
  const swipe = useRef(new Animated.ValueXY()).current;
  const isSwiped = useRef(false);
  const isSwipingHorizontally = useRef(false);

  const { mutate: sendRequest } = useSendRequest();

  // direction: 1 = right = interested, -1 = left = ignored
  const handleSwipeComplete = useCallback(
    (direction) => {
      const status = direction === 1 ? "interested" : "ignored";
      sendRequest({ status, toUserId: user._id });
      isSwiped.current = true;
      onRemove();
    },
    [user._id, onRemove, sendRequest],
  );

  useImperativeHandle(
    ref,
    () => ({
      swipeOut(direction) {
        Animated.timing(swipe, {
          toValue: { x: direction * OUT_OF_SCREEN, y: 0 },
          duration: 400,
          useNativeDriver: true,
        }).start(() => handleSwipeComplete(direction));
      },
    }),
    [handleSwipeComplete],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,

        onMoveShouldSetPanResponder: (_, { dx, dy }) => {
          const isHorizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8;
          isSwipingHorizontally.current = isHorizontal;
          return isHorizontal;
        },

        onMoveShouldSetPanResponderCapture: (_, { dx, dy }) =>
          Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8,

        onPanResponderMove: (_, { dx, dy }) => {
          swipe.setValue({ x: dx, y: dy });
        },

        onPanResponderRelease: (_, { dx, dy }) => {
          isSwipingHorizontally.current = false;
          const isActionActive = Math.abs(dx) > ACTION_OFFSET;
          const direction = Math.sign(dx);

          if (isActionActive) {
            Animated.timing(swipe, {
              toValue: { x: direction * OUT_OF_SCREEN, y: dy },
              duration: 200,
              useNativeDriver: true,
            }).start(() => handleSwipeComplete(direction));
          } else {
            Animated.spring(swipe, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
            }).start();
          }
        },

        onPanResponderTerminationRequest: () => false,
      }),
    [handleSwipeComplete],
  );

  const rotate = useMemo(
    () =>
      Animated.multiply(swipe.x, tiltSign).interpolate({
        inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
        outputRange: ["8deg", "0deg", "-8deg"],
      }),
    [tiltSign],
  );

  const likeOpacity = useMemo(
    () =>
      swipe.x.interpolate({
        inputRange: [25, ACTION_OFFSET],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [],
  );

  const nopeOpacity = useMemo(
    () =>
      swipe.x.interpolate({
        inputRange: [-ACTION_OFFSET, -25],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [],
  );

  const animatedCardStyle = useMemo(
    () => ({
      transform: [...swipe.getTranslateTransform(), { rotate }],
    }),
    [rotate],
  );

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

  if (!user) return null;
  if (isSwiped.current) return null;

  return (
    <Animated.View
      style={[styles.container, isFirst && animatedCardStyle]}
      {...(isFirst ? panResponder.panHandlers : {})}
    >
      <ViewProfile
        data={user}
        isFeedCard
        isSwipingHorizontally={isSwipingHorizontally}
      />
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
    overflow: "scroll",
    backgroundColor: "#000",
    justifyContent: "flex-end",
    zIndex: 20,
  },
  likeContainer: {
    left: 45,
    transform: [{ rotate: "-30deg" }],
  },
  nopeContainer: {
    right: 45,
    transform: [{ rotate: "30deg" }],
  },
  choiceContainer: {
    position: "absolute",
    top: 100,
    zIndex: 20,
  },
});

export default UserCard;
