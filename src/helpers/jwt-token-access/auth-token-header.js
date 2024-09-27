export default function authHeader() {
  const obj = JSON.parse(sessionStorage.getItem("authUser"))

  if (obj && obj.accessToken) {
    console.log("This is obj token : ", obj.accessToken)
    return { Authorization: obj.accessToken }
  } else {
    return {}
  }
}
