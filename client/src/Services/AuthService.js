export default {
    login: user => {
        return fetch('/api/auth/login', {
            method: "post",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json())
            .then(data => data);
    },
    register: user => {
        return fetch('/api/auth/register', {
            method: "post",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json())
            .then(data => data);
    },
    logout: () => {
        return fetch('/api/auth/logout')
            .then(res => res.json())
            .then(data => data)
    },
    isAuthenticated: () => {
        return fetch('/api/auth/authenticated')
            .then(res => {
                if (res.status !== 401)
                    return res.json().then(data => data)
                else
                    return { isAuthenticated: false, user: { username: "" } }
            });
    }
}