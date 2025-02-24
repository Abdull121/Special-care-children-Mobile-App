// src/services/appwrite.js

import { Client, Databases, Account, ID } from 'appwrite';
import Constants from 'expo-constants';

const client = new Client()
    .setEndpoint(Constants.expoConfig.extra.APPWRITE_URL)
    .setProject(Constants.expoConfig.extra.APPWRITE_PROJECT_ID);
    
export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = Constants.expoConfig.extra.APPWRITE_DATABASE_ID;
export const COLLECTION_ID = '67bb6b950013d42733ca';

// Task Service
export const TaskService = {
    // Create a new task
    createTask: async (taskData) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                taskData
            );
            return response;
        } catch (error) {
            console.error('Appwrite service :: createTask :: error: ', error);
            throw error;
        }
    },

    // Get all tasks
    getAllTasks: async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID
            );
            return response.documents;
        } catch (error) {
            console.error('Appwrite service :: getAllTasks :: error: ', error);
            throw error;
        }
    },

    // Update task status
    updateTaskStatus: async (taskId, status) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                taskId,
                { status }
            );
            return response;
        } catch (error) {
            console.error('Appwrite service :: updateTaskStatus :: error: ', error);
            throw error;
        }
    },

    // Delete task
    deleteTask: async (taskId) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                taskId
            );
            return true;
        } catch (error) {
            console.error('Appwrite service :: deleteTask :: error: ', error);
            throw error;
        }
    }
};