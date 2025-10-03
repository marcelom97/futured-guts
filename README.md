# Intelligent Student Grouping Platform

A web-based platform that enables teachers to intelligently group students based on responses to customizable questionnaires. The system uses AI-driven grouping to create optimized teams based on behavioral traits and hard skills.

## Features

### For Teachers

- **Questionnaire Management**

  - Create custom questionnaires with various question types (scale, multiple choice, text)
  - AI-powered question generation based on focus areas
  - Customize traits and weights for different criteria
  - Share questionnaire links with students

- **Student Management**

  - Add and manage student rosters
  - Track student responses
  - View response analytics

- **AI-Driven Grouping**
  - Three grouping strategies:
    - **Balanced**: Mix students with different strengths for well-rounded teams
    - **Homogeneous**: Group students with similar skill levels
    - **Diverse**: Maximize diversity across all traits
  - Customizable number of groups
  - Balance scoring and diversity metrics
  - Visual group composition display

### For Students

- **Simple Response Interface**
  - Easy-to-use questionnaire forms
  - Multiple question types support
  - Progress tracking
  - Submission confirmation

## Tech Stack

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **UI Components**: Nuxt UI (TailwindCSS)
- **Backend**: Nuxt Server API
- **Database**: Turso (libSQL/SQLite)
- **AI**: AWS Bedrock (Claude 3.5 Sonnet)
- **AI SDK**: Vercel AI SDK

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Turso account and CLI
- AWS credentials with Bedrock access

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   # Create .env file
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

4. Create the data directory:

   ```bash
   mkdir -p data
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── pages/                    # Vue pages/routes
│   │   ├── index.vue            # Teacher dashboard
│   │   ├── students/            # Student management
│   │   ├── questionnaires/      # Questionnaire CRUD
│   │   └── respond/             # Student response forms
│   └── app.vue                  # Root component
├── server/
│   ├── api/                     # API endpoints
│   │   ├── questionnaires/      # Questionnaire endpoints
│   │   ├── students/            # Student endpoints
│   │   ├── responses/           # Response endpoints
│   │   ├── groups/              # Group endpoints
│   │   ├── trait-weights/       # Trait weight management
│   │   └── ai/                  # AI-powered endpoints
│   │       ├── generate-questions.post.ts
│   │       └── generate-groups.post.ts
│   └── utils/
│       └── db.ts                # Database initialization
├── types/
│   └── index.ts                 # TypeScript types
└── data/
    └── app.db                   # SQLite database
```

## Database Schema

- **teachers**: Teacher accounts
- **students**: Student roster
- **questionnaires**: Custom questionnaires
- **questions**: Individual questions with traits and weights
- **responses**: Student responses to questions
- **groups**: Generated student groups
- **group_members**: Group membership mappings
- **trait_weights**: Custom weights for grouping criteria

## API Endpoints

### Questionnaires

- `GET /api/questionnaires` - List questionnaires
- `POST /api/questionnaires` - Create questionnaire
- `GET /api/questionnaires/:id` - Get questionnaire details

### Students

- `GET /api/students` - List students
- `POST /api/students` - Add student

### Responses

- `POST /api/responses` - Submit student responses
- `GET /api/responses/questionnaire/:id` - Get responses for questionnaire

### Groups

- `GET /api/groups/questionnaire/:id` - Get groups for questionnaire
- `PATCH /api/groups/:id` - Update group

### AI

- `POST /api/ai/generate-questions` - AI question generation
- `POST /api/ai/generate-groups` - AI-powered student grouping

### Trait Weights

- `POST /api/trait-weights` - Update trait weights

## AI Features

### Question Generation

The platform uses Claude 3.5 Sonnet to generate contextually relevant questions based on:

- Focus areas specified by the teacher
- Question type requirements (scale, multiple choice, text)
- Category (behavioral traits vs. hard skills)

### Student Grouping Algorithm

The AI analyzes student profiles and creates optimal groups by:

1. Processing all student responses
2. Normalizing scores across different traits
3. Applying custom trait weights
4. Using the selected grouping strategy
5. Generating balanced, diverse, or homogeneous groups
6. Providing reasoning and metrics for each grouping

## Usage Guide

### Creating a Questionnaire

1. Navigate to the dashboard
2. Click "Create Questionnaire"
3. Enter title and description
4. Either:
   - Use AI to generate questions by specifying focus areas
   - Manually add questions
5. Customize question weights and traits
6. Save the questionnaire

### Distributing to Students

1. Open the questionnaire details
2. Click "Copy Student Link"
3. Share the link with your students

### Viewing Responses

1. Navigate to the questionnaire
2. Click "View Responses"
3. Review individual student responses

### Generating Groups

1. Go to questionnaire groups page
2. Select number of groups
3. Choose grouping strategy
4. Click "Generate Groups with AI"
5. Review the generated groups and AI analysis
6. Edit groups manually if needed

## Configuration

### Grouping Strategies

**Balanced** (Default)

- Best for: General project teams
- Creates: Well-rounded teams with mixed abilities
- Use when: You want diverse skill sets in each group

**Homogeneous**

- Best for: Differentiated instruction
- Creates: Groups with similar skill levels
- Use when: You want students working at similar paces

**Diverse**

- Best for: Creative projects
- Creates: Maximum trait diversity
- Use when: You want the widest range of perspectives

### Trait Weights

Teachers can adjust the importance of different traits:

- Default weight: 1.0
- Range: 0.0 - 5.0
- Higher weight = more influence on grouping

## Development

### Running Tests

```bash
pnpm test
```

### Building for Production

```bash
pnpm build
```

### Linting

```bash
pnpm lint
```

## Future Enhancements

- [ ] User authentication and multi-tenant support
- [ ] Export groups to CSV/PDF
- [ ] Analytics dashboard with visualizations
- [ ] Student self-reflection after group projects
- [ ] Historical group performance tracking
- [ ] Integration with LMS platforms
- [ ] Mobile app for students

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
