
export async function getAccessToken(code) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
            client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
            code,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to exchange code for access token");
    }

    const data = await response.json();
    return data.access_token;
}

export async function getGitHubUser(token) {
    const response = await fetch(`${import.meta.env.VITE_GITHUB_API_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch GitHub user");
    }

    return response.json();
}