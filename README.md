# AI-Dash: AI-Powered Metadashboard Prototype

A UX prototype demonstrating an AI-powered analytics dashboard that responds to natural language queries with both visualizations and conversational answers.

## Project Overview

AI-Dash is a **UX prototype** (not a production application) designed to test interaction patterns for AI-powered data analytics. Users can ask questions in natural language and receive:

- **Visualizations** (charts and graphs)
- **Text answers** (insights, explanations, analysis)
- **Mixed responses** (charts with accompanying explanations)

**Important:** This prototype uses pattern-matched mock responses, not actual AI. It's designed to validate UX concepts and interaction flows.

## Key Features

### 1. Natural Language Interface
- Type questions or requests in plain English
- Example queries like:
  - "Show me sales over the last quarter"
  - "What were our top selling products?"
  - "Why did sales drop in Q3?"
  - "Show me the conversion funnel"

### 2. Multiple Response Types
- **Charts**: Line, bar, area, pie, and funnel charts
- **Text answers**: Detailed insights and explanations
- **Mixed**: Charts with natural language context

### 3. Explainability & Transparency
Each response includes:
- **Query interpretation**: How the AI understood your request
- **Entities identified**: Key terms extracted from your query
- **Data sources**: Which data files were used
- **Assumptions made**: What the system assumed about your intent
- **Chart configuration**: Technical details of the visualization

Click "Show Details" on any response to see this information.

### 4. Export Capabilities
Every response can be exported:
- **Download Chart**: Save visualizations as PNG images
- **Export CSV**: Download the underlying data
- **Copy Text**: Copy explanations and insights
- Full conversation export (future feature)

### 5. Iterative Refinement
Modify existing visualizations with follow-up queries:
- "Make it a bar chart"
- "Show as area chart"
- "Add trend line" (simulated)
- "Compare to last year" (simulated)

### 6. Multi-View Organization
- **Home tab**: Your main workspace
- **Custom views**: Create multiple analysis tabs
- **Chat history**: Navigate between previous sessions
- **Persistent state**: Each view maintains its conversation history

### 7. Jupyter-Style Conversation Flow
- Vertical conversation layout
- Each interaction shows:
  - Your query at the top
  - AI response below it
  - Full history preserved
- Input box at the bottom for new queries

## Project Structure

```
ai-dash/
├── src/
│   ├── components/
│   │   ├── ChartRenderer.tsx      # Recharts visualization wrapper
│   │   ├── ResponseCard.tsx       # Individual response display
│   │   ├── ConversationMessage.tsx # Query + response pair
│   │   ├── QueryInput.tsx         # Input box with example queries
│   │   ├── Sidebar.tsx            # Chat history navigation
│   │   ├── TabBar.tsx             # View/tab management
│   │   └── ViewTab.tsx            # Individual view container
│   ├── data/
│   │   ├── sales.json             # Mock sales data
│   │   ├── customers.json         # Mock customer data
│   │   ├── inventory.json         # Mock inventory data
│   │   └── analytics.json         # Mock analytics data
│   ├── services/
│   │   └── mockAI.ts              # Query pattern matching engine
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   └── App.css                    # Application styles
└── package.json
```

## Mock Data Sources

The prototype includes four JSON data files:

1. **sales.json**: Quarterly/monthly revenue, categories, top products
2. **customers.json**: Demographics, retention, satisfaction, acquisition
3. **inventory.json**: Stock levels, turnover, warehouse utilization
4. **analytics.json**: Website traffic, conversion funnel, device breakdown

## Supported Query Patterns

### Visualization Queries
- Sales trends: `"Show me sales over the last quarter"`
- Monthly breakdown: `"Show sales by month"`
- Category distribution: `"Show sales by category"`
- Demographics: `"What are customer demographics?"`
- Satisfaction: `"How satisfied are our customers?"`
- Conversion funnel: `"Show me the conversion funnel"`
- Traffic trends: `"Show website traffic trends"`

### Question/Answer Queries
- Top products: `"What were our top selling products?"`
- Analysis: `"Why did sales drop in Q3?"`
- Inventory status: `"What's our inventory status?"`

### Iteration Queries
- Change chart type: `"Make it a bar chart"` or `"Show as area chart"`

### Fallback
For unrecognized patterns, the system suggests example queries.

## Technical Stack

- **React 18** with TypeScript
- **Recharts** for data visualization
- **Lucide React** for icons
- **html2canvas** for chart image export
- **date-fns** for date formatting

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

## How to Use

1. **Start with example queries**: Click any suggested query to see how it works
2. **Ask your own questions**: Type natural language queries in the input box
3. **Explore responses**: View charts, read explanations, check insights
4. **Inspect details**: Click "Show Details" to see how queries were interpreted
5. **Export results**: Download charts, export data, copy text
6. **Iterate**: Ask follow-up questions or modify visualizations
7. **Organize work**: Create new views/tabs for different analyses
8. **Review history**: Use the sidebar to navigate previous sessions

## UX Testing Goals

This prototype is designed to test:

1. **Interaction patterns** for natural language analytics
2. **Balance** between visualizations and conversational responses
3. **Transparency** in AI decision-making
4. **Export workflows** for presentations and reports
5. **Multi-view organization** for complex analyses
6. **Iterative refinement** of visualizations
7. **Mixed modality** responses (charts + text)

## Limitations

This is a **UX prototype with mock data**:

- ❌ No actual AI/LLM integration
- ❌ No real-time data
- ❌ Limited to pre-defined query patterns
- ❌ No backend/API
- ❌ No authentication
- ❌ No data persistence (refreshing resets state)

## Future Enhancements (for production)

- [ ] Real AI/LLM integration (OpenAI, Anthropic, etc.)
- [ ] Connect to actual data sources (databases, APIs)
- [ ] Advanced chart types (scatter, heatmap, etc.)
- [ ] Natural language query parsing
- [ ] User authentication
- [ ] Persistent storage
- [ ] Collaborative features (sharing views)
- [ ] Advanced exports (PDF reports, PowerPoint)
- [ ] Custom data source connections
- [ ] SQL query generation
- [ ] Predictive analytics

## Contributing

This is a prototype for UX testing. To extend it:

1. Add more query patterns in `src/services/mockAI.ts`
2. Add new data files in `src/data/`
3. Extend chart types in `src/components/ChartRenderer.tsx`
4. Customize styles in `src/App.css`

## License

MIT License - feel free to use this prototype for your own projects.

## Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [Create React App](https://create-react-app.dev/)
