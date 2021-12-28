import {getProviders, signIn } from 'next-auth/react';

function Login({ providers }) {
    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
            <img className='w-52 mb-5' src="https://links.papareact.com/9xl" alt="" />
            {Object.values(providers).map(provider => (
                <div key={provider.name}><button className='bg-[#18D860] text-white p-5 rounded-lg'
                onClick={() => signIn(provider.id, { callbackUrl: '/'})} // redirect to / after login
                >
                    Login with {provider.name}</button></div>
            ))}
        </div>
    )
}

export default Login


export async function getServerSideProps(context) { // server side rendering
    const providers = await getProviders(); // get all providers

    return { 
        props: { 
            providers, //=> we pass the providers to the page
        }
    }
}