const theme = {
    PROD: 'BLUE',
    TEST: 'GREEN',
    DEV: 'RED',
    DEFAULT: 'BLUE'
};

export const DEMO_PASSKEY = import.meta.env.VITE_DEMO_PASSKEY || "53b2dca9-1eae-4881-ab68-7fe7f4f8136d";

export default {
    theme,
    DEMO_PASSKEY
}