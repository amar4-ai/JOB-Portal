
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { ClerkProvider } from '@clerk/react'


//Import publish key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// if(!PUBLISHABLE_KEY){
//   throw new Error("Missing Publishable key")
// }

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log("VITE_CLERK_PUBLISHABLE_KEY value:", PUBLISHABLE_KEY)  // Add this

if (!PUBLISHABLE_KEY) {
  throw new Error(`Missing Publishable key. Got: ${PUBLISHABLE_KEY}`)
}


createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" >
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>

  </ClerkProvider>,
)
