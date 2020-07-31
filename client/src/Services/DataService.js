export default {
    postAlarmThresholds: thresh => {
        return fetch('/user/alarming', {
            method: "post",
            body: JSON.stringify(thresh),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status !== 401) {
                return response.json().then(data => data);
            }
            else
                return { message: { msgBody: "Unauthorized" }, msgError: true };
        });
    }
}