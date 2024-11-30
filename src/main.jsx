import { PrimeReactProvider } from "primereact/api"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as StoreProvider } from 'react-redux'
import App from './App'

// PrimeReact CSS
import "primereact/resources/themes/lara-light-blue/theme.css"
import "primeicons/primeicons.css"
import "primereact/resources/primereact.min.css"

import './App.css'
import './index.css'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <StoreProvider store={store}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </StoreProvider>
  
)


// Compare this snippet from frontend/src/index.css: