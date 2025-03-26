import liff from "@line/liff";

export async function initializeLiff(liffId: string) {
  try {
    // LIFF初期化が未完了の場合のみ初期化
    if (!liff.isInClient() && !liff.isLoggedIn()) {
      await liff.init({ liffId });
    } else if (!liff.isInClient()) {
      await liff.init({ liffId });
    } else {
      await liff.init({ liffId });
    }
    console.log("LIFF initialization succeeded");
    return { success: true };
  } catch (error) {
    console.error("LIFF initialization failed", error);
    return { success: false, error };
  }
}

export async function getLiffProfile() {
  if (!liff.isLoggedIn()) {
    return null;
  }

  try {
    const profile = await liff.getProfile();
    return profile;
  } catch (error) {
    console.error("Error getting LIFF profile", error);
    return null;
  }
}

export function getLiffToken() {
  if (!liff.isLoggedIn()) {
    return null;
  }

  try {
    const idToken = liff.getIDToken();
    return idToken;
  } catch (error) {
    console.error("Error getting LIFF token", error);
    return null;
  }
}

export function closeLiff() {
  if (liff.isInClient()) {
    liff.closeWindow();
  }
}
