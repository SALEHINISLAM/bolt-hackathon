'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import logo from '/public/short_logo-removebg-preview.png';

const Header = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Find a Coach', href: '/coaches' },
    { name: 'Corporate', href: '/corporate' },
    { name: 'Newsletter', href: '/#newsletter' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const getUserDashboard = () => {
    if (!session?.user) return '/dashboard';
    
    const role = (session.user).role;
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'coach':
        return '/coach/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 p-1 rounded-lg flex items-center justify-center">
              {/* <User className="w-5 h-5 text-white" /> */}
              <Image
                src={logo}
                alt="Logo"
                width={500}
                height={500}
                className='object-contain'
              />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden xl:flex">Professional Update</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="font-medium">{session.user.name}</span>
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <Link
                        href={getUserDashboard()}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-800">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-800 hover:bg-blue-900 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-800 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-800 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-100">
                  {session?.user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 py-2">
                        {session.user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={session.user.image}
                            alt={session.user.name || ''}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{session.user.name}</span>
                      </div>
                      <Link
                        href={getUserDashboard()}
                        className="flex items-center text-gray-600 hover:text-blue-800 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center text-gray-600 hover:text-blue-800 py-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link href="/login">
                        <Button variant="ghost" className="text-gray-600 hover:text-blue-800 justify-start w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="bg-blue-800 hover:bg-blue-900 text-white w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;