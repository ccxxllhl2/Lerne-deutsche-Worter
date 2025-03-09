import './globals.css';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';

export const metadata = {
  title: '德语词汇学习',
  description: '通过配套德国之声官方德语学习站点的词语复习APP',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          <Navbar />
          <main className="container-responsive mx-auto py-4 sm:py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
} 