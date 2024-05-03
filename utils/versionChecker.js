import * as Updates from "expo-updates";
import { Alert, Linking } from "react-native";
import VersionCheck from "react-native-version-check";

const useVersionChecker = () => {
  function showUpdatePrompt() {
    Alert.alert(
      "Update Available",
      "A new version of the app is available. Please update to the latest version to continue using the app.",
      [
        {
          text: "Update Now",
          onPress: () => {
            const url =
              Platform.OS === "ios"
                ? "itms-apps://itunes.apple.com/app/6480027255"
                : "market://details?id=com.support.nasya";
            Linking.openURL(url);
          },
        },
      ],
      { cancelable: false }
    );
  }

  const checkNewVersion = async () => {
    const latestVersion = await VersionCheck.getLatestVersion();
    const currentVersion = VersionCheck.getCurrentVersion();
    // console.log(currentVersion);
    return latestVersion > currentVersion;
  };

  const checkForUpdates = async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      // update is available, prompt user to download it
      downloadUpdate();
    }
  };

  const downloadUpdate = async () => {
    await Updates.fetchUpdateAsync();
    // reload the app to apply the update
    Updates.reloadAsync();
  };

  return {
    showUpdatePrompt,
    checkNewVersion,
    checkForUpdates,
    downloadUpdate,
  };
};

export default useVersionChecker;
