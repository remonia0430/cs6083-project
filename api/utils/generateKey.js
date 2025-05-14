const fs = require("fs");
const crypto = require("crypto");

const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "spki",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
    }
});
const publicKeyPath = "public.pem";
const privateKeyPath = "private.pem";
if (!fs.existsSync(publicKeyPath)) {
    fs.writeFileSync(publicKeyPath, publicKey);
}
if (!fs.existsSync(privateKeyPath)) {
    fs.writeFileSync(privateKeyPath, privateKey);
}
