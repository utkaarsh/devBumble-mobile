import React from "react";
import { Text, View } from "react-native";

export function splitByComma(str) {
  let result = [];
  let word = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ",") {
      result[result.length] = word;
      word = "";
    } else {
      word += str[i];
    }
  }

  // Add the last word
  result[result.length] = word;

  return result;
}

export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);

  // Older than 3 weeks
  if (seconds >= 3 * 7 * 24 * 60 * 60) {
    const day = date.getDate();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  }

  const intervals = {
    y: 31536000,
    mo: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1,
  };

  for (const interval in intervals) {
    const value = Math.floor(seconds / intervals[interval]);

    if (value > 0) {
      return `${value}${interval} ago`;
    }
  }

  return "just now";
}

export function renderJobDescription(html) {
  if (!html) return null;

  // Normalize HTML
  let text = html.replace(/\r\n/g, "\n").replace(/<br\s*\/?>/gi, "\n");

  const elements = [];

  // Extract <ul> blocks first
  const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;

  let lastIndex = 0;
  let match;

  while ((match = ulRegex.exec(text)) !== null) {
    // Render content before this <ul>
    const beforeList = text.slice(lastIndex, match.index);

    if (beforeList.trim()) {
      elements.push(...renderTextBlock(beforeList, elements.length));
    }

    // Extract <li> items
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;

    let liMatch;
    const listItems = [];

    while ((liMatch = liRegex.exec(match[1])) !== null) {
      const item = cleanText(liMatch[1]);

      if (item) {
        listItems.push(item);
      }
    }

    elements.push(
      <View key={`list-${elements.length}`} className="mb-4">
        {listItems.map((item, index) => (
          <View key={`li-${index}`} className="mb-2 flex-row">
            <Text className="mr-2 text-base text-gray-400">•</Text>

            <Text className="flex-1 text-base leading-6 text-gray-400">
              {item}
            </Text>
          </View>
        ))}
      </View>,
    );

    lastIndex = ulRegex.lastIndex;
  }

  // Render anything after the last <ul>
  const remaining = text.slice(lastIndex);

  if (remaining.trim()) {
    elements.push(...renderTextBlock(remaining, elements.length));
  }

  return <View>{elements}</View>;
}

// ----------------------------------------
// Render normal text / headings
// ----------------------------------------

function renderTextBlock(text, startIndex) {
  const result = [];

  // Handle h1-h6
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;

  let lastIndex = 0;
  let match;

  while ((match = headingRegex.exec(text)) !== null) {
    // Text before heading
    const before = text.slice(lastIndex, match.index);

    if (before.trim()) {
      result.push(...renderPlainText(before, startIndex + result.length));
    }

    const heading = cleanText(match[2]);

    if (heading) {
      result.push(
        <Text
          key={`heading-${startIndex + result.length}`}
          className="mb-3 text-base font-bold text-gray-500"
        >
          {heading}
        </Text>,
      );
    }

    lastIndex = headingRegex.lastIndex;
  }

  // Remaining text
  const remaining = text.slice(lastIndex);

  if (remaining.trim()) {
    result.push(...renderPlainText(remaining, startIndex + result.length));
  }

  return result;
}

// ----------------------------------------
// Render plain text
// ----------------------------------------

function renderPlainText(text, startIndex) {
  const cleaned = cleanText(text);

  if (!cleaned) return [];

  return cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      return (
        <Text
          key={`text-${startIndex}-${index}`}
          className="mb-3 text-base leading-6 text-gray-400"
        >
          {line}
        </Text>
      );
    });
}

// ----------------------------------------
// Clean HTML
// ----------------------------------------

function cleanText(text) {
  return (
    text
      // Remove remaining HTML tags
      .replace(/<[^>]+>/g, "")

      // Decode common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")

      // Normalize whitespace
      .replace(/\s+/g, " ")

      .trim()
  );
}
