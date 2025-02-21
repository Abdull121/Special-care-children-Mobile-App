import { Client, Account, ID, OAuthProvider, Databases, Query } from "react-native-appwrite";
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from "expo-web-browser";





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
            throw new Error("Appwrite configuration is missing");
        }

        this.client
            .setEndpoint(this.appwriteConfig.appwriteUrl)
            .setProject(this.appwriteConfig.appwriteProjectId);

        this.account = new Account(this.client);
    }


    // constructor() {
    //     // Log the raw values first
    //     console.log('Raw config values:', {
    //         url: Constants.expoConfig.extra.APPWRITE_URL,
    //         projectId: Constants.expoConfig.extra.APPWRITE_PROJECT_ID
    //     });

    //     // Explicitly convert to strings and trim any whitespace
    //     const endpoint = String(Constants.expoConfig.extra.APPWRITE_URL).trim();
    //     const projectId = String(Constants.expoConfig.extra.APPWRITE_PROJECT_ID).trim();

    //     // Log the processed values
    //     console.log('Processed values:', {
    //         endpoint,
    //         projectId
    //     });

    //     try {
    //         this.client
    //             .setEndpoint(endpoint)
    //             .setProject(projectId);

    //         this.account = new Account(this.client);
    //         console.log('Client setup successful');
    //     } catch (error) {
    //         console.error('Setup error:', error);
    //         throw error;
    //     }
    // }



    async createAccount({ email, password, name }) {
        console.log(this.appwriteConfig)
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
            console.error("createAccount error::", error);
            throw error;
        }
    }

    async login({ email, password }) {
        console.log(email, password)
        try {
            if (!email || !password) {
                throw new Error("Missing email or password");
            }

            const currentUser = await this.getCurrentUser();
            if (currentUser) await this.logout();

            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("login error::", error);
            throw error;
        }
    }

    // Get Account
    async  getAccount() {
        try {
          const currentAccount = await this. account.get();
      
          return currentAccount;
        } catch (error) {
          throw new Error(error);
        }
      }


            

            // Get Current User
        async  getCurrentUser() {
            try {
                  //await this.account.deleteSessions();
            const currentAccount = await this.getAccount();
            // console.log("current Account",currentAccount)
            if (!currentAccount) throw Error;
        
            const currentUser = await this.databases.listDocuments(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.childCollectionId,
                [Query.equal("accountId", currentAccount.$id)]
            );

            console.log(currentUser.documents[0])
           
        
            if (!currentUser) throw Error;
        
            return currentUser.documents[0];
            } catch (error) {
            console.log(error);
            return null;
            }
        }


    







    //get user Avatar
    async getUserAvatar() {

        try {
            const response = await this.account.get();
            if(response.$id){
                const userAvatar = this.avatars.getInitials(response.name)
                return {...response, avatar: userAvatar.toString()} 
            }
        } catch (error) {
            console.error("getCurrentUser error::", error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("logout error::", error);
        }
    }


    async googleAuth() {
        try {
            const redirectUri = Linking.createURL("/");
            console.log("redirectUri:", redirectUri);
    
            const response = await this.account.createOAuth2Session(OAuthProvider.Google);
            if (!response) throw new Error("Google authentication failed");
    
            const browserResult = await openAuthSessionAsync(response.toString(), redirectUri);
            console.log('Browser Result:', browserResult);
            if (browserResult.type !== 'success') throw new Error("failed to login with google");
    
            // Make sure browserResult.url exists before creating URL object
            if (!browserResult.url) {
                throw new Error("No URL returned from Google auth");
            }
    
            const url = new URL(browserResult.url);
            const secret = url.searchParams.get('secret')?.toString();
            const userId = url.searchParams.get('userId')?.toString();
            if (!secret || !userId) throw new Error("Failed to login with google");
    
            const session = await this.account.createSession(userId, secret);
            if (!session) throw new Error("Failed to create session!");
            return true;
        } catch (error) {
            console.error("googleAuth error::", error);
            throw error;
        }
    }



    


   
    
    // async googleAuth() {
    //     try {
    //         // Use the default redirect URI provided by Appwrite
    //         const redirectUri = 'https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/67818fcb00244a465e51'; // Replace with your actual default callback URI
                
    //         console.log("Redirect URI:", redirectUri);  // Log for debugging
    
    //         // Step 1: Start the OAuth2 session with Google (Appwrite will handle the redirect)
    //         const response = await this.account.createOAuth2Session(OAuthProvider.Google, redirectUri);
    //         if (!response) throw new Error("Google authentication failed");
    
    //         // Step 2: Handle the browser authentication flow
    //         const browserResult = await openAuthSessionAsync(response.toString(), redirectUri);
    //         console.log('Browser Result:', browserResult);
    
    //         // Step 3: Check if authentication was successful
    //         if (browserResult.type === 'dismiss') {
    //             throw new Error("User dismissed the authentication window");
    //         }
    //         if (browserResult.type !== 'success') {
    //             throw new Error("Google authentication failed");
    //         }
    
    //         // Step 4: Ensure the callback URL is returned in the result
    //         if (!browserResult.url) {
    //             throw new Error("No URL returned from Google auth");
    //         }
    
    //         // Step 5: Parse the URL from the successful OAuth redirect
    //         const url = new URL(browserResult.url);
    //         const secret = url.searchParams.get('secret');
    //         const userId = url.searchParams.get('userId');
    
    //         if (!secret || !userId) throw new Error("Failed to login with Google: missing required parameters");
    
    //         // Step 6: Create session using the userId and secret returned
    //         const session = await this.account.createSession(userId, secret);
    //         if (!session) throw new Error("Failed to create session!");
    
    //         return true;  // Authentication was successful
    //     } catch (error) {
    //         console.error("googleAuth error::", error);
    //         Alert.alert("Google Auth Error", error.message); // Show error message to the user
    //         throw error;  // Rethrow the error for handling further up the stack
    //     }
    // }
    

    

    
};



    







const authService = new AuthService();

export default authService;

