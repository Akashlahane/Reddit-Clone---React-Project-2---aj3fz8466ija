import type {AppProps} from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from "../chakra/theme";
import Layout from '@/component/Layout/Layout';
import { RecoilRoot } from 'recoil';
import { ColorModeScript } from '@chakra-ui/react';

function MyApp({Component, pageProps}: AppProps){
 return (
   <RecoilRoot>
    <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
     <Layout>
        <Component {...pageProps}/>
     </Layout>
    </ChakraProvider>
   </RecoilRoot>

 )
}

export default MyApp;