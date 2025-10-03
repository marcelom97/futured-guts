# Quick Start Guide

This guide will help you get the Intelligent Student Grouping Platform up and running quickly.

## Prerequisites

- Node.js 18+ and pnpm installed
- Turso account and CLI installed
- AWS account with Bedrock access
- Claude 3.5 Sonnet model enabled in your AWS region

## Setup (5 minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Turso Database

This application uses Turso as the database. Follow these steps to set it up:

#### Install Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Sign up or login to Turso

```bash
turso auth signup
# or if you already have an account
turso auth login
```

#### Create a new database

```bash
turso db create futured-guts
```

#### Get your database credentials

Get the database URL:

```bash
turso db show --url futured-guts
```

Get the authentication token:

```bash
turso db tokens create futured-guts
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Turso Database Configuration
NUXT_TURSO_DATABASE_URL=<your-database-url-from-step-2>
NUXT_TURSO_AUTH_TOKEN=<your-auth-token-from-step-2>

# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

**Important Notes:**

- The database schema will be automatically initialized on first run
- Make sure your AWS account has access to Amazon Bedrock and the Claude 3.5 Sonnet model is enabled in your region

### 4. Start the Development Server

```bash
pnpm dev
```

The application will start at http://localhost:3000

## Quick Demo Walkthrough

### Step 1: Create Your First Questionnaire (2 minutes)

1. Open http://localhost:3000
2. Click **"New Questionnaire"**
3. Enter:
   - Title: "Fall 2024 Team Formation"
   - Description: "Assessment for project team assignments"
4. Click **"Generate with AI"**
5. Enter focus areas: `teamwork, leadership, communication, problem-solving`
6. Set number of questions: `8`
7. Click **"Generate Questions"**
8. Review the AI-generated questions and click **"Create Questionnaire"**

### Step 2: Add Students (1 minute)

1. Go back to the dashboard
2. Click **"View Students"**
3. Click **"Add Student"** for each student
4. Example students:
   - Alice Johnson, alice@school.edu
   - Bob Smith, bob@school.edu
   - Carol White, carol@school.edu
   - David Brown, david@school.edu

### Step 3: Have Students Complete the Questionnaire (2 minutes)

1. From the questionnaire detail page, click **"Copy Student Link"**
2. Open the link in a new browser tab (or share with students)
3. Fill out the form as each student:
   - Enter name and email
   - Answer all questions
   - Click **"Submit Responses"**
4. Repeat for multiple students (minimum 4-6 for good grouping results)

### Step 4: Generate AI-Powered Groups (1 minute)

1. Go back to the dashboard
2. Click **"Generate Groups"** for your questionnaire
3. Configure:
   - Number of Groups: `2`
   - Strategy: **"Balanced"**
4. Click **"Generate Groups with AI"**
5. Wait 5-10 seconds while the AI analyzes responses
6. Review the generated groups!

## What You'll See

### Generated Groups

The AI will create balanced teams and provide:

- **Group composition**: Students assigned to each team
- **Balance score**: How well-balanced the groups are (0-100)
- **AI analysis**: Explanation of the grouping decisions
- **Visual cards**: Easy-to-read group displays

### Grouping Strategies

Try different strategies to see how the AI adapts:

- **Balanced**: Mix different skill levels and personalities
- **Homogeneous**: Group similar students together
- **Diverse**: Maximize variety in each group

## Tips for Best Results

### For Question Generation

- Be specific with focus areas (e.g., "Python programming, data analysis" instead of just "coding")
- Use 6-12 questions for good balance
- Mix behavioral and hard skill questions

### For Student Grouping

- Have at least 6-8 students for meaningful groups
- Create 2-4 groups depending on class size
- Try different strategies to compare results
- Adjust trait weights if certain skills are more important

### Trait Weights

You can customize how much each trait influences grouping:

- Default weight: 1.0
- Important traits: 2.0-3.0
- Critical traits: 4.0-5.0
- Less important: 0.5

## Common Use Cases

### Project-Based Learning

1. Create questionnaire assessing:
   - Technical skills needed for the project
   - Teamwork and communication
   - Time management
2. Use **"Balanced"** strategy
3. Generate groups with mixed abilities

### Differentiated Instruction

1. Focus questionnaire on:
   - Subject matter proficiency
   - Learning pace preferences
2. Use **"Homogeneous"** strategy
3. Create groups at similar levels

### Creative Collaboration

1. Assess:
   - Creative thinking styles
   - Problem-solving approaches
   - Communication preferences
2. Use **"Diverse"** strategy
3. Maximize different perspectives

## Troubleshooting

### "Failed to generate questions"

- **Check AWS credentials** in .env file
- **Verify Bedrock access** in your AWS account
- **Confirm Claude 3.5 Sonnet** is enabled in your region
- Check the server console for detailed error messages

### "Failed to generate groups"

- **Ensure students have submitted responses** (at least 4-6)
- **Check that questionnaire has questions**
- Verify AWS credentials are valid
- Try generating again (AI generation can occasionally timeout)

### Database Issues

- The SQLite database is created automatically on first run
- Located at: `data/app.db`
- To reset: Delete `data/app.db` and restart the server

### Port Already in Use

If port 3000 is busy:

```bash
PORT=3001 pnpm dev
```

## Next Steps

1. **Customize Questions**: Edit generated questions to match your needs
2. **Adjust Weights**: Set custom weights for different traits
3. **Export Results**: Copy group compositions or take screenshots
4. **Try Different Strategies**: Compare balanced vs. diverse groupings
5. **Scale Up**: Add more students and create multiple questionnaires

## Example Scenarios

### Scenario 1: Software Development Project

**Questionnaire Focus**: `JavaScript, Git, teamwork, problem-solving, communication`

**Number of Questions**: 10

**Strategy**: Balanced (to ensure each team has a mix of technical and soft skills)

**Group Size**: 4-5 students per group

### Scenario 2: Marketing Campaign Project

**Questionnaire Focus**: `creativity, data analysis, communication, social media, presentation skills`

**Number of Questions**: 8

**Strategy**: Diverse (to bring different marketing perspectives and strengths together)

**Group Size**: 3-4 students per group

### Scenario 3: Math Study Groups

**Questionnaire Focus**: `algebra, calculus, problem-solving speed, study habits`

**Number of Questions**: 6

**Strategy**: Homogeneous (students at similar levels can work at the same pace)

**Group Size**: 3-4 students per group

## Support

- Check the main README.md for detailed documentation
- Review API endpoints in README.md for integration possibilities
- Inspect server console logs for debugging

## Production Deployment

Before deploying to production:

1. Add authentication (teacher/student login)
2. Use PostgreSQL instead of SQLite
3. Implement proper error handling
4. Add data validation
5. Set up HTTPS
6. Configure CORS properly
7. Add rate limiting for AI endpoints

Happy grouping! 🎓
