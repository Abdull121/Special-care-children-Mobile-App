import { Client, Account, ID,  Databases, Query, } from "react-native-appwrite";
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export class AuthService {


    appwriteConfig = {
        appwriteUrl: Constants.expoConfig.extra.APPWRITE_URL,
        appwriteProjectId: Constants.expoConfig.extra.APPWRITE_PROJECT_ID,
        appwriteDatabaseId: Constants.expoConfig.extra.APPWRITE_DATABASE_ID,
        userCollectionId: Constants.expoConfig.extra.USER_COLLECTION_ID,
        childCollectionId: Constants.expoConfig.extra.CHILD_COLLECTION_ID,
        platform: Constants.expoConfig.extra.PLATFORM,
    };
    


    client = new Client();
    // avatars = new Avatars(this.client)
    // Create databases instance
    databases = new Databases(this.client);
    account;

    constructor() {
        // console.log(this.appwriteConfig.appwriteUrl)



        if (!this.appwriteConfig.appwriteUrl || !this.appwriteConfig.appwriteProjectId) {
            //throw new Error("Appwrite configuration is missing");
            return null;
        }

        this.client
            .setEndpoint(this.appwriteConfig.appwriteUrl)
            .setProject(this.appwriteConfig.appwriteProjectId);

        this.account = new Account(this.client);
    }


    


    async createAccount({ email, password, name }) {
        //console.log(this.appwriteConfig)
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (!userAccount) throw Error;
            // const avatarUrl = this.avatars.getInitials(name);
            await this.login({email, password});

            // Store user in database using the class instance of databases
                const newUser = await this.databases.createDocument(
            this.appwriteConfig.appwriteDatabaseId,
            this.appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: userAccount.$id,
                email: email,
                name: name,
                // avatar: avatarUrl.toString()
            }
        );


            return newUser;
        } catch (error) {
            // console.error("createAccount error::", error);
            // throw error;
            return null;
        }
    }

    async login({ email, password }) {
        try {
          if (!email || !password) {
            throw new Error("Missing email or password");
          }
      
          // Check for existing session
          try {
            const currentAccount = await this.account.get();
            if (currentAccount) {
              // Delete all active sessions
              await this.account.deleteSessions();
            }
          } catch (error) {
            // Ignore "user not logged in" errors
            if (error.code !== 401) {
              console.warn("Session cleanup warning:", error);
            }
          }
      
          // Create new session
          return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
          // console.log("Login error:", error);
          
          
          // Handle specific session conflict error
          if (error.code === 409) {
            throw new Error("Session already exists. Please logout first.");
          }
          
          throw error;
        }
      }

    // Get Account
    async  getAccount() {
        try {
          const currentAccount = await this. account.get();
      
          return currentAccount;
        } catch (error) {
          //console.log("getAccount error::", error);
          return null;
          // throw new Error(error);
        }
      } 


            

            // Get Current User  and use in GlobalProvider
        async  getCurrentUser() {
            try {
                //await this.account.deleteSessions();
                const googleAuthId = await SecureStore.getItemAsync('token');
                //console.log("Stored token (Google Auth ID) Global State:", googleAuthId);

                let userId = null;
          try {
            userId = await this.getAccount();
          } catch (err) {
            //console.log("No current Appwrite account session found:", err.message);
            return null;
          }

          const currentAccount = userId?.$id || googleAuthId;
          if (!currentAccount) {
            //console.log("No authenticated user found.");
            return false;
          }


            // const currentAccount = await this.getAccount();
             //console.log("current Account",currentAccount)
            //  if (!currentAccount) {
            //     // console.log("No authenticated user found.");
            //     return false;
            // }
        
            const currentUser = await this.databases.listDocuments(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.childCollectionId,
                [Query.equal("accountId", currentAccount)]
                
            );

            if (!currentUser.documents.length) {
                // console.log("No user found in the database for the current account.");
                return null;
            }

            // console.log(currentUser.documents[0])
            // console.log("current user",currentAccount)
           
        
            // if (!currentUser) throw Error;
        
            return currentUser.documents[0];
            }
             catch (error) {
                if (
                    error.message.includes("missing scope (account)") ||
                    error.code === 401 || // Unauthorized
                    error.code === 403    // Forbidden
                  ) {
                    // console.log("User not authenticated");
                    return false; // User is not authenticated
                  } 
                  // else {
                  //   // console.error("Error in getCurrentUser:", error);
                    
                  // }
                  return null;
            }
        }


    

    

    async logout(signOut) {
        try {
            // 1. Always clear Clerk session first (regardless of Appwrite status)
            try {
                await signOut();
                // console.log("Clerk signOut completed successfully");
            } catch (clerkError) {
                // console.error("Error signing out from Clerk:", clerkError);
                return null; // Return null to indicate failure
            }
            
            // 2. Then clear all local tokens
            await SecureStore.deleteItemAsync('token');
            
            // 3. Finally, clean up Appwrite sessions
            try {
                const currentAccount = await this.account.get();
                if (currentAccount) {
                    await this.account.deleteSessions();
                    // console.log("Appwrite account sessions deleted successfully");
                }
            } catch (appwriteError) {
                // console.log("No active Appwrite session found:", appwriteError.message);
                return null; // Return null to indicate failure
            }
        } catch (error) {   
            // console.error("Logout error:", error);
            // throw error; 
            return null; // 
        }
    }


  

    
    

    
};





const authService = new AuthService();

export default authService;

