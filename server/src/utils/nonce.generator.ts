const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

function getRandomBlock() {
    let block = '';
    for (let i = 0; i < 3; i++) {
        block += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return block;
}

export function generateNonce(): string {
    return `${getRandomBlock()}-${getRandomBlock()}-${getRandomBlock()}`;
}