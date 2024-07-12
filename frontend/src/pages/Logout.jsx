function Logout() {
    useEffect(() => {
        removeToken()
    }, [])

    function removeToken() {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    }

    return (<div>Logging Out...</div>)
}

export default Logout