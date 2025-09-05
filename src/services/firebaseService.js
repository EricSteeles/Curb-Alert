import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { cloudinaryService } from './cloudinaryService';

// Collection names
const ITEMS_COLLECTION = 'items';

// Items Service
export const itemsService = {
 // Get all items
async getAllItems() {
  try {
    console.log('🔍 Fetching items from Firebase collection:', ITEMS_COLLECTION);
    const querySnapshot = await getDocs(
      query(
        collection(db, ITEMS_COLLECTION), 
        orderBy('posted', 'desc')
      )
    );
    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const item = {
        ...data,
        id: doc.id,  // MOVE THIS AFTER ...data TO OVERRIDE ANY NUMERIC ID
        posted: data.posted?.toDate?.() || new Date(data.posted)
      };
      items.push(item);
      console.log('📄 Found Firebase doc:', {id: doc.id, title: item.title});
    });
    console.log('✅ Firebase query complete. Found', items.length, 'items');
    return items;
  } catch (error) {
    console.error('❌ Error fetching items from Firebase:', error);
    throw error;
  }
},
  // Add new item
  async addItem(itemData, userId = 'anonymous') {
    try {
      console.log('➕ Adding new item to Firebase:', itemData.title);
      const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
        ...itemData,
        userId: userId,
        posted: Timestamp.fromDate(new Date()),
        status: 'available',
        views: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log('✅ Item added to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding item to Firebase:', error);
      throw error;
    }
  },

  // Update item
  async updateItem(itemId, updates) {
    try {
      console.log('🔄 Updating Firebase item:', itemId, updates);
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      console.log('✅ Firebase item updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating Firebase item:', error);
      throw error;
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      console.log('🗑️ ATTEMPTING TO DELETE Firebase document');
      console.log('   - Item ID:', itemId);
      console.log('   - ID Type:', typeof itemId);
      console.log('   - Collection:', ITEMS_COLLECTION);
      console.log('   - Full path: db/' + ITEMS_COLLECTION + '/' + itemId);
      
      // Check if document exists first
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      const docSnap = await getDoc(itemRef);
      
      if (docSnap.exists()) {
        console.log('✅ Document found in Firebase, proceeding with delete...');
        console.log('   - Document data:', docSnap.data());
        await deleteDoc(itemRef);
        console.log('✅ Firebase deleteDoc() completed successfully');
      } else {
        console.warn('⚠️ Document NOT FOUND in Firebase!');
        console.log('   - Attempted ID:', itemId);
        console.log('   - This explains why nothing was deleted');
        throw new Error(`Document with ID "${itemId}" does not exist in Firebase`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error deleting Firebase item:', error);
      throw error;
    }
  },

  // Update item status
  async updateItemStatus(itemId, status) {
    try {
      console.log('🔄 Updating Firebase item status:', itemId, 'to', status);
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      await updateDoc(itemRef, {
        status: status,
        updatedAt: Timestamp.now()
      });
      console.log('✅ Firebase item status updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating Firebase item status:', error);
      throw error;
    }
  }
};

// ADD THESE FUNCTIONS TO YOUR firebaseService.js (at the end, before the export)

// Moderation Service
export const moderationService = {
  // Report an item
  async reportItem(itemId, reportData) {
    try {
      console.log('📊 Reporting item:', itemId, reportData);
      
      const reportDoc = {
        itemId: itemId,
        reason: reportData.reason,
        description: reportData.description || '',
        reportedAt: Timestamp.now(),
        reportedBy: reportData.reportedBy || 'anonymous',
        status: 'pending', // pending, reviewed, resolved
        reviewedAt: null,
        reviewedBy: null,
        resolution: null
      };
      
      const docRef = await addDoc(collection(db, 'reports'), reportDoc);
      
      // Also flag the item itself
      await this.flagItem(itemId, true);
      
      console.log('✅ Report submitted with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error reporting item:', error);
      throw error;
    }
  },

  // Flag an item
  async flagItem(itemId, isFlagged = true) {
    try {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      await updateDoc(itemRef, {
        isFlagged: isFlagged,
        flaggedAt: isFlagged ? Timestamp.now() : null,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('❌ Error flagging item:', error);
      throw error;
    }
  },

  // Get all reports (admin only)
  async getAllReports() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'reports'),
          orderBy('reportedAt', 'desc')
        )
      );
      
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({
          id: doc.id,
          ...doc.data(),
          reportedAt: doc.data().reportedAt?.toDate?.() || new Date(doc.data().reportedAt)
        });
      });
      
      return reports;
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      throw error;
    }
  },

  // Get flagged items (admin only)
  async getFlaggedItems() {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, ITEMS_COLLECTION),
          where('isFlagged', '==', true),
          orderBy('flaggedAt', 'desc')
        )
      );
      
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          ...data,
          id: doc.id,
          posted: data.posted?.toDate?.() || new Date(data.posted),
          flaggedAt: data.flaggedAt?.toDate?.() || new Date(data.flaggedAt)
        });
      });
      
      return items;
    } catch (error) {
      console.error('❌ Error fetching flagged items:', error);
      throw error;
    }
  },

  // Review a report (admin only)
  async reviewReport(reportId, resolution, reviewedBy = 'admin') {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: 'reviewed',
        resolution: resolution,
        reviewedAt: Timestamp.now(),
        reviewedBy: reviewedBy
      });
      return true;
    } catch (error) {
      console.error('❌ Error reviewing report:', error);
      throw error;
    }
  },

  // Delete item and resolve reports (admin only)
  async deleteReportedItem(itemId, reportId, deletedBy = 'admin') {
    try {
      // Delete the item
      await itemsService.deleteItem(itemId);
      
      // Mark report as resolved
      if (reportId) {
        await this.reviewReport(reportId, `Item deleted by ${deletedBy}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error deleting reported item:', error);
      throw error;
    }
  },

  // Check if content contains prohibited words (basic filtering)
  containsProhibitedContent(text) {
    const prohibitedWords = [
      'scam', 'fraud', 'illegal', 'drugs', 'weapon', 'gun', 'explosive',
      'stolen', 'counterfeit', 'fake', 'phishing', 'spam'
    ];
    
    const lowerText = text.toLowerCase();
    return prohibitedWords.some(word => lowerText.includes(word));
  },

  // Auto-moderate content when posting
  async autoModerateItem(itemData) {
    const flags = [];
    
    // Check title and description for prohibited content
    if (this.containsProhibitedContent(itemData.title)) {
      flags.push('Prohibited content in title');
    }
    
    if (itemData.description && this.containsProhibitedContent(itemData.description)) {
      flags.push('Prohibited content in description');
    }
    
    // Check for suspicious patterns
    if (itemData.title.length < 3) {
      flags.push('Title too short');
    }
    
    if (itemData.contact && itemData.contact.includes('$')) {
      flags.push('Suspicious contact info');
    }
    
    return flags;
  }
};

// Image Service using Cloudinary
export const imageService = {
  // Upload multiple images
  async uploadImages(files, itemId) {
    try {
      // Validate all files first
      files.forEach(file => cloudinaryService.validateImage(file));
      
      // Upload to Cloudinary
      const results = await cloudinaryService.uploadImages(files, {
        folder: 'curb_alert_items'
      });
      
      // Return just the URLs for compatibility
      return results.map(result => result.url);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Get optimized image URL
  getOptimizedUrl(originalUrl, options = {}) {
    if (!cloudinaryService.getOptimizedUrl) {
      return originalUrl; // Fallback if function doesn't exist
    }
    return cloudinaryService.getOptimizedUrl(originalUrl, options);
  },

  // Get thumbnail URL
  getThumbnailUrl(originalUrl, size = 200) {
    if (!cloudinaryService.getThumbnailUrl) {
      return originalUrl; // Fallback if function doesn't exist
    }
    return cloudinaryService.getThumbnailUrl(originalUrl, size);
  }
};

// Search Service
export const searchService = {
  // Basic text search (client-side filtering)
  async searchItems(searchTerm, category, filters = {}) {
    try {
      let items = await itemsService.getAllItems();
      
      // Filter by status (only available by default)
      items = items.filter(item => item.status === 'available');
      
      // Text search
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        items = items.filter(item => 
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term))) ||
          (item.finalCategory && item.finalCategory.toLowerCase().includes(term)) ||
          item.category.toLowerCase().includes(term)
        );
      }
      
      // Category filter
      if (category && category !== '') {
        if (category === 'other' && filters.customCategory) {
          const customTerm = filters.customCategory.toLowerCase();
          items = items.filter(item => 
            (item.finalCategory && item.finalCategory.toLowerCase().includes(customTerm)) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(customTerm))) ||
            item.category === 'other'
          );
        } else if (category !== 'other') {
          items = items.filter(item => 
            item.category === category || item.finalCategory === category
          );
        }
      }
      
      // Location filter (basic string matching for now)
      if (filters.location && filters.location.trim()) {
        const locationTerm = filters.location.toLowerCase();
        items = items.filter(item => 
          item.location.toLowerCase().includes(locationTerm)
        );
      }
      
      return items;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  }
};

// Analytics Service (basic)
export const analyticsService = {
  // Increment view count
  async incrementViews(itemId) {
    try {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (itemDoc.exists()) {
        const currentViews = itemDoc.data().views || 0;
        await updateDoc(itemRef, {
          views: currentViews + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Don't throw error for analytics - just log it
    }
  }
};