import { PROXY } from "../etc/secrets/config";

async function userExists(email){
    const response = await fetch(`${PROXY}/userExists/${email}`)

    const output = await response.json();
    
    if (output != null){
        return output;
    }
    else{
        return false
    }
}

async function addUser(profile, role){
    const response = await fetch(`${PROXY}/users/update`, {
        method: "POST",
        body: JSON.stringify({"name": profile.name, "role": role, "email": profile.email}),
        headers: {
        'Content-Type': 'application/json'
        },
    }); 
} 

export {userExists, addUser};