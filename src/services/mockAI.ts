import { ResponseMessage } from '../types';
import { generateId } from '../utils/id';
import salesData from '../data/sales.json';
import customersData from '../data/customers.json';
import analyticsData from '../data/analytics.json';
import inventoryData from '../data/inventory.json';

interface QueryPattern {
  patterns: RegExp[];
  handler: (query: string, lastResponse?: ResponseMessage) => ResponseMessage;
}

// Factory for chart type iteration handlers
const createChartIterationPattern = (chartType: 'bar' | 'area' | 'line' | 'pie', explanation: string): QueryPattern => ({
  patterns: [
    new RegExp(`(?:make|change|convert).*${chartType}.*chart`, 'i'),
    new RegExp(`(?:show|display).*as.*${chartType}`, 'i'),
  ],
  handler: (_query, lastResponse) => {
    if (!lastResponse?.chart) {
      return {
        id: generateId(),
        type: 'text',
        text: 'I don\'t see a previous chart to modify. Could you first ask me to show you some data, then I can change how it\'s displayed?',
        explanation: 'No chart exists to transform.',
        interpretation: {
          intent: 'Modify existing chart type',
          entities: ['chart type', `${chartType} chart`],
          dataSource: 'previous response',
          assumptions: ['User wants to iterate on previous visualization'],
        },
        timestamp: new Date(),
      };
    }

    return {
      id: generateId(),
      type: 'mixed',
      chart: {
        ...lastResponse.chart,
        type: chartType,
      },
      text: `I've converted the chart to ${chartType === 'area' ? 'an' : 'a'} ${chartType} chart format.`,
      explanation,
      interpretation: {
        intent: `Change visualization type to ${chartType} chart`,
        entities: [`${chartType} chart`, 'visualization change'],
        dataSource: lastResponse.interpretation.dataSource,
        assumptions: ['Same data, different visualization'],
      },
      timestamp: new Date(),
    };
  },
});

// Query pattern matchers
const queryPatterns: QueryPattern[] = [
  // Sales over time - line chart
  {
    patterns: [
      /sales.*(?:over|last|past|previous).*(?:quarter|q1|q2|q3|q4)/i,
      /show.*sales.*quarter/i,
      /revenue.*trend/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'line',
        data: salesData.quarterly,
        xKey: 'quarter',
        yKey: 'revenue',
        title: 'Quarterly Sales Revenue',
      },
      text: 'Sales performance across quarters shows strong growth in Q4 2024, recovering from a dip in Q3.',
      explanation: 'This chart shows quarterly revenue trends for 2024. Q4 saw exceptional growth at 32.8%, recovering from a 15.5% decline in Q3. The Q3 drop was likely due to seasonal factors and market conditions, while Q4 benefited from holiday season sales.',
      interpretation: {
        intent: 'Visualize sales trends over quarterly time periods',
        entities: ['sales', 'quarterly', 'revenue'],
        dataSource: 'sales.json - quarterly data',
        assumptions: ['User wants to see revenue as primary metric', 'Quarterly aggregation is appropriate'],
      },
      timestamp: new Date(),
    }),
  },

  // Monthly sales - bar chart
  {
    patterns: [
      /sales.*month/i,
      /monthly.*revenue/i,
      /show.*(?:by|per) month/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: salesData.monthly,
        xKey: 'month',
        yKey: 'revenue',
        title: 'Monthly Revenue',
      },
      text: 'December 2024 had the highest monthly revenue at $109,000.',
      explanation: 'Monthly revenue breakdown shows consistent growth from October through December, with a notable dip during the summer months (July-September). The year-end surge is typical for retail with holiday shopping season.',
      interpretation: {
        intent: 'Display monthly sales data with bar chart visualization',
        entities: ['monthly', 'revenue', 'sales'],
        dataSource: 'sales.json - monthly data',
        assumptions: ['Bar chart best represents discrete monthly values', 'Full year 2024 data is relevant'],
      },
      timestamp: new Date(),
    }),
  },

  // Top products - text response
  {
    patterns: [
      /(?:top|best).*selling.*product/i,
      /what.*products.*sold/i,
      /best.*products/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'text',
      text: `Based on the data, our top 5 selling products last month were:

1. **Smart Watch** - 654 units sold, $163,500 revenue
2. **Wireless Headphones** - 842 units sold, $126,300 revenue
3. **Portable Charger** - 1,450 units sold, $72,500 revenue
4. **Laptop Stand** - 1,240 units sold, $62,000 revenue
5. **USB-C Cable** - 2,180 units sold, $32,700 revenue

The Smart Watch leads in revenue despite selling fewer units than some other products, indicating a higher price point. USB-C Cables had the highest unit sales but lower revenue due to the lower price point.`,
      explanation: 'This analysis ranks products by both revenue and units sold, highlighting that volume doesn\'t always correlate with revenue impact.',
      interpretation: {
        intent: 'Identify and rank top-performing products',
        entities: ['products', 'sales', 'ranking'],
        dataSource: 'sales.json - topProducts data',
        assumptions: ['User wants both revenue and unit metrics', 'Recent time period is implied'],
      },
      timestamp: new Date(),
    }),
  },

  // Why sales dropped - explanatory text
  {
    patterns: [
      /why.*sales.*(?:drop|decline|decrease|fall)/i,
      /what.*caused.*(?:drop|decline)/i,
      /explain.*(?:q3|third quarter)/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'text',
      text: `The Q3 2024 sales decline of 15.5% can be attributed to several factors:

**Primary Factors:**
- **Seasonal Slowdown**: Summer months (July-September) typically see reduced consumer spending in our core categories
- **Market Competition**: Increased competitive pressure from new market entrants during this period
- **Inventory Constraints**: Stock shortages in key products (Portable Chargers down to critical levels)

**Supporting Data:**
- Electronics category showed the biggest impact, declining 18% from Q2
- Customer acquisition costs increased 22% while conversion rates dropped 12%
- Mobile traffic increased but had lower conversion rates than desktop

**Recovery Strategy:**
Q4's strong recovery (32.8% growth) suggests our response strategies were effective: expanded inventory, holiday promotions, and improved mobile experience.`,
      explanation: 'This analysis combines sales data with inventory, customer behavior, and market factors to explain the Q3 performance anomaly.',
      interpretation: {
        intent: 'Explain causal factors behind sales decline',
        entities: ['Q3', 'sales decline', 'analysis'],
        dataSource: 'sales.json, inventory.json, analytics.json',
        assumptions: ['User wants comprehensive analysis', 'Multi-factor explanation is expected', 'Q3 refers to 2024'],
      },
      timestamp: new Date(),
    }),
  },

  // Category breakdown - pie chart
  {
    patterns: [
      /sales.*(?:by|per) categor/i,
      /categor.*breakdown/i,
      /show.*categories/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'pie',
        data: salesData.byCategory,
        title: 'Sales by Category',
      },
      text: 'Electronics dominates with 39.5% of total sales, followed by Clothing at 29.0%.',
      explanation: 'Category distribution shows Electronics and Clothing account for nearly 70% of revenue. This concentration suggests opportunity for diversification while doubling down on these core strengths.',
      interpretation: {
        intent: 'Show sales distribution across product categories',
        entities: ['categories', 'sales', 'distribution'],
        dataSource: 'sales.json - byCategory data',
        assumptions: ['Pie chart best shows proportional distribution', 'All categories should be included'],
      },
      timestamp: new Date(),
    }),
  },

  // Customer demographics
  {
    patterns: [
      /customer.*(?:demographic|age)/i,
      /who.*(?:customer|buying)/i,
      /show.*(?:audience|demographics)/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: customersData.demographics,
        xKey: 'ageGroup',
        yKey: 'count',
        title: 'Customer Demographics by Age',
      },
      text: 'Our largest customer segment is 25-34 year olds, representing 30.4% of our customer base.',
      explanation: 'The customer base skews younger, with 72.2% of customers under 45. The 25-34 age group is both the largest segment and typically has high lifetime value. Consider targeting marketing efforts to maintain and grow this demographic.',
      interpretation: {
        intent: 'Visualize customer age distribution',
        entities: ['customers', 'demographics', 'age groups'],
        dataSource: 'customers.json - demographics data',
        assumptions: ['Age grouping is the primary demographic of interest', 'Bar chart effectively shows count comparison'],
      },
      timestamp: new Date(),
    }),
  },

  // Customer satisfaction
  {
    patterns: [
      /customer.*satisfaction/i,
      /how.*(?:happy|satisfied)/i,
      /satisfaction.*score/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'pie',
        data: customersData.satisfaction,
        title: 'Customer Satisfaction',
      },
      text: '87% of customers are satisfied or very satisfied with our service.',
      explanation: 'Overall satisfaction is strong with 62% very satisfied and 25% satisfied. Only 5% report dissatisfaction. This high satisfaction rate correlates with our strong retention metrics and suggests positive word-of-mouth potential.',
      interpretation: {
        intent: 'Display customer satisfaction metrics',
        entities: ['satisfaction', 'customers', 'feedback'],
        dataSource: 'customers.json - satisfaction data',
        assumptions: ['Pie chart shows satisfaction distribution clearly', 'Current survey data is representative'],
      },
      timestamp: new Date(),
    }),
  },

  // Inventory status
  {
    patterns: [
      /inventory.*(?:status|level)/i,
      /stock.*level/i,
      /what.*inventory/i,
      /show.*stock/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'text',
      text: `**Inventory Status Overview:**

**Critical Items (Immediate Attention Required):**
- Portable Charger: 125 units (optimal: 400) - 69% below target

**Low Stock (Monitor Closely):**
- Wireless Headphones: 245 units (optimal: 300) - 18% below target

**Excess Stock:**
- Screen Protector: 980 units (optimal: 700) - 40% over target

**Healthy Stock Levels:**
- Smart Watch, Laptop Stand, USB-C Cable, Bluetooth Speaker, Phone Case

**Recommendation:** Priority reorder for Portable Chargers to avoid stockouts. Consider promotion for Screen Protectors to reduce excess inventory.`,
      explanation: 'This analysis categorizes inventory by urgency, highlighting items requiring immediate action versus those in healthy ranges.',
      interpretation: {
        intent: 'Assess current inventory health and identify issues',
        entities: ['inventory', 'stock levels', 'status'],
        dataSource: 'inventory.json - stockLevels data',
        assumptions: ['User wants actionable insights, not just raw data', 'Comparison to optimal levels provides context'],
      },
      timestamp: new Date(),
    }),
  },

  // Conversion funnel
  {
    patterns: [
      /conversion.*(?:funnel|rate)/i,
      /funnel.*analysis/i,
      /show.*conversion/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'funnel',
        data: analyticsData.conversion,
        title: 'Conversion Funnel',
      },
      text: 'Overall conversion rate from landing page to purchase is 12.4%.',
      explanation: 'The biggest drop-off occurs between Product View (62%) and Add to Cart (31%), losing half of interested users. The checkout-to-purchase rate is relatively strong at 67%, suggesting the checkout process is smooth. Focus optimization efforts on the product page and add-to-cart experience.',
      interpretation: {
        intent: 'Visualize conversion funnel and identify drop-off points',
        entities: ['conversion', 'funnel', 'user journey'],
        dataSource: 'analytics.json - conversion data',
        assumptions: ['Standard e-commerce funnel stages', 'Percentage of initial traffic is most relevant'],
      },
      timestamp: new Date(),
    }),
  },

  // Website traffic
  {
    patterns: [
      /(?:website|site).*traffic/i,
      /visits.*trend/i,
      /show.*(?:visitors|traffic)/i,
    ],
    handler: (query) => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'line',
        data: analyticsData.traffic,
        xKey: 'date',
        yKey: 'visits',
        title: 'Website Traffic Trend',
      },
      text: 'Traffic has grown 25.8% over the past month, reaching 15,600 visits.',
      explanation: 'Weekly traffic shows healthy growth with bounce rate improving from 42% to 36%. The mid-October spike to 14,800 visits coincides with a promotional campaign. Sustained growth suggests effective marketing and SEO efforts.',
      interpretation: {
        intent: 'Display website traffic trends over time',
        entities: ['traffic', 'visits', 'trend'],
        dataSource: 'analytics.json - traffic data',
        assumptions: ['Weekly granularity is appropriate', 'Recent month provides relevant trend insight'],
      },
      timestamp: new Date(),
    }),
  },

  // Customer retention
  {
    patterns: [
      /(?:customer|user).*retention/i,
      /retention.*(?:rate|trend|cohort)/i,
      /churn/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'line',
        data: customersData.retention,
        xKey: 'cohort',
        yKey: ['month1', 'month2', 'month3'],
        title: 'Customer Retention by Cohort',
      },
      text: 'Feb 2024 cohort shows the best retention at 61% after 3 months.',
      explanation: 'Retention analysis by monthly cohort shows average 3-month retention of 58%. The Feb cohort outperforms others, likely due to a loyalty program launch. March cohort has the lowest retention, correlating with aggressive acquisition campaigns that brought lower-intent users.',
      interpretation: {
        intent: 'Analyze customer retention across cohorts',
        entities: ['retention', 'cohorts', 'churn'],
        dataSource: 'customers.json - retention data',
        assumptions: ['Cohort analysis by signup month is most useful', 'Monthly retention intervals are appropriate'],
      },
      timestamp: new Date(),
    }),
  },

  // Customer acquisition channels
  {
    patterns: [
      /(?:customer|user).*acquisition/i,
      /acquisition.*(?:channel|cost|cac)/i,
      /how.*(?:acquire|getting).*customer/i,
      /marketing.*channel/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: customersData.acquisition,
        xKey: 'channel',
        yKey: 'customers',
        title: 'Customer Acquisition by Channel',
      },
      text: 'Organic Search is our most effective channel with 4,200 customers at $10/customer. Paid Ads bring 3,800 customers but at $25/customer.',
      explanation: 'Organic Search and Email have the lowest CAC ($10 and $3.20 respectively), while Paid Ads have the highest at $25/customer. Referral is highly cost-effective at $5/customer. Consider shifting budget from Paid Ads to Referral and Email programs.',
      interpretation: {
        intent: 'Analyze customer acquisition channels and costs',
        entities: ['acquisition', 'channels', 'CAC'],
        dataSource: 'customers.json - acquisition data',
        assumptions: ['User wants channel comparison', 'Both volume and cost metrics are relevant'],
      },
      timestamp: new Date(),
    }),
  },

  // Customer lifetime value
  {
    patterns: [
      /(?:customer|lifetime).*value/i,
      /(?:clv|ltv)/i,
      /(?:customer|user).*segment/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: customersData.lifetimeValue,
        xKey: 'segment',
        yKey: 'avgValue',
        title: 'Customer Lifetime Value by Segment',
      },
      text: 'VIP customers (850 users) have an average lifetime value of $5,400, nearly 20x higher than Low Value customers.',
      explanation: 'The top two segments (VIP + High Value) represent only 20% of customers but account for a disproportionate share of revenue. Focus retention efforts on VIP customers and develop upgrade paths from Medium to High Value segments.',
      interpretation: {
        intent: 'Analyze customer lifetime value distribution',
        entities: ['CLV', 'segments', 'value'],
        dataSource: 'customers.json - lifetimeValue data',
        assumptions: ['Segment-based analysis is most actionable', 'Average value per segment is primary metric'],
      },
      timestamp: new Date(),
    }),
  },

  // Device breakdown
  {
    patterns: [
      /device.*(?:breakdown|usage|split)/i,
      /mobile.*(?:vs|versus).*desktop/i,
      /what.*device/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'pie',
        data: analyticsData.deviceBreakdown,
        title: 'Traffic by Device',
      },
      text: 'Desktop leads at 48.5% of sessions, with Mobile close behind at 43.6%. Tablet accounts for 7.9%.',
      explanation: 'Mobile traffic (43.6%) is approaching desktop levels but has 26% shorter session duration (182s vs 245s). This suggests mobile users are more task-oriented. Optimizing mobile conversion could significantly impact overall revenue.',
      interpretation: {
        intent: 'Show device usage distribution',
        entities: ['devices', 'mobile', 'desktop'],
        dataSource: 'analytics.json - deviceBreakdown data',
        assumptions: ['Percentage distribution is most informative', 'All device types should be included'],
      },
      timestamp: new Date(),
    }),
  },

  // Revenue vs units comparison
  {
    patterns: [
      /revenue.*(?:vs|versus|compared).*unit/i,
      /compare.*revenue.*unit/i,
      /sales.*(?:revenue|units).*(?:both|comparison)/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: salesData.quarterly,
        xKey: 'quarter',
        yKey: ['revenue', 'units'],
        title: 'Revenue vs Units by Quarter',
      },
      text: 'Q4 2024 achieved highest revenue ($312K) and units (1,620). Q3 dipped in both metrics.',
      explanation: 'Revenue and unit growth generally track together, but Q4 shows a slightly higher revenue-per-unit ratio, suggesting either price increases or a shift toward higher-value products during holiday season.',
      interpretation: {
        intent: 'Compare revenue and unit sales metrics',
        entities: ['revenue', 'units', 'comparison'],
        dataSource: 'sales.json - quarterly data',
        assumptions: ['Multi-metric comparison is desired', 'Quarterly granularity is appropriate'],
      },
      timestamp: new Date(),
    }),
  },

  // Inventory turnover
  {
    patterns: [
      /inventory.*turnover/i,
      /(?:how fast|turnover).*(?:sell|selling)/i,
      /days.*in.*stock/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: inventoryData.turnover,
        xKey: 'category',
        yKey: 'rate',
        title: 'Inventory Turnover Rate by Category',
      },
      text: 'Electronics has the highest turnover rate at 8.5x, with an average of 42 days in stock. Books are slowest at 3.2x (112 days).',
      explanation: 'High turnover in Electronics correlates with strong demand. Books have the lowest turnover, suggesting either overstocking or declining demand. Consider reducing Book inventory and reallocating warehouse space to faster-moving categories.',
      interpretation: {
        intent: 'Analyze inventory turnover rates',
        entities: ['inventory', 'turnover', 'categories'],
        dataSource: 'inventory.json - turnover data',
        assumptions: ['Category-level analysis is most useful', 'Higher turnover is generally better'],
      },
      timestamp: new Date(),
    }),
  },

  // Warehouse utilization
  {
    patterns: [
      /warehouse.*(?:utilization|capacity|space)/i,
      /storage.*(?:space|capacity)/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'bar',
        data: inventoryData.warehouse,
        xKey: 'location',
        yKey: 'utilization',
        title: 'Warehouse Utilization (%)',
      },
      text: 'Warehouse C is at 90% capacity (10,800/12,000 units). Warehouse B has the most available space at 77.5%.',
      explanation: 'Warehouse C is approaching critical capacity and may need overflow planning. Warehouse B has the most room for expansion. Consider redistributing inventory from C to B to balance utilization and avoid bottlenecks.',
      interpretation: {
        intent: 'Assess warehouse utilization and capacity',
        entities: ['warehouse', 'capacity', 'utilization'],
        dataSource: 'inventory.json - warehouse data',
        assumptions: ['Utilization percentage is the key metric', 'All warehouses should be compared'],
      },
      timestamp: new Date(),
    }),
  },

  // Bounce rate trends
  {
    patterns: [
      /bounce.*rate/i,
      /(?:pageview|page view).*trend/i,
    ],
    handler: () => ({
      id: generateId(),
      type: 'mixed',
      chart: {
        type: 'line',
        data: analyticsData.traffic,
        xKey: 'date',
        yKey: ['visits', 'pageviews'],
        title: 'Traffic: Visits vs Pageviews',
      },
      text: 'Bounce rate improved from 42% to 36% over the month, while pageviews per visit increased from 2.76 to 2.90.',
      explanation: 'The improving bounce rate and growing pageviews-per-visit ratio indicate better content engagement. Users are exploring more pages per session, suggesting improved site navigation and more compelling content.',
      interpretation: {
        intent: 'Analyze traffic engagement metrics',
        entities: ['bounce rate', 'pageviews', 'engagement'],
        dataSource: 'analytics.json - traffic data',
        assumptions: ['Multi-metric view shows engagement quality', 'Declining bounce rate is positive'],
      },
      timestamp: new Date(),
    }),
  },

  // Iteration: change to line chart
  createChartIterationPattern('line', 'Line charts are ideal for showing trends and changes over time. The continuous line helps visualize the progression and direction of data.'),

  // Iteration: change to bar chart
  createChartIterationPattern('bar', 'Bar charts are effective for comparing discrete values and showing differences between data points clearly. This format makes it easier to compare individual values at a glance.'),

  // Iteration: change to area chart
  createChartIterationPattern('area', 'Area charts emphasize the magnitude of change over time and show cumulative totals effectively. The filled area helps visualize the overall volume or scale of the data.'),

  // Default fallback
  {
    patterns: [/.*/],
    handler: (query) => ({
      id: generateId(),
      type: 'text',
      text: `I understand you're asking about "${query}", but I don't have a pre-configured response for that specific query yet.

Here are some questions I can help with:
- "Show me sales over the last quarter"
- "What were our top selling products?"
- "Why did sales drop in Q3?"
- "Show sales by category"
- "What are customer demographics?"
- "Show me the conversion funnel"
- "What's the inventory status?"
- "Show customer retention trends"
- "What are the acquisition channels?"
- "Show customer lifetime value"
- "Device breakdown"
- "Inventory turnover rates"

You can also try iterating on visualizations by saying things like "make it a bar chart" or "show as area chart".`,
      explanation: 'This is a fallback response for unrecognized queries. In a production system, this would be handled by actual AI.',
      interpretation: {
        intent: 'Unknown query pattern',
        entities: [],
        dataSource: 'N/A',
        assumptions: ['Query doesn\'t match known patterns', 'User needs guidance on available queries'],
      },
      timestamp: new Date(),
    }),
  },
];

export const processQuery = (
  query: string,
  lastResponse?: ResponseMessage
): ResponseMessage => {
  // Find the first matching pattern
  for (const pattern of queryPatterns) {
    for (const regex of pattern.patterns) {
      if (regex.test(query)) {
        return pattern.handler(query, lastResponse);
      }
    }
  }

  // Should never reach here due to fallback pattern, but just in case
  return queryPatterns[queryPatterns.length - 1].handler(query, lastResponse);
};

// Pre-configured queries for example/quick access
export const exampleQueries = [
  'Show me sales over the last quarter',
  'What were our top selling products last month?',
  'Why did sales drop in Q3?',
  'Show sales by category',
  'What are customer demographics?',
  'How satisfied are our customers?',
  'Show me the conversion funnel',
  'What\'s our inventory status?',
  'Show website traffic trends',
  'Customer retention by cohort',
  'What are our acquisition channels?',
  'Show customer lifetime value',
];
