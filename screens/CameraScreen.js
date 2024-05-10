import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import TextRecognition from "react-native-text-recognition";
import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../components/Button";

export default function CameraScreen() {
  const navigation = useNavigation();

  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [cameraText, setCameraText] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        console.log(data.uri);

        performOCR(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const performOCR = (file) => {
    console.log("APIIIII");
    let myHeaders = new Headers();
    myHeaders.append("apikey", "zBOot8842Hmojal9RoZd2UHeBoqXGEkM");
    myHeaders.append("Content-Type", "multipart/form-data");

    let raw = file;
    let requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: raw,
    };

    // Send a POST request to the OCR API
    fetch("https://api.apilayer.com/image_to_text/upload", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        // console.log(result["lang"]);
        // console.log(result["all_text"]);

        // console.log(JSON.stringify(result["all_text"]));
        // console.log(JSON.stringify(result["lang"]));
        // console.log(JSON.stringify(result["annotations"].join(" ")));


        // Set the extracted text in state
        const i = JSON.stringify(result["annotations"].join(" "));
        const j = JSON.stringify(result["lang"]);
        setCameraText(i);
        setDetectedLanguage(j);
      })
      .catch((error) => console.log("error", error));

  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        //alert('Picture saved! 🎉');
        setImage(null);
        console.log("saved successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const recognizeText = async () => {
    if (cameraText != null) {
      try {
        console.log("hi");

        console.log(cameraText)
        console.log(detectedLanguage)

        navigation.navigate("CameraResult", {
          cameraText,
          detectedLanguage,
        })
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: themeColors.bg }}
    >
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-sky-200 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <Text className="text-white font-bold text-4xl text-center p-2">
          Camera
        </Text>
        <View className="space-y-4"></View>
      </View>
      <View style={styles.container}>
        {!image ? (
          <Camera
            style={styles.camera}
            type={type}
            ref={cameraRef}
            flashMode={flash}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <Button
                title=""
                icon="retweet"
                onPress={() => {
                  setType(
                    type === CameraType.back
                      ? CameraType.front
                      : CameraType.back
                  );
                }}
              />
              <Button
                onPress={() =>
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  )
                }
                icon="flash"
                color={
                  flash === Camera.Constants.FlashMode.off ? "gray" : "#fff"
                }
              />
            </View>
          </Camera>
        ) : (
          <Image source={{ uri: image }} style={styles.camera} />
        )}

        <View style={styles.controls}>
          {image ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 50,
              }}
            >
              <Button
                title="Re-take"
                onPress={() => setImage(null)}
                icon="retweet"
              />
              <Button title="Next" onPress={recognizeText} icon="check" />
            </View>
          ) : (
            <Button
              title="Take a picture"
              onPress={takePicture}
              icon="camera"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
    padding: 8,
  },
  controls: {
    flex: .7,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#E9730F",
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
});