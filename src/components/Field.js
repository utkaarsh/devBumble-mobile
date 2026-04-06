import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  // NEW
  type = "text",
  options = [],
  isMultiSelect = false, // ✅ default false
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const focused = focusedField === fieldKey;
  const hasError = !!(error && touched);

  const isDropdown = type === "dropdown";
  const isMulti = isDropdown && isMultiSelect;

  // ✅ value handling
  const selectedValues = isMulti ? (Array.isArray(value) ? value : []) : value;

  // ✅ search handling (future-proof for object options too)
  const getLabel = (item) => (typeof item === "string" ? item : item.label);

  const filteredOptions =
    options.length > 10
      ? options.filter((item) =>
          getLabel(item).toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  // ✅ select handler
  const handleSelect = (item) => {
    if (isMulti) {
      const exists = selectedValues.includes(item);

      const updated = exists
        ? selectedValues.filter((i) => i !== item)
        : [...selectedValues, item];

      setFieldValue(fieldKey, updated);
    } else {
      setFieldValue(fieldKey, item);
      setOpen(false);
    }

    setFieldTouched(fieldKey, true);
  };

  // ✅ remove chip
  const removeChip = (item) => {
    const updated = selectedValues.filter((i) => i !== item);
    setFieldValue(fieldKey, updated);
  };

  return (
    <View className="mb-4">
      {/* LABEL */}
      <Text className="text-[#8695A4] text-xs font-semibold mb-2 uppercase tracking-widest">
        {label}
      </Text>

      {/* INPUT / DROPDOWN */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (isDropdown) {
            setOpen((prev) => !prev);
            setFocusedField(fieldKey);
          }
        }}
      >
        <View
          className={`bg-[#15191E] rounded-xl px-4 border-2 ${
            hasError
              ? "border-[#FF5E7D]"
              : focused
                ? "border-[#4A9EFF]"
                : "border-[#2F3740]"
          }`}
        >
          <View className="flex-row items-center">
            {/* ICON */}
            <Ionicons
              name={icon}
              size={18}
              color={hasError ? "#FF5E7D" : focused ? "#4A9EFF" : "#5A6677"}
              style={{ marginRight: 10 }}
            />

            {/* TEXT INPUT */}
            {!isDropdown ? (
              <TextInput
                className="flex-1 text-[#EFF2F5] text-base py-4"
                placeholder={placeholder}
                placeholderTextColor="#3D4855"
                value={value}
                onChangeText={(val) => setFieldValue(fieldKey, val)}
                onBlur={() => {
                  setFocusedField(null);
                  setFieldTouched(fieldKey, true);
                }}
                onFocus={() => setFocusedField(fieldKey)}
                secureTextEntry={secure}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
              />
            ) : (
              <Text className="flex-1 py-4 text-[#3D4855]">
                {isMulti
                  ? selectedValues.length > 0
                    ? `${selectedValues.length} selected`
                    : placeholder || "Select"
                  : value || placeholder || "Select"}
              </Text>
            )}

            {/* RIGHT ICON */}
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

          {/* CHIPS (ONLY MULTI) */}
          {isMulti && selectedValues.length > 0 && (
            <View className="flex-row flex-wrap gap-2 pb-3">
              {selectedValues.map((item) => (
                <View
                  key={getLabel(item)}
                  className="flex-row items-center bg-[#2F3740] px-3 py-1 rounded-full"
                >
                  <Text className="text-white text-xs mr-1">
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
      </TouchableOpacity>

      {/* DROPDOWN LIST */}
      {isDropdown && open && (
        <View className="bg-[#15191E] mt-2 rounded-xl border border-[#2F3740] max-h-72">
          {/* SEARCH */}
          {options.length > 10 && (
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#3D4855"
              value={search}
              onChangeText={setSearch}
              className="px-4 py-3 text-white border-b border-[#2F3740]"
            />
          )}

          {/* LIST */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item, index) => getLabel(item) + index}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            renderItem={({ item }) => {
              const selected = isMulti
                ? selectedValues.includes(item)
                : value === item;

              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="px-4 py-3 flex-row justify-between items-center border-b border-[#2F3740]"
                >
                  <Text className={selected ? "text-[#4A9EFF]" : "text-white"}>
                    {getLabel(item)}
                  </Text>

                  {selected && (
                    <Ionicons
                      name={isMulti ? "checkmark-circle" : "radio-button-on"}
                      size={16}
                      color="#4A9EFF"
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* ERROR */}
      {hasError && (
        <View className="flex-row items-center mt-1 gap-1">
          <Ionicons name="alert-circle-outline" size={12} color="#FF5E7D" />
          <Text className="text-[#FF5E7D] text-xs">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Field;
