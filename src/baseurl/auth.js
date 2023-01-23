import axios from "axios";

// baseURLを設定する専用のファイル
const instance = axios.create({
    baseURL:
    "https://identitytoolkit.googleapis.com/v1"
})

export default instance