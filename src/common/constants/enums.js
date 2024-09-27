export const setItem = (key, value) => {
    localStorage.setItem(key, value);
  };

export const getItem = ()=>{
  const getKey = localStorage.getItem("authToken")
  
  return getKey;
}