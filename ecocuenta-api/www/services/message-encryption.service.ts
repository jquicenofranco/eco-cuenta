import * as CryptoJS from 'crypto-js';

export class MessageEncryptionService {
    private static privateKey: string;

    static initialize(privateKey: string) {
        MessageEncryptionService.privateKey = privateKey;
    }

    static encryptMessage(message: string): string {
        if (!MessageEncryptionService.privateKey) {
            throw new Error('La clave privada no ha sido inicializada');
        }
        const encryptedMessage = CryptoJS.AES.encrypt(message, MessageEncryptionService.privateKey).toString();
        return encryptedMessage;
    }

    static decryptMessage(encryptedMessage: string): string {
        if (!MessageEncryptionService.privateKey) {
            throw new Error('La clave privada no ha sido inicializada');
        }
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, MessageEncryptionService.privateKey);
        const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decryptedMessage;
    }
}
