import { baseUrl } from "./constance";


const fetchGet = async (endpoint: string) => {

    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data_res = await response.json();

        if (data_res.code == 20005) {
            await RefreshToken();
            return fetchGet(endpoint); // Gọi lại API sau khi refresh token
        }

        return data_res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const fetchPost = async (endpoint: string, data: unknown) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            return response
        }

        const data_res = await response.json();

        if (data_res.code == 20005) {
            await RefreshToken();
            return fetchPost(endpoint, data); // Gọi lại API sau khi refresh token
        }

        return data_res;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

const fetchPostForm = async (endpoint: string, data: any) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: data,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data_res = await response.json();

        if (data_res.code == 20005) {
            await RefreshToken();
            return fetchPost(endpoint, data); // Gọi lại API sau khi refresh token
        }

        return data_res;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};


const RefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {

        const response = await fetch(`${baseUrl}/admin/auth/refresh`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (response.ok) {
            const res_data = await response.json();
            const data = res_data.data;
            localStorage.setItem('accessToken', data.tokens.access_token);
            localStorage.setItem('refreshToken', data.tokens.refresh_token);
            localStorage.setItem('admin', JSON.stringify(data.admin));
        } else {
            console.error("Failed to refresh token:", await response.text());
        }

    } catch (error) {
        console.log("Error refreshing token:", error);
        localStorage.clear()
    }
}

export { fetchGet, fetchPost, RefreshToken, fetchPostForm };
