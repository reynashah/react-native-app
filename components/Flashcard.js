import React from "react";
import {Text } from "react-native";
import { Card } from "react-native-elements";
import FlipCard from "react-native-flip-card";

export default Flashcard = ({ flashcard }) => {
  return (
    <FlipCard className="flex-1" flipHorizontal flipVertical>
      {/* Front side */}
      <Card classname="bg-sky-800 rounded-xl">
        <Text className="text-emerald-800 font-bold text-lg">{flashcard.question}</Text>
      </Card>
      {/* Back side */}
      <Card classname="bg-sky-800 rounded-xl">
        <Text className="text-emerald-800 font-bold text-lg">{flashcard.answer}</Text>
      </Card>
    </FlipCard>
  );
};