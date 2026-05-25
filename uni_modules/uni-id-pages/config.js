export default {
  debug: false,
  isAdmin: false,
  loginTypes: ["username"],
  agreements: {
    serviceUrl: "",
    privacyUrl: "",
    huaweiConsumerPrivacyUrl:
      "https://privacy.consumer.huawei.com/legal/id/authentication-terms.htm?code=CN&language=zh-CN",
    scope: ["register", "login", "realNameVerify"],
  },
  appid: {
    weixin: {
      h5: "",
      web: "",
    },
  },
  passwordStrength: "medium",
  setPasswordAfterLogin: false,
};
