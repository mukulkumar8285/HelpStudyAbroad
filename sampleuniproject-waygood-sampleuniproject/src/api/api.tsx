const BASEURL = "http://localhost:3000/api";

export const loginAdmin = async (email: string, password: string) => {
  const response = await fetch(`${BASEURL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
};

export const loginRegister = async (email: string, password: string) => {
  const response = await fetch(`${BASEURL}/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
};