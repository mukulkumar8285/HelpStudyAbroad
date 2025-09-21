const Settoken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};
const Gettoken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
const RemoveToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
export { Settoken, Gettoken, RemoveToken };
