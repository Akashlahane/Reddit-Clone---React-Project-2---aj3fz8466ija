import React from "react";
import { useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

type LoginProps={}

const Login:React.FC<LoginProps> = ()=>{
  const setAuthModalState = useSetRecoilState(authModalState)
  const [form, setForm] = useState({email: "", password: "",});
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [showPassword, setShowPassword] = useState(false); 

  //firebaselogic
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Valid form inputs
    signInWithEmailAndPassword(form.email, form.password);
  };

  const onChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    setForm( prev =>({
          ...prev,
          [event.target.name]: event.target.value,
    }))
  };

  return(
    <form onSubmit={onSubmit}>
      <Input required
        name="email" placeholder="email"
        type="email" 
        mb={2} 
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{color: "gray.500"}}
        _hover= {{
            bg:'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}

        _focus= {{
            outline: 'none',
            bg:'white',
            border: '1px solid',
            borderColor: 'blue.500',
          }}

          bg="gray.50"
      />

      <Flex position="relative">
        <Input required 
          name="password" 
          placeholder="password" 
          type={showPassword ? "text" : "password"} 
          mb={2} 
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{color: "gray.500"}}
          _hover= {{
              bg:'white',
              border: '1px solid',
              borderColor: 'blue.500',
            }}

          _focus= {{
              outline: 'none',
              bg:'white',
              border: '1px solid',
              borderColor: 'blue.500',
            }}

            bg="gray.50"
        />

        <Flex onClick={() => setShowPassword(!showPassword)} position="absolute" 
          right="3%" alignSelf="center" top="25%" zIndex={10}>
          {!showPassword ? <FaEyeSlash /> : <FaEye />}
        </Flex>
      </Flex>


      {error && (<Text textAlign="center" mt={2} fontSize="10pt" color="red">
      
        {FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
        
      </Text>)}

      <Button width="100%" height="36px" mt={2} mb={2} type="submit">Login</Button>

      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() => 
            setAuthModalState((prev)=>({
                ...prev,
                view: "resetPassword"
          }))}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text color="blue.500" fontWeight={700} cursor="pointer" onClick={()=>
          setAuthModalState((prev)=>({
              ...prev,
              view:"signup",
          }))
        }>SIGN UP</Text>
      </Flex>
    </form>
  )
}

export default Login;