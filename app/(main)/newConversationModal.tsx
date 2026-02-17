import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/input";
import Typo from "@/components/Typo";
import { useAuth } from "@/context/authContext";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";
import { getContacts, newConversation } from "@/sockets/socketEvents";
import { uploadFileToCloudinary } from "@/services/imageService";
import { showAlert } from "@/utils/globalAlert";
import * as Icons from "phosphor-react-native";

const NewConversationModal = () => {
  const { isGroup } = useLocalSearchParams();

  const isGroupMode = isGroup == "1";
  const isdirectMode = isGroup == "0";
  const [contacts, setContacts] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const createGroup = async () => {
    if (!groupName.trim() || !currentUser || selectedParticipants.length < 2)
      return;

    setIsLoading(true);
    try {
      let avatar = null;
      if (groupAvatar) {
        const uploadResult = await uploadFileToCloudinary(
          groupAvatar,
          "group-avatars",
        );
        if (uploadResult.success) avatar = uploadResult.data;
      }

      newConversation({
        type: "group",
        participants: [currentUser.id, ...selectedParticipants],
        name: groupName,
        avatar,
      });
    } catch (error: any) {
      console.log("Error creating group:", error);
      showAlert({
        title: "Error",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { user: currentUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    getContacts(processGetContacts);
    newConversation(processNewConversation);
    getContacts(null);

    return () => {
      getContacts(processGetContacts, true);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContacts = (res: any) => {
    // console.log("got contacts:", res.data);

    if (res.success) {
      setContacts(res.data);
    }
  };

  const processNewConversation = (res: any) => {
    // console.log("got new conversation result:", res.data);
    setIsLoading(false);
    if (res.success) {
      router.back();
      router.push({
        pathname: "/(main)/conversation",
        params: {
          id: res.data._id,
          name: res.data.name,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),
        },
      });
    } else {
      console.log("Error fetching/creating  conversations:", res.msg);
      showAlert({
        title: "Error",
        message: res.msg,
      });
    }
  };

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing:true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setGroupAvatar(result.assets[0]);
    }
  };

  const toggleParticipant = (user: any) => {
    setSelectedParticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id != user.id);
      }
      return [...prev, user.id];
    });
  };

  const onSelectUser = (user: any) => {
    if (!currentUser) {
      showAlert({
        title: "Authentication",
        message: "Please Login to start the conversation ",
      });
      return;
    }

    if (isGroupMode) {
      toggleParticipant(user);
    } else {
      newConversation({
        type: "direct",
        participants: [currentUser.id, user.id],
      });
    }
  };
  const filteredContacts = contacts.filter((user: any) => {
    if (!searchText.trim()) return true;

    const lowerSearch = searchText.toLowerCase();

    return (
      user.name?.toLowerCase().includes(lowerSearch) ||
      user.email?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
        style={{marginTop:spacingY._15}}
          title={isGroupMode ? "New Group" : "Selected User"}
          leftIcon={<BackButton color={colors.black} />}
          rightIcon={
            isGroupMode ? (
              <TouchableOpacity
                onPress={() => setIsSearchActive((prev) => !prev)}
              >
                {isSearchActive ? (
                  <Icons.X size={24} color={colors.black} />
                ) : (
                  <Icons.MagnifyingGlass size={24} color={colors.black} />
                )}
              </TouchableOpacity>
            ) : null
          }
        />

        {isGroupMode && !isSearchActive && (
          <View style={styles.groupInforContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={onPickImage}>
                <Avatar
                  uri={groupAvatar?.uri || null}
                  size={100}
                  isGroup={true}
                  isEditIcon={true}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.groupNameConatiner}>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
          </View>
        )}
        {(!isGroupMode || isSearchActive) && (
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search by name or email"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conatctList}
        >
          {filteredContacts?.map((user: any, index) => {
            const isSelected = selectedParticipants.includes(user.id);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUser(user)}
              >
                <Avatar size={45} uri={user.avatar} />
                <Typo fontWeight={"500"}>{user.name}</Typo>

                {isGroupMode && (
                  <View style={styles.selectionIndicator}>
                    <View
                      style={[styles.checkbox, isSelected && styles.checked]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isGroupMode && selectedParticipants.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Button
              onPress={createGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
            >
              <Typo fontWeight={"bold"} size={17}>
                Create Group
              </Typo>
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default NewConversationModal;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  groupInforContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupNameConatiner: {
    width: "100%",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  conatctList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  selectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  searchContainer: {
    marginTop: spacingY._20,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopColor: colors.neutral200,
  },
});
