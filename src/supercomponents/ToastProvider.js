import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ToastContext = createContext(null);

const { width } = Dimensions.get("window");

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const translateY = useRef(new Animated.Value(-120)).current;

  const opacity = useRef(new Animated.Value(0)).current;

  const timerRef = useRef(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  }, [translateY, opacity]);

  const show = useCallback(
    ({ type = "success", title, message, duration = 3000 }) => {
      // Clear previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({
        type,
        title,
        message,
      });

      // Make sure animation starts
      translateY.setValue(-120);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        hide();
      }, duration);
    },
    [hide, translateY, opacity],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const success = useCallback(
    (message, title = "Success") => {
      show({
        type: "success",
        title,
        message,
      });
    },
    [show],
  );

  const error = useCallback(
    (message, title = "Something went wrong") => {
      show({
        type: "error",
        title,
        message,
      });
    },
    [show],
  );

  const info = useCallback(
    (message, title = "Info") => {
      show({
        type: "info",
        title,
        message,
      });
    },
    [show],
  );

  const warning = useCallback(
    (message, title = "Warning") => {
      show({
        type: "warning",
        title,
        message,
      });
    },
    [show],
  );

  const apiError = useCallback(
    (error, fallback = "Something went wrong. Please try again.") => {
      const message =
        error?.response?.data?.message || error?.message || fallback;

      show({
        type: "error",
        title: "Request Failed",
        message,
      });
    },
    [show],
  );

  const getIcon = () => {
    switch (toast?.type) {
      case "success":
        return "✓";

      case "error":
        return "✕";

      case "warning":
        return "⚠";

      case "info":
        return "ⓘ";

      default:
        return "";
    }
  };

  const getColors = () => {
    switch (toast?.type) {
      case "success":
        return {
          icon: "#4ADE80",
          border: "#245B3A",
        };

      case "error":
        return {
          icon: "#FF5E7D",
          border: "#6B2938",
        };

      case "warning":
        return {
          icon: "#FBBF24",
          border: "#66501A",
        };

      case "info":
        return {
          icon: "#4A9EFF",
          border: "#254C78",
        };

      default:
        return {
          icon: "#FFFFFF",
          border: "#2F3740",
        };
    }
  };

  const colors = getColors();

  return (
    <ToastContext.Provider
      value={{
        show,
        success,
        error,
        info,
        warning,
        apiError,
        hide,
      }}
    >
      {children}

      {toast && (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: 50,
            left: 16,
            right: 16,
            zIndex: 9999,
            transform: [
              {
                translateY,
              },
            ],
            opacity,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={hide}
            style={{
              width: width - 32,
              backgroundColor: "#15191E",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text
                style={{
                  color: colors.icon,
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {getIcon()}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              {!!toast.title && (
                <Text
                  style={{
                    color: "#EFF2F5",
                    fontSize: 15,
                    fontWeight: "700",
                    marginBottom: 2,
                  }}
                >
                  {toast.title}
                </Text>
              )}

              {!!toast.message && (
                <Text
                  style={{
                    color: "#AAB4C0",
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  {toast.message}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

export default ToastProvider;
