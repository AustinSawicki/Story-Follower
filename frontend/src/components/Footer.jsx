export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
       <footer className=" py-4 shadow-inner">
        <div className="text-center text-gray-700">
          Story Follower &copy; {currentYear}
        </div>
      </footer>
    );
  }