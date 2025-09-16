export const Utils = {
    convertPermissionNameToIdent: (name: string) => name.toLowerCase().replace(/ /g, '-'),
    generateToken: (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        const generatedToken = Array.from(array, x => characters[x % characters.length]).join('');
        return generatedToken;
    },
};
