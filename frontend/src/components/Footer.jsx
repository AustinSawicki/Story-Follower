export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
       <footer className=" py-4 shadow-inner">
        <div className="text-center">
          Story Follower &copy; {currentYear}
        </div>
      </footer>
    );
  }