import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-elements";
import FlipCard from "react-native-flip-card";

const Flashcard = ({ flashcard }) => {
  return (
    <FlipCard style={styles.card} flipHorizontal flipVertical>
      {/* Front side */}
      <Card>
        <Text style={styles.question}>{flashcard.question}</Text>
      </Card>
      {/* Back side */}
      <Card>
        <Text style={styles.answer}>{flashcard.answer}</Text>
      </Card>
    </FlipCard>
  );
};
const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderWidth: 0,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  answer: {
    fontSize: 16,
    textAlign: "center",
  },
});
export default Flashcard;