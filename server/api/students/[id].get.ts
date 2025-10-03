import { getDatabase } from '../../utils/db'

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

    // Get student details
    const student = db.prepare(`
      SELECT 
        id,
        name,
        email,
        teacher_id,
        created_at
      FROM students 
      WHERE id = ?
    `).get(studentId)

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found'
      })
    }

    return {
      success: true,
      student
    }
  } catch (error) {
    console.error('Failed to fetch student:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student details'
    })
  }
})