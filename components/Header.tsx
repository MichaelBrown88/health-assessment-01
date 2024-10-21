import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 flex justify-center items-center p-20 z-20">
      <Image src="/Primary_Logo_White.png" alt="Logo" width={150} height={50} priority />
    </header>
  );
};

export default Header;
