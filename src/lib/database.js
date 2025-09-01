import { databases, storage } from './appwrite';
import { ID, Query } from 'appwrite';

class DatabaseService {
    // Database operations
    async createDocument(databaseId, collectionId, data, documentId = ID.unique()) {
        try {
            return await databases.createDocument(
                databaseId,
                collectionId,
                documentId,
                data
            );
        } catch (error) {
            throw error;
        }
    }

    async getDocument(databaseId, collectionId, documentId) {
        try {
            return await databases.getDocument(databaseId, collectionId, documentId);
        } catch (error) {
            throw error;
        }
    }

    async listDocuments(databaseId, collectionId, queries = []) {
        try {
            return await databases.listDocuments(
                databaseId,
                collectionId,
                queries
            );
        } catch (error) {
            throw error;
        }
    }

    async updateDocument(databaseId, collectionId, documentId, data) {
        try {
            return await databases.updateDocument(
                databaseId,
                collectionId,
                documentId,
                data
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteDocument(databaseId, collectionId, documentId) {
        try {
            return await databases.deleteDocument(databaseId, collectionId, documentId);
        } catch (error) {
            throw error;
        }
    }

    // Query helpers
    createQuery() {
        return {
            equal: (attribute, value) => Query.equal(attribute, value),
            notEqual: (attribute, value) => Query.notEqual(attribute, value),
            lessThan: (attribute, value) => Query.lessThan(attribute, value),
            lessThanEqual: (attribute, value) => Query.lessThanEqual(attribute, value),
            greaterThan: (attribute, value) => Query.greaterThan(attribute, value),
            greaterThanEqual: (attribute, value) => Query.greaterThanEqual(attribute, value),
            search: (attribute, value) => Query.search(attribute, value),
            isNull: (attribute) => Query.isNull(attribute),
            isNotNull: (attribute) => Query.isNotNull(attribute),
            between: (attribute, start, end) => Query.between(attribute, start, end),
            startsWith: (attribute, value) => Query.startsWith(attribute, value),
            endsWith: (attribute, value) => Query.endsWith(attribute, value),
            select: (attributes) => Query.select(attributes),
            orderAsc: (attribute) => Query.orderAsc(attribute),
            orderDesc: (attribute) => Query.orderDesc(attribute),
            cursorAfter: (documentId) => Query.cursorAfter(documentId),
            cursorBefore: (documentId) => Query.cursorBefore(documentId),
            limit: (limit) => Query.limit(limit),
            offset: (offset) => Query.offset(offset),
        };
    }

    // Storage operations
    async uploadFile(bucketId, file, fileId = ID.unique(), permissions = []) {
        try {
            return await storage.createFile(bucketId, fileId, file, permissions);
        } catch (error) {
            throw error;
        }
    }

    async getFile(bucketId, fileId) {
        try {
            return await storage.getFile(bucketId, fileId);
        } catch (error) {
            throw error;
        }
    }

    async listFiles(bucketId, queries = []) {
        try {
            return await storage.listFiles(bucketId, queries);
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(bucketId, fileId) {
        try {
            return await storage.deleteFile(bucketId, fileId);
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(bucketId, fileId, width = 400, height = 400, quality = 100) {
        return storage.getFilePreview(bucketId, fileId, width, height, undefined, quality);
    }

    getFileDownload(bucketId, fileId) {
        return storage.getFileDownload(bucketId, fileId);
    }

    getFileView(bucketId, fileId) {
        return storage.getFileView(bucketId, fileId);
    }

    // Utility methods for common use cases
    async getUserDocuments(databaseId, collectionId, userId) {
        try {
            const query = this.createQuery();
            return await this.listDocuments(databaseId, collectionId, [
                query.equal('userId', userId),
                query.orderDesc('$createdAt')
            ]);
        } catch (error) {
            throw error;
        }
    }

    async searchDocuments(databaseId, collectionId, attribute, searchTerm) {
        try {
            const query = this.createQuery();
            return await this.listDocuments(databaseId, collectionId, [
                query.search(attribute, searchTerm)
            ]);
        } catch (error) {
            throw error;
        }
    }

    async getPaginatedDocuments(databaseId, collectionId, limit = 25, offset = 0) {
        try {
            const query = this.createQuery();
            return await this.listDocuments(databaseId, collectionId, [
                query.limit(limit),
                query.offset(offset),
                query.orderDesc('$createdAt')
            ]);
        } catch (error) {
            throw error;
        }
    }
}

export default new DatabaseService();
