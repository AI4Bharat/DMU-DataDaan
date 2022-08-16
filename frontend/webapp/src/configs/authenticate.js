const aunthenticate = () => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (userInfo && userInfo.privateKey ) {
        return true;
    }
    return true;
}

export default aunthenticate;


