import { Button } from "@/components/ui/button";
import { AlertDestructive } from '@/components/ui/AlertDestructive';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
//import { Label } from "@/components/ui/label";
import { JSX, useEffect, useState } from "react";
import axios, {AxiosError, AxiosResponse} from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addUser } from "@/redux/features/userSlice";
import api from "@/lib/axios";

type formData = {
  email: string,
  password: string
}

type responseData = {
  email: string,
  token: string,
  user_id: number
}

type ErrorResponse = {
  error: string | null;
};
  
function Login(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token || user) {
      navigate("/home");
    }
  }, [user, navigate]);

  if(user){
    navigate('/home');
  }

  const handleClick = async () =>{
    try{
      const formInput:formData = {email: email, password: password};
      const response: AxiosResponse = await api.post('/api/user/login', formInput);
      const dataFromAPI: responseData = response.data;
      const { token, user_id } = response.data;
      console.log(response.data);
      console.log(dataFromAPI);
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      
      dispatch(addUser({email: dataFromAPI.email, token: dataFromAPI.token}));// no need to store the token in redux
      setEmail('');
      setPassword('');
      setError(null);
      navigate('/home');
    } catch(err: unknown){
      if(axios.isAxiosError(err)){
        const newError = err as AxiosError<ErrorResponse>;
        setError(newError.response?.data?.error ?? 'Unknown error');
      }else{
        console.log("Non-Axios error, most likely internal server error.");
      }
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key == 'Enter'){
      handleClick();
    }
  }

  //basically shadcn will give us the base of the component
  //then we have to add all the stuff we want on top
  return (
    <div className='flex flex-col justify-center h-[calc(90vh-90px)] items-center w-full'>
      <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-transparent bg-clip-text">Login</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-4">
          <div className="flex flex-col items-start space-y-2">
            <Label htmlFor="email" >
              Email
            </Label>
            <Input id="email" type="email" placeholder="m@example.com" onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} value={email}/>
          </div>
          <div className="flex flex-col items-start space-y-2">
            <Label htmlFor="password" >
              Password
            </Label>
            <Input id="password" onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} type="password" value={password}/>
          </div>
        </div>
          
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={handleClick}>Login</Button> 
        </CardFooter>
      </Card>
      {error && <AlertDestructive error={error}/>}
  </div>
  )
}

export default Login;