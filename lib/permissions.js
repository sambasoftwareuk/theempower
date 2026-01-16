import "server-only";
import { query } from "@/lib/db";

/**
 * Kullanıcının belirli bir content_group için yetkisi var mı kontrol eder
*
* @param {string} clerkUserId - Clerk'ten gelen user ID (varchar)
* @param {number} contentGroupId - Content Group ID
* @returns {Promise<boolean>} - true = yetkisi var, false = yetkisi yok
*/
export async function checkGroupPermission(clerkUserId, contentGroupId) {
  if (!clerkUserId || !contentGroupId) {
    return false;
  }
  
  try {
    // 1. Adım: users tablosundan id bul
    const userRows = await query(
      `SELECT id FROM users WHERE clerk_user_id = ? LIMIT 1`,
      [clerkUserId]
    );

    if (userRows.length === 0) {
      return false; // Kullanıcı bulunamadı
    }

    const userId = userRows[0].id;
    
    // 2. Adım: content_group_editors tablosunda kontrol et
    const editorRows = await query(
      `SELECT 1 FROM content_group_editors 
WHERE user_id = ? AND content_group_id = ? LIMIT 1`,
      [userId, contentGroupId]
    );

    return editorRows.length > 0; // Varsa true, yoksa false
  } catch (error) {
    console.error("checkGroupPermission error:", error);
    return false; // Hata durumunda güvenli tarafta kal (yetki verme)
  }
}
/**
 * Kullanıcının yetkili olduğu tüm content_group_id'leri döndürür
 */
export async function getUserContentGroups(clerkUserId) {
  if (!clerkUserId) {
    return [];
  }

  try {
    // 1. Adım: users tablosundan id bul
    const userRows = await query(
      `SELECT id FROM users WHERE clerk_user_id = ? LIMIT 1`,
      [clerkUserId]
    );
    
    if (userRows.length === 0) {
      return []; // Kullanıcı bulunamadı
    }
    
    const userId = userRows[0].id;

    // 2. Adım: content_group_editors tablosundan tüm content_group_id'leri bul
    const editorRows = await query(
      `SELECT content_group_id FROM content_group_editors 
       WHERE user_id = ?`,
      [userId]
    );

    // 3. Adım: Array olarak döndür (sadece content_group_id değerlerini)
    return editorRows.map((row) => row.content_group_id);
  } catch (error) {
    console.error("getUserContentGroups error:", error);
    return []; // Hata durumunda boş array döndür
  }
}