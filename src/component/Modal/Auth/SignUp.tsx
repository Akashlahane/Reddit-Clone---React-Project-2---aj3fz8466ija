import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { User } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const SignUp: React.FC= ()=>{
  const setAuthModalState=useSetRecoilState(authModalState)
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", confirmPassword: "",});
  const [error, setError] =useState('')
  const [createUserWithEmailAndPassword, userCred, loading, userError] = useCreateUserWithEmailAndPassword(auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  //firebaselogic
  const onSubmit=(event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(error){
      setError('');
    }
    if(signUpForm.password !== signUpForm.confirmPassword){
      //seterror
      setError("Password do not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
      setSignUpForm( prev =>({
            ...prev,
            [event.target.name]: event.target.value,
      }))
  };

  const createUserDocument = async(user: User)=>{
    await addDoc(collection(firestore,"users"),JSON.parse(JSON.stringify(user)));
  };

  useEffect(()=>{
    if(userCred){
      createUserDocument(userCred.user);
    }
  }, [userCred])

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

      <Flex position="relative">
        <Input 
          required 
          name="confirmPassword" 
          placeholder="confirm password" 
          type={showPassword2 ? "text" : "password"}   
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

        <Flex onClick={() => setShowPassword2(!showPassword)} position="absolute" 
          right="3%" alignSelf="center" top="25%" zIndex={10}>
          {!showPassword2 ? <FaEyeSlash /> : <FaEye />}
        </Flex>
      </Flex>

      <Text fontSize="9pt" color="gray.500" mb={2}>
        Password must have at least four characters, one number and one special character like '*', '@', '#'
      </Text>

      {(error || userError) && (<Text textAlign="center" color="red" fontSize="10pt">{error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}</Text>)}

      <Button width="100%" height="36px" mt={2} mb={2} type="submit" isLoading={loading}>SIGN UP</Button>

      <Flex fontSize="9pt" justifyContent="center">
          <Text mr={1}>Already a redditor?</Text>
          <Text color="blue.500" fontWeight={700} cursor="pointer" onClick={()=>
            setAuthModalState((prev)=>({
                ...prev,
                view:"login",
            }))
          }>LOG IN</Text>
      </Flex>
    </form>
  );
};
export default SignUp;