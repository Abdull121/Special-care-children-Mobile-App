
import { Client, ID, Databases, Storage,Query,Avatars, Account } from "react-native-appwrite";
import Constants from 'expo-constants';

export class Service{
    client = new Client();
    databases;
    bucket;

    appwriteConfig = {
        appwriteUrl: Constants.expoConfig.extra.APPWRITE_URL,
        appwriteProjectId: Constants.expoConfig.extra.APPWRITE_PROJECT_ID,
        appwriteDatabaseId: Constants.expoConfig.extra.APPWRITE_DATABASE_ID,
        userCollectionId: Constants.expoConfig.extra.USER_COLLECTION_ID,
        childCollectionId: Constants.expoConfig.extra.CHILD_COLLECTION_ID,
        scheduleCollectionId: Constants.expoConfig.extra.SCHEDULE_COLLECTION_ID,
        platform: Constants.expoConfig.extra.PLATFORM,
    };
    
    constructor(){
        this.client
        .setEndpoint(this.appwriteConfig.appwriteUrl)
        .setProject(this.appwriteConfig.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.avatars = new Avatars(this.client)
        this.account = new Account(this.client);
    }

    async createChildProfile({childName, age, primaryCondition}){

        const currentAccount = await this. account.get();

        const avatarUrl = this.avatars.getInitials(childName);
        try {
           const childAccount = await this.databases.createDocument(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.childCollectionId,
                ID.unique(),
                
                {
                   childName,
                     age,
                    primaryCondition,
                    avatar: avatarUrl.toString(),
                    accountId: currentAccount.$id
                    
                    
                }
                
            )

            if(!childAccount) throw ERROR
            return childAccount;
                 


        } catch (error) {
            console.log("Appwrite serive :: createChileProfile :: error", error);
        }
    }


    //task created

     async taskCreated (taskData) {
        try {
            const response = await this.databases.createDocument(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.scheduleCollectionId,
                ID.unique(),
                taskData
                
                
            );
            return response;
        } catch (error) {
            console.error('Appwrite service :: createTask :: error: ', error);
            throw error;
        }
    }

    //get all tasks
     async getAllTasks  (taskId)  {
        if(!taskId){
            try {
                const response = await this.databases.listDocuments(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.scheduleCollectionId,
                
                );
                return response.documents;
            } catch (error) {
                console.error('Appwrite service :: getAllTasks :: error: ', error);
                throw error;
            }
        }
        else{
            try {
                const response = await this.databases.listDocuments(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.scheduleCollectionId,
                [Query.equal("id", taskId)]
                
                );
                return response.documents;
            } catch (error) {
                console.error('Appwrite service :: getAllTasks :: error: ', error);
                throw error;
            }
            
        }
            
        }

        //Update task status
         async updateTaskStatus (documentId, newStatus )  {
            console.log(documentId, newStatus)
                try {
                    const response = await this.databases.updateDocument(
                        this.appwriteConfig.appwriteDatabaseId,
                        this.appwriteConfig.scheduleCollectionId,
                        documentId,
                        { status: newStatus }
                    );
                    return response;
                } catch (error) {
                    console.error('Appwrite service :: updateTaskStatus :: error: ', error);
                    throw error;
                }
            }


   
    
    

   
     
            

           
            





    // file upload service

    // async uploadFile(file){
    //     try {
    //         return await this.bucket.createFile(
    //             conf.appwriteBucketId,
    //             ID.unique(),
    //             file
    //         )
    //     } catch (error) {
    //         console.log("Appwrite serive :: uploadFile :: error", error);
    //         return false
    //     }
    // }

    

    // getFilePreview(fileId){
    //     return this.bucket.getFilePreview(
    //         conf.appwriteBucketId,
    //         fileId
    //     )
    // }
}


const service = new Service()
export default service