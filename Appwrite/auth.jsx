import { Client, Account, ID } from "react-native-appwrite";
import Constants from 'expo-constants';


export class AuthService {


    appwriteConfig = {
        appwriteUrl: Constants.expoConfig.extra.APPWRITE_URL,
        appwriteProjectId: Constants.expoConfig.extra.APPWRITE_PROJECT_ID,
        appwriteDatabaseId: Constants.expoConfig.extra.APPWRITE_DATABASE_ID,
        platform: Constants.expoConfig.extra.PLATFORM,
    };


    client = new Client();
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
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            return userAccount;
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

    async getCurrentUser() {
        try {
            return await this.account.get();
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
            this.account.createOAuth2Session(
                "google",
                Constants.expoConfig.extra.SUCCESS_REDIRECT_URL,
                Constants.expoConfig.extra.FAILURE_REDIRECT_URL
            );
        } catch (error) {
            console.error("googleAuth error::", error);
            throw error;
        }
    }
}


const authService = new AuthService();

export default authService;

