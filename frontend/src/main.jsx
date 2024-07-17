import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ThemeProvider from './components/ThemeProvider.jsx';
import "./styles/tailwind.css";
import 'react-flow-renderer/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <div className='custom-scrollbar'>
      <App />
    </div>
)
