import { get, post } from "./api";

export async function signup({ email, password, displayName }) {
    return post('/auth/signup', { email, password, displayName});
}

export async function login({ email, password }) {
    return post('/auth/login', { email, password });
}

export async function logout(){
    return post('/auth/logout', {});
}

export async function me(){ 
    return get('/auth/me');
}