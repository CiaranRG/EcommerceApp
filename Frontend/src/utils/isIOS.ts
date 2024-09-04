// Utility function to detect if the user is on iOS
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export default isIOS