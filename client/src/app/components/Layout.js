import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title ? `${title} | Magic of Belonging` : 'Magic of Belonging'}</title>
        <meta name="description" content="Connecting the Kenyan diaspora through stories and community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}