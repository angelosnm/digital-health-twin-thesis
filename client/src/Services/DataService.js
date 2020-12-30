export default {
    postAlarmThresholds: thresh => {
        return fetch('/api/auth/doctor/alarming', {
            method: "post",
            body: JSON.stringify(thresh),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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