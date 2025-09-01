import DatabaseService from './database';
import { ID } from 'appwrite';

// You'll need to create these in your Appwrite Console
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'todos_db';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID || 'todos';

class TodoService {
    // Create a new todo
    async createTodo(userId, title, description = '') {
        try {
            const todoData = {
                title,
                description,
                completed: false,
                userId
            };

            return await DatabaseService.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                todoData,
                ID.unique()
            );
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    }

    // Get all todos for a user
    async getTodos(userId) {
        try {
            const query = DatabaseService.createQuery();
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.orderDesc('$createdAt')
                ]
            );
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    }

    // Update a todo
    async updateTodo(todoId, updates) {
        try {
            return await DatabaseService.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                todoId,
                updates
            );
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    // Toggle todo completion
    async toggleTodo(todoId, currentStatus) {
        try {
            return await this.updateTodo(todoId, {
                completed: !currentStatus
            });
        } catch (error) {
            console.error('Error toggling todo:', error);
            throw error;
        }
    }

    // Delete a todo
    async deleteTodo(todoId) {
        try {
            return await DatabaseService.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                todoId
            );
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }

    // Get completed todos
    async getCompletedTodos(userId) {
        try {
            const query = DatabaseService.createQuery();
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.equal('completed', true),
                    query.orderDesc('$updatedAt')
                ]
            );
        } catch (error) {
            console.error('Error fetching completed todos:', error);
            throw error;
        }
    }

    // Get pending todos
    async getPendingTodos(userId) {
        try {
            const query = DatabaseService.createQuery();
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.equal('completed', false),
                    query.orderDesc('$createdAt')
                ]
            );
        } catch (error) {
            console.error('Error fetching pending todos:', error);
            throw error;
        }
    }

    // Search todos
    async searchTodos(userId, searchTerm) {
        try {
            const query = DatabaseService.createQuery();
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.search('title', searchTerm)
                ]
            );
        } catch (error) {
            console.error('Error searching todos:', error);
            throw error;
        }
    }
}

export default new TodoService();
