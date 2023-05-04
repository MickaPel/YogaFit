import { User } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteUser, SignOutUser, userStateListener } from "../firebase/auth";

interface Props {
    children?: ReactNode
}

export const AuthContext = createContext({
    currentUser: {} as User | null,
    setCurrentUser: (_user:User) => {},
    signOut: () => {},
    // deleteUser: (_user:User) => {}
})

export const AuthProvider = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = userStateListener((user) => {
            if (user) {
                setCurrentUser(user)
            }
        });
        return unsubscribe
    }, [setCurrentUser]);

    const signOut = () => {
        SignOutUser()
        setCurrentUser(null)
        navigate('/')
    }

    // const deleteUser = (user : User) => {
    //     DeleteUser(user)
    // }

    const value = {
        currentUser, 
        setCurrentUser,
        signOut,
        // deleteUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}