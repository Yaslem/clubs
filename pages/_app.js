import '../styles/globals.css'
import axios from 'axios'
import store from '../redux/store'
import { Provider } from 'react-redux';
import {SessionProvider} from "next-auth/react";
import Layouts from "../components/Layouts";
import { DefaultSeo } from 'next-seo';
import {useRouter} from "next/router";
import SEO from '../seo.config';
import NextNProgress from 'nextjs-progressbar';
axios.defaults.baseURL = process.env.BASE_URL_API;
export default function App({ Component, pageProps }) {
    const router = useRouter()
    console.log('مرحبا بكم في موقع الأندية الطلابية بالجامعة الإسلامية!')
    switch (router.pathname) {
        case '/auth/register':
            return (
                <Provider store={store}>
                    <SessionProvider session={pageProps.session}>
                        <NextNProgress options={{ showSpinner: false }} stopDelayMs={10} color="#2d5e99" />
                        <Component {...pageProps} />
                    </SessionProvider>
                </Provider>
            );
            break;
        case '/auth/signin':
            return (
                <Provider store={store}>
                    <SessionProvider session={pageProps.session}>
                        <NextNProgress options={{ showSpinner: false }} stopDelayMs={10} color="#2d5e99" />
                        <Component {...pageProps} />
                    </SessionProvider>
                </Provider>
            );
            break;
        case '/auth/forgot-password':
            return (
                <Provider store={store}>
                    <SessionProvider session={pageProps.session}>
                        <NextNProgress options={{ showSpinner: false }} stopDelayMs={10} color="#2d5e99" />
                        <Component {...pageProps} />
                    </SessionProvider>
                </Provider>
            );
            break;
        case '/':
            return (
                <Provider store={store}>
                    <SessionProvider session={pageProps.session}>
                        <Layouts>
                            <NextNProgress options={{ showSpinner: false }} stopDelayMs={10} color="#2d5e99" />
                            <Component {...pageProps} />
                        </Layouts>
                    </SessionProvider>
                </Provider>
            );
            break;
        default:
            return (
                <Provider store={store}>
                    <SessionProvider session={pageProps.session}>
                        <DefaultSeo {...SEO} />
                        <Layouts>
                            <NextNProgress options={{ showSpinner: false }} stopDelayMs={10} color="#2d5e99" />
                            <Component {...pageProps} />
                        </Layouts>
                    </SessionProvider>
                </Provider>
            );
    }
}
