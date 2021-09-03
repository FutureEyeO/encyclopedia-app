const constants = {

    proxy: "https://encyclopedia-api.herokuapp.com/api",
    statisticsApi: "https://encyclopedia-api.herokuapp.com/statistics",
    adminApi: "https://encyclopedia-apd.herokuapp.com/api",
    socket: "https://encyclopedia-socket.herokuapp.com/",
    UPLOAD_USER_URL: `https://encyclopedia-api.herokuapp.com/api/public/user`,
    UPLOAD_POST_URL: `https://encyclopedia-api.herokuapp.com/api/public/post`,

    UPLOAD_POST_PATH:`assets/data/post`,
    UPLOAD_USER_PATH: `assets/data/user`,

    ALLOWED_IMG: ["image/png", "image/jpeg"],
    ALLOWED_IMG_SIZE: 8,

    LIMIT_POST_COMMENTS_USER: 3,
    LIMIT_POST_COMMENTS: 20,

}


export default constants;
