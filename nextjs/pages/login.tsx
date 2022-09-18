import { setCookie } from "cookies-next";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { login } from "../api";
import { AppState } from "../context/AppProvider";
import { LOGIN } from "../types";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import GuestLayout from "../components/Layouts/GuestLayout";
import image from "../public/assets/login.gif";
import Image from "next/image";
import SocialLogin from "../components/client/SocialLogin";
import LoginOrRegister from "../components/Form/LoginOrRegister";
import Input from "../components/Form/Input";
import PasswordInput from "../components/Form/PasswordInput";
import FormButton from "../components/Form/FormButton";

const Login: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LOGIN>({ email: "", password: "" });
  const route = useRouter();
  const { setUser } = AppState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      login(form)
        .then((response: any) => {          
          setUser(response.data);
          setCookie("jwt", response.data.token, {
            maxAge: 60 * 60 * 24 * 30, //1month
          });
          setCookie("fastfood_auth", response.data.user, {
            maxAge: 60 * 60 * 24 * 30, //1month
          });
          if (response.data.not_verified) {
            route.push(`/email-verification`);
            return;
          }
          route.push("/");
        })
        .catch((response) => {
          setLoading(false);
          toast.error(response.response?.data?.message);
        });
    }
  };

  return (
    <GuestLayout>
      <Head>
        <title>Fastfood | Login</title>
      </Head>
      
      <div className="w-full h-screen flex items-center px-3">
        <div className="fixed blur-sm	md:blur-none top-20 md:top-0 md:relative md:w-1/2 flex items-center justify-center">
          <Image src={image} alt="Image" />
        </div>
        <div className="w-full z-10 md:w-1/2 flex flex-col justify-center items-center md:p-3 py-10 h-full overflow-auto">
          <h1 className="text-3xl text-textGreen font-bold mb-3">
            Login Into Fastfood
          </h1>

          <form onSubmit={handleSubmit} className="w-full md:w-2/3">
          <Input
              title="Email"
              id="email"
              name="email"
              type="email"
              handleChange={handleChange}
              showError={false}
            />

            <PasswordInput
              title="Password"
              name="password"
              handleChange={handleChange}
              id="password"
              forgotPassword={true}
            />
            
            <FormButton 
              loading={loading} 
              text="Login" 
            />

          </form>

          <LoginOrRegister />

          <SocialLogin/>
          
        </div>
      </div>
    </GuestLayout>
  );
};

export default Login;
