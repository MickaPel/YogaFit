import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { signInUser } from '../firebase/auth';

type AppUser = {
    email: string;
    password: string;
} 

const Login : React.FC = () => {

    const navigate = useNavigate()

    const [passVisibility, setPassVisibility] = useState<boolean>(false);
    const [confirmation, setConfirmation] = useState<boolean>(false);

    const showHidePass = () => {
        setPassVisibility(!passVisibility)
    }

    const formSchema = Yup.object().shape({
        email: Yup.string()
            .required("Ce champ est obligatoire")
            .matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `L'adresse mail n'est pas valide`),
        password: Yup.string()
            .required("Ce champ est obligatoire")
            .min(6, "Le mot de passe doit contenir au moins 6 caractères")
            .max(20, "Le mot de passe doit contenir au maximum 20 caractères")
    });

    //useForm call
    const { register, handleSubmit, formState: { errors } } = useForm<AppUser>({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
    });

    const onSubmit = async(data: AppUser) => {

        try {
            const userCredential = await signInUser(data.email, data.password)
    
            if (userCredential) {
                setConfirmation(true)
                console.log(userCredential)
                // navigate('/profile')
            }
        } catch (error:any) {
            console.log('User Sign In Failed', error.message);
        }
    }

    return(
        <div className='min-h-[calc(100vh-102px)]'>
            <div className="flex flex-col items-center relative md:pt-10 text-[#FFFC97]">
                <span className="flex-shrink mt-5 md:my-5 mx-4 text-xl md:text-2xl font-bold hover:underline">Login</span>
            </div>
            <div className="flex justify-center mt-8">
                <button type='button' className='flex w-40 mt-5 sm:w-96 mx-1 break-inside bg-[#8C9562] hover:bg-[#FFFC97] text-black border-2 border-black rounded-3xl px-6 py-1 sm:py-3 mb-4'
                // onClick={googleSignIn}
                >
                    <div className='m-auto'>
                        <div className='flex items-center justify-start flex-1 space-x-4'>
                            <svg width='25' height='25' viewBox='0 0 24 24'>
                                <path fill='currentColor'
                                    d='M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z' />
                            </svg>
                            <span className='font-medium mb-[-2px] text-xs sm:text-lg'>with Google</span>
                        </div>
                    </div>
                </button>
            </div>
            <p className="flex justify-center sm:py-5 text-sm sm:text-xl text-[#FFFC97]">Or</p>
            <div className='text-[#FFFC97]'>
                <form className="text-[#FFFC97]"
                onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col items-center">
                        <div className='flex flex-row w-64 sm:w-72 md:w-96 xl:w-1/4 content-start'>
                            <label className="mt-5 mb-5 ml-2 text-base sm:text-lg opacity-98">Email : </label>
                        </div>
                        <input className="rounded-xl bg-[#8C9562] border-2 border-[#243010] outline-[#243010] placeholder:text-[#D4D68c] text-black pl-2 opacity-75 focus:opacity-100 w-64 sm:w-72 md:w-96 xl:w-1/4 h-10" placeholder={`Your Email`}
                            {...register("email")}
                        />
                    </div>
                    {errors.email ? (<> <p className='fade-in mt-2 text-center text-red-800'>{errors.email?.message}</p> </>) : null}
                    <div className="flex flex-col items-center relative">
                        <div className='flex flex-row w-64 sm:w-72 md:w-96 xl:w-1/4 content-start '>
                            <label className="mt-5 mb-5 ml-2   text-base sm:text-lg opacity-98">Password : </label>
                        </div>
                        <div className="relative w-64 sm:w-72 md:w-96 xl:w-1/4">
                            <input className="rounded-xl bg-[#8C9562] border-2 border-[#243010] outline-[#243010] placeholder:text-[#D4D68c] text-black pl-2 opacity-75 focus:opacity-100 w-full h-10" type={passVisibility ? "text" : "password"} placeholder={`Password`}
                                {...register("password")}
                            />
                            {!passVisibility
                                ?
                                <Eye className="w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-2" color='#FFFC97' onClick={showHidePass} />
                                :
                                <EyeOff className="w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-2" color='#FFFC97' onClick={showHidePass} />
                            }
                        </div>
                    </div>
                    {errors.password ? (<> <p className='fade-in mt-2 text-center text-red-800'>{errors.password?.message}</p> </>) : null}
                    <div className="flex justify-center">
                        <button type="submit" className="py-2 px-8 sm:px-8 shadow-md shadow-stone-300/50 mt-5 sm:mt-10 rounded-md text-base sm:text-lg text-[#FFFC97]  font-semibold border-2 border-[#FFFC97]  hover:text-white hover:border-white hover:shadow-slate-200/50 ">Send</button>
                    </div>
                    {confirmation ? <p className="fade-in text-[#FFFC97] text-center mt-5">Welcome Back !</p> : <></>}
                </form>
            </div>
            <div className='flex flex-row justify-center'>
                <p className='mt-5 text-center text-[#FFFC97] underline cursor-pointer mr-3 text-sm' onClick={() => navigate('/signup')}>Not registered ?</p>
                <p className='mt-5 text-center text-[#FFFC97] underline cursor-pointer ml-3 text-sm' onClick={() => navigate('/signup')}>Forgotten password ?</p>
            </div>
        </div>
    )
}

export default Login