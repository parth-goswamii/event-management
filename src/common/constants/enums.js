export const setItem = (key, value) => {
    localStorage.setItem(key, value);
  };

export const getItem = ()=>{
  const getKey = localStorage.getItem("authToken")
  
  return getKey;
}

export const getItemProfileData = ()=>{
  const Profilekey = localStorage.getItem("profileData")

  return Profilekey
}

export const removeItem = (key) => {
  localStorage.removeItem(key);
};