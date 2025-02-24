import sodium from "libsodium-wrappers";

export const encryptMessage = async (message, key) => {
    await sodium.ready;
    try {
      const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      const encryptedMessage = sodium.crypto_secretbox_easy(message, nonce, key);
      return {
        encryptedMessage: sodium.to_hex(encryptedMessage),
        nonce: sodium.to_hex(nonce),
      };
    } catch (err) {
      console.error("Encryption error:", err);
      throw err;
    }
  };
  
  export const decryptMessage = async (encryptedMessage, nonce, key) => {
    await sodium.ready;
    try {
      const decryptedMessage = sodium.crypto_secretbox_open_easy(
        sodium.from_hex(encryptedMessage),
        sodium.from_hex(nonce),
        key
      );
      return sodium.to_string(decryptedMessage);
    } catch (err) {
      console.error("Decryption error:", err);
      throw err;
    }
  };
  