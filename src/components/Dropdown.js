import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const DROPDOWN_GAP = 6;
const SCREEN_MARGIN = 8;
const DEFAULT_MAX_HEIGHT = 250;
const MIN_DROPDOWN_HEIGHT = 80;

export default function Dropdown({
  options = [],
  value,
  onChange,

  label,
  placeholder = "Select",

  disabled = false,

  maxHeight = DEFAULT_MAX_HEIGHT,

  // How the dropdown should behave when there isn't
  // enough room on either side.
  preferDirection = "down",

  // Object helpers
  getOptionLabel = (item) => item?.label ?? "",
  getOptionValue = (item) => item?.value,

  // Custom option UI
  renderOption,

  // Optional custom empty state
  emptyComponent,

  // Optional classNames
  containerClassName = "",
  triggerClassName = "",
  menuClassName = "",
}) {
  const triggerRef = useRef(null);

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);

  const [triggerLayout, setTriggerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [direction, setDirection] = useState("down");

  /*
   * ------------------------------------------------------
   * Selected option
   * ------------------------------------------------------
   */

  const selectedOption = useMemo(() => {
    return options.find((item) => getOptionValue(item) === value);
  }, [options, value, getOptionValue]);

  /*
   * ------------------------------------------------------
   * Close dropdown
   * ------------------------------------------------------
   */

  const closeDropdown = useCallback(() => {
    setVisible(false);
  }, []);

  /*
   * ------------------------------------------------------
   * Calculate available space
   * ------------------------------------------------------
   */

  const calculateDirection = useCallback(
    (y, height) => {
      const topBoundary = insets.top + SCREEN_MARGIN;

      const bottomBoundary = windowHeight - insets.bottom - SCREEN_MARGIN;

      const spaceAbove = y - topBoundary;

      const spaceBelow = bottomBoundary - (y + height);

      /*
       * Maximum amount of space the dropdown
       * would ideally like to use.
       */

      const desiredHeight = Math.min(maxHeight, options.length * 48);

      /*
       * Enough room below?
       */

      const enoughSpaceBelow =
        spaceBelow >= Math.max(desiredHeight, MIN_DROPDOWN_HEIGHT);

      /*
       * Enough room above?
       */

      const enoughSpaceAbove =
        spaceAbove >= Math.max(desiredHeight, MIN_DROPDOWN_HEIGHT);

      /*
       * --------------------------------------------------
       * Decision
       * --------------------------------------------------
       */

      if (enoughSpaceBelow && enoughSpaceAbove) {
        /*
         * Both directions are good.
         *
         * Use user's preference.
         */

        return preferDirection;
      }

      if (enoughSpaceBelow) {
        return "down";
      }

      if (enoughSpaceAbove) {
        return "up";
      }

      /*
       * Neither side has enough space.
       *
       * Use whichever side has more room.
       */

      return spaceBelow >= spaceAbove ? "down" : "up";
    },
    [
      insets.top,
      insets.bottom,
      windowHeight,
      maxHeight,
      options.length,
      preferDirection,
    ],
  );

  /*
   * ------------------------------------------------------
   * Measure trigger
   * ------------------------------------------------------
   */

  const measureTrigger = useCallback(
    (showDropdown = false) => {
      if (!triggerRef.current) return;

      triggerRef.current.measureInWindow((x, y, width, height) => {
        /*
         * Keep dropdown horizontally inside screen.
         */

        const safeWidth = Math.min(width, windowWidth - SCREEN_MARGIN * 2);

        const safeX = Math.max(
          SCREEN_MARGIN,
          Math.min(x, windowWidth - safeWidth - SCREEN_MARGIN),
        );

        const calculatedDirection = calculateDirection(y, height);

        setTriggerLayout({
          x: safeX,
          y,
          width: safeWidth,
          height,
        });

        setDirection(calculatedDirection);

        if (showDropdown) {
          setVisible(true);
        }
      });
    },
    [windowWidth, calculateDirection],
  );

  /*
   * ------------------------------------------------------
   * Open dropdown
   * ------------------------------------------------------
   */

  const openDropdown = useCallback(() => {
    if (disabled) return;

    /*
     * Hide keyboard before measuring.
     *
     * Keyboard changes available screen space.
     */

    Keyboard.dismiss();

    /*
     * Wait one frame so the keyboard can start
     * disappearing before measuring.
     */

    requestAnimationFrame(() => {
      measureTrigger(true);
    });
  }, [disabled, measureTrigger]);

  /*
   * ------------------------------------------------------
   * Select option
   * ------------------------------------------------------
   */

  const handleSelect = useCallback(
    (item) => {
      const selectedValue = getOptionValue(item);

      onChange?.(selectedValue, item);

      closeDropdown();
    },
    [getOptionValue, onChange, closeDropdown],
  );

  /*
   * ------------------------------------------------------
   * Close when keyboard opens
   * ------------------------------------------------------
   */

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", closeDropdown);

    return () => {
      subscription.remove();
    };
  }, [closeDropdown]);

  /*
   * ------------------------------------------------------
   * Recalculate when dimensions change
   * ------------------------------------------------------
   */

  useEffect(() => {
    if (!visible) return;

    requestAnimationFrame(() => {
      measureTrigger(false);
    });
  }, [
    windowHeight,
    windowWidth,
    insets.top,
    insets.bottom,
    visible,
    measureTrigger,
  ]);

  /*
   * ------------------------------------------------------
   * Dropdown position
   * ------------------------------------------------------
   */

  const menuTop =
    direction === "down"
      ? triggerLayout.y + triggerLayout.height + DROPDOWN_GAP
      : undefined;

  const menuBottom =
    direction === "up"
      ? windowHeight - triggerLayout.y + DROPDOWN_GAP
      : undefined;

  /*
   * ------------------------------------------------------
   * Available menu height
   * ------------------------------------------------------
   */

  const availableSpace =
    direction === "down"
      ? windowHeight -
        insets.bottom -
        SCREEN_MARGIN -
        (triggerLayout.y + triggerLayout.height + DROPDOWN_GAP)
      : triggerLayout.y - insets.top - SCREEN_MARGIN - DROPDOWN_GAP;

  const menuHeight = Math.max(0, Math.min(maxHeight, availableSpace));

  /*
   * ------------------------------------------------------
   * Render
   * ------------------------------------------------------
   */

  return (
    <>
      {/* ================================================= */}
      {/* TRIGGER                                           */}
      {/* ================================================= */}

      <View className={`w-full ${containerClassName}`}>
        {label && (
          <Text
            className="
              mb-2
              text-sm
              font-medium
              text-gray-700
            "
          >
            {label}
          </Text>
        )}

        <Pressable
          ref={triggerRef}
          onPress={visible ? closeDropdown : openDropdown}
          disabled={disabled}
          className={`
            min-h-[48px]
            w-full
            flex-row
            items-center
            justify-between
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            ${disabled ? "bg-gray-100 opacity-50" : "active:bg-gray-50"}
            ${triggerClassName}
          `}
        >
          {/* Selected value */}

          <Text
            numberOfLines={1}
            className={`
              flex-1
              text-base
              ${selectedOption ? "text-gray-900" : "text-gray-400"}
            `}
          >
            {selectedOption ? getOptionLabel(selectedOption) : placeholder}
          </Text>

          {/* Arrow */}

          <Text
            className="
              ml-3
              text-sm
              text-gray-500
            "
          >
            {visible ? "▲" : "▼"}
          </Text>
        </Pressable>
      </View>

      {/* ================================================= */}
      {/* DROPDOWN                                         */}
      {/* ================================================= */}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDropdown}
      >
        <View className="flex-1">
          {/* ============================================= */}
          {/* OUTSIDE CLICK                                 */}
          {/* ============================================= */}

          <Pressable className="absolute inset-0" onPress={closeDropdown} />

          {/* ============================================= */}
          {/* MENU                                          */}
          {/* ============================================= */}

          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",

              left: triggerLayout.x,

              top: menuTop,

              bottom: menuBottom,

              width: triggerLayout.width,

              /*
               * Don't let menu become taller than
               * the available screen space.
               */

              maxHeight: menuHeight,

              /*
               * Android elevation
               */

              elevation: 12,

              /*
               * iOS shadow
               */

              shadowColor: "#000",

              shadowOffset: {
                width: 0,
                height: 4,
              },

              shadowOpacity: 0.18,

              shadowRadius: 10,

              /*
               * Keep it above the trigger.
               */

              zIndex: 9999,
            }}
            className={`
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              ${menuClassName}
            `}
          >
            {options.length === 0 ? (
              (emptyComponent ?? (
                <View className="items-center justify-center p-5">
                  <Text className="text-gray-500">No options available</Text>
                </View>
              ))
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item, index) =>
                  String(getOptionValue(item) ?? index)
                }
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  const itemValue = getOptionValue(item);

                  const selected = itemValue === value;

                  return (
                    <Pressable
                      onPress={() => handleSelect(item)}
                      className={`
                        min-h-[48px]
                        w-full
                        flex-row
                        items-center
                        px-4
                        ${selected ? "bg-gray-100" : "bg-white"}
                        active:bg-gray-100
                      `}
                    >
                      {renderOption ? (
                        renderOption({
                          item,
                          index,
                          selected,
                        })
                      ) : (
                        <View className="flex-1 flex-row items-center justify-between">
                          <Text
                            numberOfLines={1}
                            className={`
                              flex-1
                              text-base
                              ${
                                selected
                                  ? "font-semibold text-gray-900"
                                  : "text-gray-700"
                              }
                            `}
                          >
                            {getOptionLabel(item)}
                          </Text>

                          {selected && (
                            <Text className="ml-3 text-gray-900">✓</Text>
                          )}
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
