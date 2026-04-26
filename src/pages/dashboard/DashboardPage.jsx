function DashboardPage() {
    const userString = localStorage.getItem('user')
    const user = userString && userString !== 'undefined'
        ? JSON.parse(userString)
        : null

    return (
        <div>
            <h1>Dashboard Page</h1>
            <p>Welcome: {user?.name || 'No name'}</p>
            <p>Email: {user?.email || 'No email'}</p>
        </div>
    )
}

export default DashboardPage