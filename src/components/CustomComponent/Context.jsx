import { createContext, useState } from "react";

export const LoadingContext = createContext(false)

export const LoadingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}