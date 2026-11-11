import { Platform } from "react-native";

/**
 * Utility to pick image file(s) from local storage and convert them to Base64 Data URL.
 * Works seamlessly in React Native Web via DOM input element.
 */
export async function pickLocalImages(multiple = false): Promise<string[]> {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = multiple;

      input.onchange = async () => {
        const files = input.files;
        if (!files || files.length === 0) {
          resolve([]);
          return;
        }

        const readPromises = Array.from(files).map((file) => {
          return new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                res(reader.result);
              } else {
                res("");
              }
            };
            reader.onerror = () => res("");
            reader.readAsDataURL(file);
          });
        });

        const results = await Promise.all(readPromises);
        resolve(results.filter(Boolean));
      };

      input.oncancel = () => {
        resolve([]);
      };

      input.click();
    });
  }

  // Fallback for non-web environments (if expo-image-picker is added in future)
  return [];
}
