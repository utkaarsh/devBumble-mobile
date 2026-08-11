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
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DROPDOWN_GAP = 10;
const SCREEN_MARGIN = 8;
const DEFAULT_MAX_HEIGHT = 288;
const OPTION_HEIGHT = 48;

const Field = ({
  label,
  icon,
  placeholder,
  value,
  fieldKey,
  setFieldValue,
  setFieldTouched,
  error,
  touched,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "none",
  rightIcon,
  onRightIconPress,
  focusedField,
  setFocusedField,
  style = {},
  // Dropdown
  type = "text",
  options = [],
  isMultiSelect = false,

  // Optional dropdown configuration
  dropdownMaxHeight = DEFAULT_MAX_HEIGHT,
}) => {
  const triggerRef = useRef(null);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  /*
   * ------------------------------------------------------
   * STATE
   * ------------------------------------------------------
   */

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [triggerLayout, setTriggerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [dropdownDirection, setDropdownDirection] = useState("down");

  /*
   * ------------------------------------------------------
   * BASIC FLAGS
   * ------------------------------------------------------
   */

  const focused = focusedField === fieldKey;

  const isActive = isDropdown ? open : focused;
  const hasError = !!(error && touched);

  const isDropdown = type === "dropdown";

  const isMulti = isDropdown && isMultiSelect;

  /*
   * ------------------------------------------------------
   * VALUE HANDLING
   * ------------------------------------------------------
   */

  const selectedValues = isMulti ? (Array.isArray(value) ? value : []) : value;

  /*
   * ------------------------------------------------------
   * OPTION HELPERS
   *
   * Supports:
   *
   * "React"
   *
   * OR
   *
   * {
   *   label: "React",
   *   value: "react"
   * }
   * ------------------------------------------------------
   */

  const getLabel = useCallback((item) => {
    if (typeof item === "string") {
      return item;
    }

    return item?.label ?? "";
  }, []);

  const getValue = useCallback((item) => {
    if (typeof item === "string") {
      return item;
    }

    return item?.value;
  }, []);

  /*
   * ------------------------------------------------------
   * CHECK WHETHER TWO OPTIONS ARE THE SAME
   * ------------------------------------------------------
   *
   * This is important because:
   *
   * selectedValues.includes(item)
   *
   * only works reliably when the exact same object
   * reference is being used.
   *
   * Comparing values is safer.
   * ------------------------------------------------------
   */

  const isOptionSelected = useCallback(
    (item) => {
      const itemValue = getValue(item);

      if (isMulti) {
        return selectedValues.some(
          (selectedItem) => getValue(selectedItem) === itemValue,
        );
      }

      return getValue(value) === itemValue;
    },
    [getValue, isMulti, selectedValues, value],
  );

  /*
   * ------------------------------------------------------
   * SELECTED OPTION
   * ------------------------------------------------------
   */

  const selectedOption = useMemo(() => {
    if (isMulti) return null;

    return options.find((item) => getValue(item) === getValue(value));
  }, [options, value, isMulti, getValue]);

  /*
   * ------------------------------------------------------
   * SEARCH
   * ------------------------------------------------------
   */

  const filteredOptions = useMemo(() => {
    if (options.length <= 10) {
      return options;
    }

    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((item) =>
      getLabel(item).toLowerCase().includes(query),
    );
  }, [options, search, getLabel]);

  /*
   * ------------------------------------------------------
   * CLOSE DROPDOWN
   * ------------------------------------------------------
   */

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  /*
   * ------------------------------------------------------
   * CALCULATE OPENING DIRECTION
   * ------------------------------------------------------
   */

  const calculateDirection = useCallback(
    (y, height) => {
      const topBoundary = insets.top + SCREEN_MARGIN;

      const bottomBoundary = windowHeight - insets.bottom - SCREEN_MARGIN;

      const spaceAbove = y - topBoundary;

      const spaceBelow = bottomBoundary - (y + height);

      /*
       * Approximate required dropdown height.
       *
       * We don't actually need the exact height.
       * This gives us a good estimate.
       */

      const requiredHeight = Math.min(
        dropdownMaxHeight,
        Math.max(OPTION_HEIGHT, filteredOptions.length * OPTION_HEIGHT),
      );

      const enoughSpaceBelow = spaceBelow >= requiredHeight;

      const enoughSpaceAbove = spaceAbove >= requiredHeight;

      /*
       * Prefer DOWN when both directions
       * have enough space.
       */

      if (enoughSpaceBelow && enoughSpaceAbove) {
        return "down";
      }

      /*
       * Only enough space below.
       */

      if (enoughSpaceBelow) {
        return "down";
      }

      /*
       * Only enough space above.
       */

      if (enoughSpaceAbove) {
        return "up";
      }

      /*
       * Neither side has enough space.
       *
       * Pick the side with more room.
       */

      return spaceBelow >= spaceAbove ? "down" : "up";
    },
    [
      insets.top,
      insets.bottom,
      windowHeight,
      dropdownMaxHeight,
      filteredOptions.length,
    ],
  );

  /*
   * ------------------------------------------------------
   * MEASURE FIELD
   * ------------------------------------------------------
   */

  const measureTrigger = useCallback(
    (shouldOpen = false) => {
      if (!triggerRef.current) {
        return;
      }

      triggerRef.current.measureInWindow((x, y, width, height) => {
        /*
         * Make sure dropdown doesn't go
         * outside the left/right screen edges.
         */

        const safeWidth = Math.min(width, windowWidth - SCREEN_MARGIN * 2);

        const safeX = Math.max(
          SCREEN_MARGIN,
          Math.min(x, windowWidth - safeWidth - SCREEN_MARGIN),
        );

        const direction = calculateDirection(y, height);

        setTriggerLayout({
          x: safeX,
          y,
          width: safeWidth,
          height,
        });

        setDropdownDirection(direction);

        if (shouldOpen) {
          setOpen(true);
        }
      });
    },
    [windowWidth, calculateDirection],
  );

  /*
   * ------------------------------------------------------
   * OPEN DROPDOWN
   * ------------------------------------------------------
   */

  const openDropdown = useCallback(() => {
    if (!isDropdown) {
      return;
    }

    Keyboard.dismiss();

    // Let the current press event finish before
    // mounting the Modal.
    setTimeout(() => {
      measureTrigger(true);
    }, 50);
  }, [isDropdown, measureTrigger]);

  /*
   * ------------------------------------------------------
   * TOGGLE DROPDOWN
   * ------------------------------------------------------
   */

  const handleFieldPress = () => {
    if (!isDropdown) {
      return;
    }

    if (open) {
      closeDropdown();
      return;
    }

    openDropdown();
  };
  /*
   * ------------------------------------------------------
   * SELECT OPTION
   * ------------------------------------------------------
   */

  const handleSelect = (item) => {
    if (isMulti) {
      const itemValue = getValue(item);

      const exists = selectedValues.some(
        (selectedItem) => getValue(selectedItem) === itemValue,
      );

      let updated;

      if (exists) {
        updated = selectedValues.filter(
          (selectedItem) => getValue(selectedItem) !== itemValue,
        );
      } else {
        updated = [...selectedValues, item];
      }

      setFieldValue(fieldKey, updated);

      /*
       * Multi-select stays open.
       */

      setFieldTouched(fieldKey, true);

      return;
    }

    /*
     * Single select
     */

    setFieldValue(fieldKey, item);

    setFieldTouched(fieldKey, true);

    closeDropdown();
  };

  /*
   * ------------------------------------------------------
   * REMOVE CHIP
   * ------------------------------------------------------
   */

  const removeChip = (item) => {
    const itemValue = getValue(item);

    const updated = selectedValues.filter(
      (selectedItem) => getValue(selectedItem) !== itemValue,
    );

    setFieldValue(fieldKey, updated);
  };

  /*
   * ------------------------------------------------------
   * KEYBOARD
   * ------------------------------------------------------
   *
   * If keyboard appears, close dropdown.
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
   * SCREEN ROTATION / WINDOW SIZE CHANGE
   * ------------------------------------------------------
   *
   * Recalculate position if dropdown is open.
   * ------------------------------------------------------
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      measureTrigger(false);
    });
  }, [
    windowWidth,
    windowHeight,
    insets.top,
    insets.bottom,
    open,
    measureTrigger,
  ]);

  /*
   * ------------------------------------------------------
   * DROPDOWN POSITION
   * ------------------------------------------------------
   */

  const dropdownTop =
    dropdownDirection === "down"
      ? triggerLayout.y + triggerLayout.height + DROPDOWN_GAP + 45
      : undefined;

  const dropdownBottom =
    dropdownDirection === "up"
      ? windowHeight - triggerLayout.y + DROPDOWN_GAP
      : undefined;

  /*
   * ------------------------------------------------------
   * AVAILABLE HEIGHT
   * ------------------------------------------------------
   */

  const availableHeight =
    dropdownDirection === "down"
      ? windowHeight -
        insets.bottom -
        SCREEN_MARGIN -
        (triggerLayout.y + triggerLayout.height + DROPDOWN_GAP)
      : triggerLayout.y - insets.top - SCREEN_MARGIN - DROPDOWN_GAP;

  const actualDropdownHeight = Math.max(
    OPTION_HEIGHT,
    Math.min(dropdownMaxHeight, availableHeight),
  );

  /*
   * ------------------------------------------------------
   * RENDER
   * ------------------------------------------------------
   */

  return (
    <View className="mb-4 mx-2" style={style ?? null}>
      {/* ================================================= */}
      {/* LABEL                                             */}
      {/* ================================================= */}

      <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8695A4]">
        {label}
      </Text>

      {/* ================================================= */}
      {/* FIELD / TRIGGER                                   */}
      {/* ================================================= */}

      <Pressable ref={triggerRef} onPress={handleFieldPress}>
        <View
          className={`
            rounded-xl
            border-2
            bg-[#15191E]
            px-4

            ${
              hasError
                ? "border-[#FF5E7D]"
                : isActive
                  ? "border-[#4A9EFF]"
                  : "border-[#2F3740]"
            }
          `}
        >
          {/* ============================================= */}
          {/* INPUT ROW                                     */}
          {/* ============================================= */}

          <View className="flex-row items-center">
            {/* ICON */}

            <Ionicons
              name={icon}
              size={18}
              color={hasError ? "#FF5E7D" : focused ? "#4A9EFF" : "#5A6677"}
              style={{
                marginRight: 10,
              }}
            />

            {/* =========================================== */}
            {/* NORMAL TEXT INPUT                           */}
            {/* =========================================== */}

            {!isDropdown ? (
              <TextInput
                className="flex-1 py-4 text-base text-[#EFF2F5]"
                placeholder={placeholder}
                placeholderTextColor="#3D4855"
                value={value}
                onChangeText={(val) => setFieldValue(fieldKey, val)}
                onBlur={() => {
                  setFocusedField(null);
                  setFieldTouched(fieldKey, true);
                }}
                onFocus={() => setFocusedField(fieldKey)}
                multiline={fieldKey === "about"}
                textAlignVertical={fieldKey === "about" ? "top" : "center"}
                secureTextEntry={secure}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
              />
            ) : (
              /* ========================================= */
              /* DROPDOWN VALUE                            */
              /* ========================================= */

              <Text
                numberOfLines={1}
                className={`
                  flex-1
                  py-4
                  text-base

                  ${
                    isMulti
                      ? selectedValues.length > 0
                        ? "text-[#EFF2F5]"
                        : "text-[#3D4855]"
                      : selectedOption
                        ? "text-[#EFF2F5]"
                        : "text-[#3D4855]"
                  }
                `}
              >
                {isMulti
                  ? selectedValues.length > 0
                    ? `${selectedValues.length} selected`
                    : placeholder || "Select"
                  : selectedOption
                    ? getLabel(selectedOption)
                    : placeholder || "Select"}
              </Text>
            )}

            {/* =========================================== */}
            {/* RIGHT ICON                                   */}
            {/* =========================================== */}

            {isDropdown ? (
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={18}
                color="#5A6677"
              />
            ) : (
              rightIcon && (
                <TouchableOpacity onPress={onRightIconPress}>
                  <Ionicons name={rightIcon} size={20} color="#5A6677" />
                </TouchableOpacity>
              )
            )}
          </View>

          {/* ================================================= */}
          {/* MULTI SELECT CHIPS                               */}
          {/* ================================================= */}

          {isMulti && selectedValues.length > 0 && (
            <View className="flex-row flex-wrap gap-2 pb-3">
              {selectedValues.map((item, index) => (
                <View
                  key={`${getValue(item)}-${index}`}
                  className="flex-row items-center rounded-full bg-[#2F3740] px-3 py-1"
                >
                  <Text className="mr-1 text-xs text-white">
                    {getLabel(item)}
                  </Text>

                  <TouchableOpacity onPress={() => removeChip(item)}>
                    <Ionicons name="close" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </Pressable>

      {/* ================================================= */}
      {/* SMART DROPDOWN MODAL                             */}
      {/* ================================================= */}

      {isDropdown && (
        <Modal
          visible={open}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={closeDropdown}
        >
          <View className="flex-1">
            {/* =========================================== */}
            {/* OUTSIDE PRESS                               */}
            {/* =========================================== */}

            <Pressable className="absolute inset-0" onPress={closeDropdown} />

            {/* =========================================== */}
            {/* DROPDOWN                                    */}
            {/* =========================================== */}

            <View
              style={{
                position: "absolute",

                left: triggerLayout.x,

                top: dropdownTop,

                bottom: dropdownBottom,

                width: triggerLayout.width,

                maxHeight: actualDropdownHeight,

                elevation: 12,

                shadowColor: "#000",

                shadowOffset: {
                  width: 0,
                  height: 5,
                },

                shadowOpacity: 0.2,

                shadowRadius: 10,

                zIndex: 9999,
              }}
              className="
                overflow-hidden
                rounded-xl
                border
                border-[#2F3740]
                bg-[#15191E]
              "
            >
              {/* ========================================= */}
              {/* SEARCH                                    */}
              {/* ========================================= */}

              {options.length > 10 && (
                <View className="flex-row items-center border-b border-[#2F3740] px-4">
                  <Ionicons name="search" size={17} color="#5A6677" />

                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search..."
                    placeholderTextColor="#3D4855"
                    autoFocus
                    className="flex-1 px-3 py-3 text-base text-white"
                  />
                </View>
              )}

              {/* ========================================= */}
              {/* OPTIONS                                  */}
              {/* ========================================= */}

              <FlatList
                data={filteredOptions}
                keyExtractor={(item, index) =>
                  `${String(getValue(item))}-${index}`
                }
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View className="items-center justify-center p-5">
                    <Text className="text-sm text-[#8695A4]">
                      No options found
                    </Text>
                  </View>
                }
                renderItem={({ item, index }) => {
                  const selected = isOptionSelected(item);

                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleSelect(item)}
                      className="
                        min-h-[48px]
                        flex-row
                        items-center
                        justify-between
                        border-b
                        border-[#2F3740]
                        px-6
                      "
                    >
                      {/* OPTION LABEL */}

                      <Text
                        numberOfLines={1}
                        className={`
                          flex-1
                          text-base

                          ${selected ? "text-[#4A9EFF]" : "text-white"}
                        `}
                      >
                        {getLabel(item)}
                      </Text>

                      {/* SELECTED ICON */}

                      {selected && (
                        <Ionicons
                          name={
                            isMulti ? "checkmark-circle" : "radio-button-on"
                          }
                          size={18}
                          color="#4A9EFF"
                          style={{
                            marginLeft: 10,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* ================================================= */}
      {/* ERROR                                             */}
      {/* ================================================= */}

      {hasError && (
        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons name="alert-circle-outline" size={12} color="#FF5E7D" />

          <Text className="text-xs text-[#FF5E7D]">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Field;
