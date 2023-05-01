async function userExists(email){
    const response = await fetch(`http://localhost:5000/userExists/${email}`)

    const output = await response.json();
    
    if (output != null){
        return true
    }
    else{
        return false
    }
}

export {userExists};