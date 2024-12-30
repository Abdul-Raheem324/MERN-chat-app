export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const login = (token) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
};
