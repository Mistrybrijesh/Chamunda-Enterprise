import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Chamunda Enterprise — Premium Furniture Store',
  description: 'Chamunda Enterprise offers premium quality furniture for every room. Sofas, beds, tables, chairs and more at unbeatable prices.',
  keywords: 'Chamunda Enterprise, furniture, sofa, bed, table, chair, home decor, buy furniture online India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
