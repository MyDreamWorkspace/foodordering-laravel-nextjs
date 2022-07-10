import axios from "axios";
import { REGISTER } from "../pages/register";
import { LOGIN } from "../types";


export const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials : true,
    headers: {'Content-Type': 'application/json'},
})

export const allMenus = (category? : string)=> category ? API.get(`menus?category=${category}`) : API.get(`menus`) ;
export const showMenus = (slug : string)=>  API.get(`menus/${slug}`);
export const allCategory = ()=> API.get(`categories`);

// auth
export const login = (data : LOGIN)=> {
        axios.get('http://localhost:8000/sanctum/csrf-cookie')
        return API.post(`login`,data)
};
export const register = (data : REGISTER)=> API.post(`register`,data);
export const logout = ()=> API.post(`logout`);

