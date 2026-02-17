import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import {
  getConversations,
  newConversation,
  newMessage,
  testSocket,
} from "@/sockets/socketEvents";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import { ConversationProps, ResponseProps } from "@/types";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

const home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  const newConversationHandler = (res: ResponseProps) => {
    if (res.success && res.data?.isNew) {
      setConversations((prev) => [...prev, res.data]);
    }
  };

  const processConversations = (res: ResponseProps) => {
    // console.log("res:",res);

    if (res.success) {
      setConversations(res.data);
    }
  };

  useEffect(() => {
    getConversations(processConversations);

    newConversation(newConversationHandler);
    newMessage(newMessageHandler);

    getConversations(null);
    return () => {
      getConversations(processConversations, true);
      newConversation(newConversationHandler, true);
      newMessage(newMessageHandler, true);
    };
  }, []);

  const newMessageHandler = (res: ResponseProps) => {
    if (res.success) {
      let conversationId = res.data.conversationId;
      setConversations((prev) => {
        let updatedConversation = prev.map((item) => {
          if (item._id == conversationId) item.lastMessage == res.data;
          return item;
        });
        return updatedConversation;
      });
    }
  };

  // const handleLogout = async () => {
  //   await signOut();
  // };

  // const conversations = [
  //   {
  //     name: "Alice",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Alice",
  //       content: "hery",
  //       createdAt: "2025-06-21T18:45:00Z",
  //     },
  //   },
  //   {
  //     name: "team project",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Alice",
  //       content: "her naoe lay",
  //       createdAt: "2026-02-15T14:10:00Z",
  //     },
  //   },
  //   {
  //     name: "my project",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Alice",
  //       content: "hery",
  //       createdAt: "2025-06-21T18:45:00Z",
  //     },
  //   },
  //   {
  //     name: "Alice",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Alice",
  //       content: "hery",
  //       createdAt: "2025-06-21T18:45:00Z",
  //     },
  //   },
  // ];

  const directConversations = conversations
    .filter((item: ConversationProps) => item.type == "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  const groupConversations = conversations
    .filter((item: ConversationProps) => item.type == "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  // left right gesture

  const handleSwipeLeft = () => {
    if (selectedTab === 0) {
      setSelectedTab(1);
    }
  };

  const handleSwipeRight = () => {
    if (selectedTab === 1) {
      setSelectedTab(0);
    }
  };

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX < -50) {
      runOnJS(handleSwipeLeft)();
    }

    if (event.translationX > 50) {
      runOnJS(handleSwipeRight)();
    }
  });

  return (
    <ScreenWrapper bgOpacity={0.4} showPattern={true}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,
              <Typo color={colors.white} size={20} fontWeight={"800"}>
                {currentUser?.name}
              </Typo>{" "}
              👋
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => {
              router.push("/(main)/profileModal");
            }}
          >
            <Icons.GearSix
              color={colors.white}
              weight="fill"
              size={verticalScale(22)}
            />
          </TouchableOpacity>
        </View>

        {/* content */}
        <View style={styles.content}>
          <GestureDetector gesture={swipeGesture}>
            <Animated.View style={{ flex: 1 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: spacingY._20 }}
              >
                {/* menu for direct and group msg */}
                <View style={styles.navBar}>
                  <View style={styles.tabs}>
                    <TouchableOpacity
                      onPress={() => setSelectedTab(0)}
                      style={[
                        styles.tabStyle,
                        selectedTab === 0 && styles.activeTabStyle,
                      ]}
                    >
                      <Typo>Direct Messages</Typo>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedTab(1)}
                      style={[
                        styles.tabStyle,
                        selectedTab === 1 && styles.activeTabStyle,
                      ]}
                    >
                      <Typo>Groups</Typo>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* contact list  */}
                <View style={styles.conversationList}>
                  {selectedTab == 0 &&
                    directConversations.map(
                      (item: ConversationProps, index) => {
                        return (
                          <ConversationItem
                            item={item}
                            key={index}
                            router={router}
                            showDivider={
                              directConversations.length != index + 1
                            }
                          />
                        );
                      },
                    )}
                  {selectedTab == 1 &&
                    groupConversations.map((item: ConversationProps, index) => {
                      return (
                        <ConversationItem
                          item={item}
                          key={index}
                          router={router}
                          showDivider={groupConversations.length != index + 1}
                        />
                      );
                    })}
                </View>

                {!loading &&
                  selectedTab == 0 &&
                  directConversations.length == 0 && (
                    <Typo style={{ textAlign: "center" }}>
                      You don't have any messages
                    </Typo>
                  )}

                {!loading &&
                  selectedTab == 1 &&
                  groupConversations.length == 0 && (
                    <Typo style={{ textAlign: "center" }}>
                      You haven't joined any groups yet
                    </Typo>
                  )}

                {loading && <Loading />}
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>

      <Button
        style={styles.floatingButton}
        onPress={() =>
          router.push({
            pathname: "/(main)/newConversationModal",
            params: { isGroup: selectedTab },
          })
        }
      >
        <Icons.Plus
          color={colors.black}
          weight="bold"
          size={verticalScale(24)}
        />
      </Button>
    </ScreenWrapper>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingVertical: spacingY._20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },
  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    borderRadius: radius.full,
    backgroundColor: colors.neutral700,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
