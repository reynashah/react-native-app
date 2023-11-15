import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-elements";
import FlipCard from "react-native-flip-card";

export default Flashcard = ({ flashcard }) => {
  return (
    <FlipCard className={flex-1} flipHorizontal flipVertical>
      {/* Front side */}
      <Card>
        <Text className={flex-1}>{flashcard.question}</Text>
      </Card>
      {/* Back side */}
      <Card>
        <Text className={flex-1}>{flashcard.answer}</Text>
      </Card>
    </FlipCard>
  );
};