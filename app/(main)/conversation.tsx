import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/authContext";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as Icons from "phosphor-react-native";
import MessageItem from "@/components/MessageItem";
import Input from "@/components/input";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import Loading from "@/components/Loading";
import { uploadFileToCloudinary } from "@/services/imageService";
import { getMessages, newMessage } from "@/sockets/socketEvents";
import { MessageProps, ResponseProps } from "@/types";
import { showAlert } from "@/utils/globalAlert";
import bgPattern from "../../assets/images/bgPattern1.png";

const conversation = () => {
  const { user: currentUser } = useAuth();

  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type,
  } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    newMessage(newMessageHandler);
    getMessages(messageHandler);
    getMessages({ conversationId });

    return () => {
      newMessage(newMessageHandler, true);
      getMessages(messageHandler, true);
    };
  }, []);

  const messageHandler = (res: ResponseProps) => {
    if (res.success) setMessages(res.data);
  };

  const newMessageHandler = (res: ResponseProps) => {
    setLoading(false);

    if (res.success) {
      if (res.data.conversationId == conversationId) {
        setMessages((prev) => [res.data as MessageProps, ...prev]);
      }
    } else {
      showAlert({
        title: "Error",
        message: res.msg as string,
      });
    }
  };

  const participants = JSON.parse(stringifiedParticipants as string);

  let conversationAvatar = avatar;

  let isDirect = type == "direct";
  const otherParticipant = isDirect
    ? participants.find((p: any) => p._id != currentUser?.id)
    : null;

  if (isDirect && otherParticipant)
    conversationAvatar = otherParticipant.avatar;

  let conversationName = isDirect ? otherParticipant.name : name;

  const onPickFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing:true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;

    if (!currentUser) return;

    setLoading(true);

    try {
      let attachement = null;
      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "message-attachements",
        );

        if (uploadResult.success) {
          attachement = uploadResult.data;
        } else {
          setLoading(false);
          showAlert({
            title: "Error",
            message: "Could not send the message",
          });
        }
      }
      // console.log("attachement:",attachement);

      newMessage({
        conversationId,
        sender: {
          id: currentUser?.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        content: message.trim(),
        attachement,
      });

      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.log("error sending message:", error);
      showAlert({
        title: "Error",
        message: "Failed to send the message",
      });
    } finally {
      setLoading(false);
    }
  };

  const threeDotsClick = () => {
    setMenuVisible(true);
  };

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      {/* modal for block and upload bg */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                showAlert({
                  title: "Oops",
                  message: "This Feature coming soon!",
                });
              }}
            >
              <Typo style={styles.menuText}>Upload Background</Typo>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                showAlert({
                  title: "Oops",
                  message: "This Feature coming soon!",
                });
              }}
            >
              <Text style={[styles.menuText, { color: "red" }]}>
                Block User
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* chat view */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        {/* header */}
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton />
              <Avatar
                size={40}
                uri={conversationAvatar as string}
                isGroup={type == "group"}
              />
              <Typo color={colors.white} fontWeight={"500"} size={22}>
                {conversationName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity
              style={{ marginBottom: verticalScale(7) }}
              onPress={threeDotsClick}
            >
              <Icons.DotsThreeOutlineVertical
                weight="fill"
                color={colors.white}
              />
            </TouchableOpacity>
          }
        />

        {/* messages */}

        <View style={styles.content}>
          <ImageBackground
            source={bgPattern}
            style={{
              flex: 1,
              paddingHorizontal: spacingX._15,
              backgroundColor: colors.white,
            }}
            imageStyle={{ opacity: 0.1 }}
            resizeMode="stretch"
          >
            <FlatList
              data={messages}
              inverted={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
              renderItem={({ item }) => (
                <MessageItem item={item} isDirect={isDirect} />
              )}
              keyExtractor={(item) => item.id}
            />
            {/* footer */}
            <View style={styles.footer}>
              <Input
                placeholder="Type Something...."
                onChangeText={setMessage}
                containerStyle={{
                  paddingLeft: spacingX._10,
                  paddingRight: scale(65),
                  borderWidth: 0,
                }}
                value={message}
                icon={
                  <TouchableOpacity
                    style={styles.inputIcon}
                    onPress={onPickFile}
                  >
                    <Icons.Plus color={colors.black} weight="bold" size={22} />

                    {selectedFile && selectedFile.uri && (
                      <Image
                        source={selectedFile.uri}
                        style={styles.selectedFile}
                      />
                    )}
                  </TouchableOpacity>
                }
              />

              <View style={styles.inputRightIcon}>
                <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                  {loading ? (
                    <Loading size={"small"} color={colors.black} />
                  ) : (
                    <Icons.PaperPlaneTilt
                      color={colors.black}
                      weight="fill"
                      size={verticalScale(22)}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 90,
    paddingRight: 20,
  },

  menuBox: {
    backgroundColor: "white",
    borderRadius: 12,
    width: 180,
    paddingVertical: 10,
    elevation: 5,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  menuText: {
    fontSize: 16,
  },

  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  },

  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    backgroundImage: "../../assets/images/bgPattern.png",
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  messageContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
});
