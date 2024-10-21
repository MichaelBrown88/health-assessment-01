import Image from 'next/image';

const Header = () => {
  return (
    <header className="absolute top-8 left-0 w-full z-50 flex justify-center">
      <div className="max-w-7xl w-full flex justify-center">
        <Image
          src="/Primary_Logo_White.png"
          alt="Logo"
          width={144}  // Increased by 20% from 120
          height={48}  // Increased by 20% from 40
          priority
        />
      </div>
    </header>
  );
};

export default Header;