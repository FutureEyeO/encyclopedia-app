const constants = {

    proxy: "http://localhost:8800/api",
    statisticsApi: "http://localhost:8800/statistics",
    socket: "http://localhost:8900/api",
    UPLOAD_USER_URL: `http://localhost:8800/api/public/user`,
    UPLOAD_POST_URL: `http://localhost:8800/api/public/post`,

    UPLOAD_POST_PATH:`assets/data/post`,
    UPLOAD_USER_PATH: `assets/data/user`,

    ALLOWED_IMG: ["image/png", "image/jpeg"],
    ALLOWED_IMG_SIZE: 8,

    LIMIT_POST_COMMENTS_USER: 3,
    LIMIT_POST_COMMENTS: 20,

}


export default constants;