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
      <Card containerStyle={{ backgroundColor: "#153243", borderRadius: 10, height: 170, width: 170, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#f4f9e9", fontWeight: "bold", fontSize: 23 }}>
          {flashcard.question}
        </Text>
      </Card>

      {/* Back side */}
      <Card containerStyle={{ backgroundColor: "#f4f9e9", borderRadius: 10, height:170, width: 170,justifyContent: "center", alignItems: "center"  }}>
        <Text style={{ color: "#153243", fontWeight: "bold", fontSize: 23 }}>
          {flashcard.answer}
        </Text>
      </Card>
    </FlipCard>
  );
};

export default Flashcard;
