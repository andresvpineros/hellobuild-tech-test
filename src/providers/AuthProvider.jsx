import { Auth0Provider } from '@auth0/auth0-react';

const AuthProvider = ({ children }) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    const onRedirectCallback = (appState) => {
        console.log("Auth0 Redirect Callback State:", appState);

        window.history.replaceState(
            {},
            document.title,
            appState?.returnTo || window.location.pathname
        );
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                scope: "openid profile email",
                audience: audience,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default AuthProvider;
