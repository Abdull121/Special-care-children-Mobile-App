
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
        CHILD_MODE_COLLECTION_ID: Constants.expoConfig.extra.CHILD_MODE_COLLECTION_ID,
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


    //get current Account id
    async  getAccount() {
        try {
          const currentAccount = await this. account.get();
      
          return currentAccount.$id;
        } catch (error) {
          throw new Error(error);
        }
      }


        // -> TasK service Started <-

        
    //task created

     async taskCreated (taskData) {
        const userId = await this.getAccount();
       
        try {
            const response = await this.databases.createDocument(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.scheduleCollectionId,
                ID.unique(),
                {
                    ...taskData,
                    userId: userId, // Store user ID separately
                }
                
                
            );
            return response;
        } catch (error) {
            console.error('Appwrite service :: createTask :: error: ', error);
            throw error;
        }
    }

    //get all tasks
    async getAllTasks(taskId) {
        //console.log(taskId)
        if(!taskId){
            const accountId = await this.getAccount();
        try {
            const response = await this.databases.listDocuments(
                this.appwriteConfig.appwriteDatabaseId,
                this.appwriteConfig.scheduleCollectionId,
                [Query.equal("userId", accountId)] 
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


            //get child mood for update because we need to update the child mood that required a document id
        async fetchChildMood() {

            try {
                const userId = await this.getAccount(); // Get current user
                console.log(userId)
                const response = await this.databases.listDocuments(
                    this.appwriteConfig.appwriteDatabaseId,
                    "67c3616c0031fd3e0340", // Collection ID
                    [Query.equal("id",userId)] // Fetch only current user’s todos
                );  
                    console.log("fetchChild Moode DATA",response.documents)
                return response.documents; // Returns an array of todo documents
            } catch (error) {
                console.error("Error fetching todos:", error);
                return [];
            }
        }


            //create child mood service
            async createChildMood (emoji, childMood, completedCount, totalTasks )  {
                
                console.log(emoji, childMood, completedCount, totalTasks)

               const dataExist = await this.fetchChildMood()
               console.log(dataExist.length)
                if(dataExist.length === 0 ){
                    console.log("data not exist")
                    // create new document
                    const userId = await this.getAccount();
                
                    try {
                        const response = await this.databases.createDocument(
                            this.appwriteConfig.appwriteDatabaseId,
                            "67c3616c0031fd3e0340",
                            ID.unique(),//attach user id to the child mood


                            //attributes fields
                            {
                                id:userId,
                                emoji: emoji,
                                childMood: childMood ,
                                totalTask:totalTasks.toString(),
                                completedTask:completedCount.toString()
        
                            }
                            
                            
                        );
                        return response;
                    } catch (error) {
                        console.error('Appwrite service :: createChildMood :: error: ', error);
                        throw error;
            }


                }
                return []
                

                
               
        }



        
        


            //update Child Mood
         async updateChildMood (emoji, childMood, completedCount, totalTasks, documentId )  {
            console.log(emoji, childMood, completedCount, totalTasks, documentId)


            
                try {
                    const response = await this.databases.updateDocument(
                        this.appwriteConfig.appwriteDatabaseId,
                        "67c3616c0031fd3e0340", // collection id
                        documentId,             // document id
                        {   emoji: emoji,
                            childMood: childMood ,
                            totalTask:totalTasks.toString(),
                            completedTask:completedCount.toString()


                         },
                         

                    );
                    return response;
                } catch (error) {
                    console.error('Appwrite service :: updateChild MOOD :: error: ', error);
                    throw error;
                }
            }

            // resources Section service for Games
            async getGames() {
                try {
                    const response = await this.databases.listDocuments(
                        this.appwriteConfig.appwriteDatabaseId,
                        "67df147d002ae55a92fd", // Collection ID for games
                       
                        
                    );
                    return response.documents; // Returns an array of todo documents
                } catch (error) {
                    console.error("Error fetching games:", error);
                    return [];
                }
            }
             // Community section services for posts

            async getPosts() {

                const currentAccount = await this. account.get();
                console.log("current Account",currentAccount)
                try {
                    const getChildDetails = await this.databases.listDocuments(
                        this.appwriteConfig.appwriteDatabaseId,
                        "67b49f530015792eaaff", // Collection ID for posts
                        [Query.equal("accountId", currentAccount.$id)] // Fetch only current user’s posts
                       
                        
                    );
                    console.log("getChildDetails", getChildDetails.documents[0].primaryCondition)
                    const childCondition = getChildDetails.documents[0].primaryCondition

                    if(childCondition){

                        try {
                            const getPost = await this.databases.listDocuments(
                                this.appwriteConfig.appwriteDatabaseId,
                                "67f00665002c47d85ce4", // Collection ID for posts
                                [Query.equal("category", childCondition)] // Fetch only current user’s posts
                               
                                
                            );
                            console.log("getPosts", getPost)
                            return getPost.documents; 
                        }
                        catch (error) {
                            console.error("Error fetching posts:", error);
                            return [];
                        }

                    }

                   
                } catch (error) {
                    console.error("Error fetching childDetails:", error);
                    return [];
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