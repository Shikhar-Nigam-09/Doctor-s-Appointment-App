import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

   const backendURL = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";


  const calculateAge=(dob)=>{

    const today= new Date()
    const birthDate=new Date(dob)

    let age= today.getFullYear()-birthDate.getFullYear()

    return age

  }
  const value = {
    calculateAge,backendURL,currency
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;
