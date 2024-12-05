fetch('http://localhost:8000/api/v1/auth/googleAuth', {
    method: 'GET',
    credentials: 'include', // Send cookies with the request
})
    .then((data) => {
        console.log('success', data);
        return fetch(data.url, {
            headers: data.headers,
            credentials: 'include',
        });
    })
    .then((d) => {
        console.log(d);
    })
    .catch((err) => console.error(err));
