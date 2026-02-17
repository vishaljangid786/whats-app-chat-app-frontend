import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Avatar from "./Avatar";
import Typo from "./Typo";
import moment from "moment";
import { ConversationListItemProps } from "@/types";
import { useAuth } from "@/context/authContext";


const ConversationItem = ({
  item,
  showDivider,
  router,
}: ConversationListItemProps) => {
  const { user: currentUser } = useAuth();
  const [previewVisible, setPreviewVisible] = useState(false);

  const lastMessage: any = item.lastMessage;
  const isDirect = item.type == "direct";
  let avatar = item.avatar;
  const otherParticipant = isDirect
    ? item.participants.find((p) => p._id != currentUser?.id)
    : null;

  if (isDirect && otherParticipant) avatar = otherParticipant?.avatar;

  const getLastMessageDate = () => {
    if (!lastMessage?.createdAt) return null;

    const messageDate = moment(lastMessage.createdAt);

    const today = moment();

    if (messageDate.isSame(today, "day")) {
      return messageDate.format("h:mm A");
    }
    if (messageDate.isSame(today, "year")) {
      return messageDate.format("MMM D");
    }
    return messageDate.format("MMM D,YYYY");
  };

  const getLastMessageContent = () => {
    if (!lastMessage) return "Say Hii 👋";

    return lastMessage?.attachement ? "Image" : lastMessage.content;
  };

  const openConversation = () => {
    router.push({
      pathname: "/(main)/conversation",
      params: {
        id: item._id,
        name: item.name,
        avatar: item.avatar,
        type: item.type,
        participants: JSON.stringify(item.participants),
      },
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={openConversation}
        style={styles.conversationItem}
      >
        <TouchableOpacity onPress={() => setPreviewVisible(true)}>
          <Avatar uri={avatar} size={47} isGroup={item.type == "group"} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Typo size={17} fontWeight={"600"}>
              {isDirect ? otherParticipant?.name : item?.name}
            </Typo>

            {item.lastMessage && <Typo size={15}> {getLastMessageDate()}</Typo>}
          </View>

          <Typo
            size={15}
            color={colors.neutral600}
            textProps={{ numberOfLines: 1 }}
          >
            {getLastMessageContent()}
          </Typo>
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
      <Modal
        transparent
        visible={previewVisible}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPreviewVisible(false)}
        >
          <View style={styles.previewContainer}>
            <Avatar uri={avatar} size={150} isGroup={item.type == "group"} />
            <Typo size={20} fontWeight={"600"} style={{ marginTop: 12 }}>
              {isDirect ? otherParticipant?.name : item?.name}
            </Typo>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  conversationItem: {
    gap: spacingX._10,
    marginVertical: spacingY._12,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  previewContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
