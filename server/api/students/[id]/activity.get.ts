import { getDatabase } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const studentId = getRouterParam(event, 'id')
    
    if (!studentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Student ID is required'
      })
    }

    const db = getDatabase()

    // Get recent activities for the student
    // This combines questionnaire responses and group memberships
    const activities = db.prepare(`
      SELECT 
        'questionnaire' as type,
        q.id,
        q.title,
        'Completed questionnaire: ' || q.title as description,
        r.created_at as timestamp
      FROM responses r
      JOIN questionnaires q ON r.questionnaire_id = q.id
      WHERE r.student_id = ?
      
      UNION ALL
      
      SELECT 
        'group' as type,
        g.id,
        g.name as title,
        'Joined group: ' || g.name || ' for ' || q.title as description,
        gm.created_at as timestamp
      FROM group_members gm
      JOIN groups g ON gm.group_id = g.id
      JOIN questionnaires q ON g.questionnaire_id = q.id
      WHERE gm.student_id = ?
      
      ORDER BY timestamp DESC
      LIMIT 10
    `).all(studentId, studentId)

    return {
      success: true,
      activities: activities || []
    }
  } catch (error) {
    console.error('Failed to fetch student activity:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student activity'
    })
  }
})