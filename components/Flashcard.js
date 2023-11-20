import React from "react";
import { Text } from "react-native";
import { Card } from "react-native-elements";
import FlipCard from "react-native-flip-card";

const Flashcard = ({ flashcard }) => {
  return (
    <FlipCard
      style={{ flex: 1 }}
      friction={6}
      perspective={1000}
      flipHorizontal
      flipVertical={false}
      flip={false}
      clickable={true}
      useNativeDriver={false}
    >
      {/* Front side */}
      <Card containerStyle={{ backgroundColor: "#87CEFA", borderRadius: 10 }}>
        <Text style={{ color: "#006400", fontWeight: "bold", fontSize: 16 }}>
          {flashcard.question}
        </Text>
      </Card>

      {/* Back side */}
      <Card containerStyle={{ backgroundColor: "#87CEFA", borderRadius: 10 }}>
        <Text style={{ color: "#006400", fontWeight: "bold", fontSize: 16 }}>
          {flashcard.answer}
        </Text>
      </Card>
    </FlipCard>
  );
};

export default Flashcard;
