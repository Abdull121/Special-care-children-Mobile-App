import React, { createContext, useState, useContext } from "react";

const EmailContext = createContext(null);

export const EmailProvider = ({ children }) => {
    const [getEmail, setEmail] = useState("");

    return (
        <EmailContext.Provider value={{ getEmail, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error("useEmail must be used within an EmailProvider");
    }
    return context;
};
