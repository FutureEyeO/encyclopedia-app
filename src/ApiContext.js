import Api from "./functions/Api"
import Browser from "./functions/Browser"

export const autoLoginApiContext = async (dispatch) => {

    const loginId = Browser.getCookie("loginId")
    const userId = Browser.getCookie("userId")

    console.log(loginId, userId)
    if (userId && loginId) {
        await Api.fetchSaveLoginUser(loginId, userId).then(res => {
            if (res.status == 200 && res.data && res.data != {}) {
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
                
                // let lastUrlVistedArray = Browser.getHistoryUrl()
                // console.log(lastUrlVistedArray)
                // let lastUrlVisted = lastUrlVistedArray[lastUrlVistedArray.length - 1]
                // console.log(lastUrlVisted, window.location.href, lastUrlVisted != window.location.href)

                // if (lastUrlVisted != window.location.href) {

                //     window.location.href = lastUrlVisted
                // }
                // else {
                //     window.location.href = window.location.host
                // }
            } else {
                dispatch({ type: "LOGIN_FAILURE", payload: {} })
                // window.location.pathname = "/login"
            }
        })

    }
}


export const updateLoginApiContext = async (dispatch) => {

    const loginId = Browser.getCookie("loginId")
    const userId = Browser.getCookie("userId")

    if (userId && loginId) {

        await Api.updateLoginUser(loginId, userId).then(res => {
            dispatch({ type: "UPDATE_LOGIN", payload: res.data })
        })

    }
}

export const loginApiContext = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" })
    try {
        await Api.loginUser(userCredentials).then(async res => {
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
            console.log(res.data)
            await Api.saveLoginUser(userCredentials).then(resLogin => {
                console.log(resLogin.data)
                Browser.setCookie("loginId", resLogin.data.login_id, 10)
                Browser.setCookie("userId", resLogin.data.user_id, 10)
                return resLogin
            })
        })
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err })
    }
}