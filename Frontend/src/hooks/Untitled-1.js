
        // Ensure libsodium is ready
        await sodium.ready;

        // Generate a nonce
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        // Replace this with your actual encryption key (must be 32 bytes)
        const key = sodium.from_hex(sender.privateKey);
        

        let encryptedMessage; // Declare encryptedMessage in the outer scope

        // Encrypt the message
        try {
            encryptedMessage = sodium.crypto_secretbox_easy(message, nonce, key);
        } catch (err) {
            console.error("Encryption error:", err.message);
            throw err;
        }