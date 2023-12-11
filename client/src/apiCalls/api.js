const { apiClient } = require("./axios");

export const login = async (username, password) => {
    const { data } = await apiClient.post("/login", {
        username,
        password,
    });
    return data;
    }

export const refreshToken = async (token) => {
    const { data } = await apiClient.post("/refresh", { token });
    return data;
    }

export const deleteUser = async (id, accessToken) => {
    const { data } = await apiClient.delete("/delete/" + id, {
        headers: {
            authorization: "Bearer " + accessToken,
        },
      });
      return data;
    }

    export const logOut = async (token) => {
        const { data } = await apiClient.post("/logout", { "token": token }, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    };
    