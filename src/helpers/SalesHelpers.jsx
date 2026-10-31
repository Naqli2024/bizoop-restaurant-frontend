
export const SALES_DATA = {
    TIME_OPTIONS: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],

    SCENARIOS: [
        { value: 1, label: "Scenario: normal" },
        { value: 1.25, label: "Festival / event +25%" },
        { value: 0.85, label: "Heavy rain -15%" },
    ],

    BRANCHES: ["All", "Anna Nagar", "T Nagar", "OMR"],

    OMR: {
        branch: "OMR",
        day: "Wednesday",

        summary: {
            status: "ON TRACK",
            message: "Sales are 14.9% above the normal Wednesday pace.",
            todaySales: 6287,
            projectedClose: 20959,
            target: 20830,
            variance: 129,
            salesPace: 2096,
            normalPace: 1823,
            requiredPerHour: 1818,
            hoursLeft: 8,
            confidence: 63,
            likelyRange: {
                min: 17081,
                max: 24836,
            },
        },

        metrics: [
            { label: "Today's sales", value: 6287, color: "green" },
            { label: "Projected close", value: 20959, color: "accent" },
            { label: "Target", value: 20830, color: "a2" },
            { label: "Variance", value: 129, color: "green" },
            {
                label: "Sales pace /hr",
                value: 2096,
                normal: 1823,
                color: "green",
            },
            {
                label: "Required /hr",
                value: 1818,
                hoursLeft: 8,
                color: "green",
            },
            {
                label: "Confidence",
                value: 63,
                suffix: "%",
                color: "blue",
            },
            {
                label: "Likely range",
                min: 17081,
                max: 24836,
                color: "blue",
            },
        ],

        chart: {
            target: 20830,
            max: 23055,
            ticks: [0, 11527, 23055],

            data: [
                { time: "11AM", actual: 0, forecast: null, normal: 0 },
                { time: "12PM", actual: 3771, forecast: null, normal: 631 },
                { time: "1PM", actual: 5499, forecast: null, normal: 2525 },
                { time: "2PM", actual: 6287, forecast: 6287, normal: 5471 },
                { time: "3PM", actual: null, forecast: 8500, normal: 8200 },
                { time: "4PM", actual: null, forecast: 10500, normal: 10500 },
                { time: "5PM", actual: null, forecast: 12500, normal: 12500 },
                { time: "6PM", actual: null, forecast: 14500, normal: 14500 },
                { time: "7PM", actual: null, forecast: 16500, normal: 16500 },
                { time: "8PM", actual: null, forecast: 18500, normal: 18500 },
                { time: "9PM", actual: null, forecast: 20000, normal: 21000 },
                { time: "10PM", actual: null, forecast: 20959, normal: 22000 },
            ],
        },

        dayPartRows: [
            {
                period: "Lunch",
                target: 8332,
                actual: 6287,
                expectedClose: 8350,
                status: "positive",
            },
            {
                period: "Evening",
                target: 4629,
                actual: 0,
                expectedClose: 4585,
                status: "warning",
            },
            {
                period: "Dinner",
                target: 7869,
                actual: 0,
                expectedClose: 7794,
                status: "warning",
            },
        ],

        historyRows: [
            { label: "Wed −1", amount: 18652 },
            { label: "Wed −2", amount: 19599 },
            { label: "Wed −3", amount: 18179 },
            { label: "Wed −4", amount: 19315 },
            { label: "Average", amount: 18936, bold: true },
            { label: "× current pace +14.9%", amount: 21763 },
            { label: "+ bookings / scenario", amount: 20959, bold: true },
        ],

        hourlyRows: [
            {
                hour: "11 AM",
                actual: 3771,
                normal: 631,
                variance: 497,
                color: "var(--green)",
            },
            {
                hour: "12 PM",
                actual: 1728,
                normal: 1894,
                variance: -9,
                color: "var(--red)",
            },
            {
                hour: "1 PM",
                actual: 788,
                normal: 2946,
                variance: -73,
                color: "var(--red)",
            },
        ],

        weeklyRows: [
            { day: "Monday", normal: 18485, current: null, projection: null },
            { day: "Tuesday", normal: 19387, current: null, projection: null },
            { day: "Wednesday", normal: 18936, current: 6287, projection: 20959 },
            { day: "Thursday", normal: 20289, current: null, projection: null },
            { day: "Friday", normal: 23445, current: null, projection: null },
            { day: "Saturday", normal: 28855, current: null, projection: null },
            { day: "Sunday", normal: 32011, current: null, projection: null },
        ],

        channelRows: [
            {
                name: "Dine-in",
                amount: 4743,
                percentage: 75,
                variance: 19.4,
                tone: "positive",
            },
            {
                name: "Takeaway",
                amount: 1544,
                percentage: 25,
                variance: 10.6,
                tone: "positive",
            },
            {
                name: "Direct delivery",
                amount: 0,
                percentage: 0,
                variance: -8.0,
                tone: "negative",
            },
            {
                name: "Swiggy",
                amount: 0,
                percentage: 0,
                variance: -13.0,
                tone: "negative",
            },
            {
                name: "Zomato",
                amount: 0,
                percentage: 0,
                variance: -9.0,
                tone: "negative",
            },
        ],

        outlets: [
            {
                name: "Anna Nagar",
                amount: 43362,
                percentage: 84,
                status: "warning",
            },
            {
                name: "T Nagar",
                amount: 29863,
                percentage: 118,
                status: "positive",
            },
            {
                name: "OMR",
                amount: 20959,
                percentage: 101,
                status: "positive",
            },
        ],

        forecastRows: [
            {
                label: "🍳 Kitchen",
                value: "Prepare ~4 extra biryani portions",
            },
            {
                label: "📦 Store",
                value: "Chicken need +1.0 kg · stock 22 kg",
                warning: "Insufficient for tomorrow",
            },
            {
                label: "🛒 Purchase",
                value: "Create PO for chicken today",
            },
            {
                label: "👥 Labour",
                value: "Add 2 kitchen staff 7–10 PM",
            },
            {
                label: "📊 Management",
                value: "Expected sales +11% vs normal",
            },
        ],

        capacity: {
            forecastDemand: 20959,
            kitchenCapacity: 22344,
            status: "WITHIN CAPACITY",
            message: "Within kitchen capacity.",
        },

        billingRows: [
            {
                time: "13:38",
                bill: "OM-0014",
                table: "T2 · Dine-in",
                amount: 788,
            },
            {
                time: "12:49",
                bill: "OM-0022",
                table: "F1 · Dine-in",
                amount: 567,
            },
            {
                time: "12:38",
                bill: "OM-0002",
                table: "T6 · Dine-in",
                amount: 466,
            },
            {
                time: "12:37",
                bill: "OM-0009",
                table: "T3 · Dine-in",
                amount: 695,
            },
            {
                time: "11:38",
                bill: "OM-0001",
                table: "F1 · Dine-in",
                amount: 1103,
            },
            {
                time: "11:37",
                bill: "OM-0004",
                table: "TA-05 · Takeaway",
                amount: 1544,
            },
        ],

        modelNote:
            'Model: day-part pattern × current pace (60% carry-over) + bookings. "Normal" is estimated from today’s data until 8+ weeks of history exist; targets are +10% over normal. Weather, events and aggregator feeds are not connected yet — use the scenario selector.',
    },
    
"Anna Nagar": {
    branch: "Anna Nagar",
    day: "Wednesday",

    summary: {
        status: "AT RISK",
        message:
            "Sales are 83.2% below the normal Wednesday pace.",
        todaySales: 263,
        projectedClose: 23039,
        target: 51776,
        variance: -28737,
        salesPace: 263,
        normalPace: 1569,
        requiredPerHour: 5151,
        hoursLeft: 10,
        confidence: 52,
        likelyRange: {
            min: 17510,
            max: 28569,
        },
    },

    metrics: [
        { label: "Today's sales", value: 263, color: "green" },
        { label: "Projected close", value: 23039, color: "accent" },
        { label: "Target", value: 51776, color: "a2" },
        { label: "Variance", value: -28737, color: "red" },
        {
            label: "Sales pace /hr",
            value: 263,
            normal: 1569,
            color: "red",
        },
        {
            label: "Required /hr",
            value: 5151,
            hoursLeft: 10,
            color: "red",
        },
        {
            label: "Confidence",
            value: 52,
            suffix: "%",
            color: "blue",
        },
        {
            label: "Likely range",
            min: 17510,
            max: 28569,
            color: "blue",
        },
    ],

    chart: {
        target: 51776,
        max: 51776,
        ticks: [0, 25888, 51776],

        data: [
            { time: "11AM", actual: 0, forecast: null, normal: 0 },
            { time: "12PM", actual: 263, forecast: 263, normal: 1569 },
            { time: "1PM", actual: null, forecast: 2630, normal: 6276 },
            { time: "2PM", actual: null, forecast: 6780, normal: 15690 },
            { time: "3PM", actual: null, forecast: 9890, normal: 26673 },
            { time: "4PM", actual: null, forecast: 10824, normal: 34518 },
            { time: "5PM", actual: null, forecast: 11759, normal: 37656 },
            { time: "6PM", actual: null, forecast: 13314, normal: 42364 },
            { time: "7PM", actual: null, forecast: 16110, normal: 48639 },
            { time: "8PM", actual: null, forecast: 19525, normal: 58057 },
            { time: "9PM", actual: null, forecast: 22500, normal: 69020 },
            { time: "10PM", actual: null, forecast: 23039, normal: 51776 },
        ],
    },

    dayPartRows: [
        {
            period: "Lunch",
            target: 20711,
            actual: 263,
            expectedClose: 7332,
            status: "warning",
        },
        {
            period: "Evening",
            target: 11506,
            actual: 0,
            expectedClose: 5236,
            status: "warning",
        },
        {
            period: "Dinner",
            target: 19560,
            actual: 0,
            expectedClose: 8901,
            status: "warning",
        },
    ],

    historyRows: [
        { label: "Wed −1", amount: 46363 },
        { label: "Wed −2", amount: 48717 },
        { label: "Wed −3", amount: 45187 },
        { label: "Wed −4", amount: 48011 },
        { label: "Average", amount: 47069, bold: true },
        { label: "× current pace -83.2%", amount: 7890 },
        { label: "+ bookings / scenario", amount: 23039, bold: true },
    ],

    hourlyRows: [
        {
            hour: "11 AM",
            actual: 263,
            normal: 1569,
            variance: -83,
            color: "var(--red)",
        },
    ],

    weeklyRows: [
        { day: "Monday", normal: 45949, current: null, projection: null },
        { day: "Tuesday", normal: 48190, current: null, projection: null },
        { day: "Wednesday", normal: 47069, current: 263, projection: 23039 },
        { day: "Thursday", normal: 50431, current: null, projection: null },
        { day: "Friday", normal: 58276, current: null, projection: null },
        { day: "Saturday", normal: 71725, current: null, projection: null },
        { day: "Sunday", normal: 79570, current: null, projection: null },
    ],

    channelRows: [
        {
            name: "Dine-in",
            amount: 0,
            percentage: 0,
            variance: -56,
            tone: "negative",
        },
        {
            name: "Takeaway",
            amount: 263,
            percentage: 100,
            variance: 86,
            tone: "positive",
        },
        {
            name: "Direct delivery",
            amount: 0,
            percentage: 0,
            variance: -8,
            tone: "negative",
        },
        {
            name: "Swiggy",
            amount: 0,
            percentage: 0,
            variance: -13,
            tone: "negative",
        },
        {
            name: "Zomato",
            amount: 0,
            percentage: 0,
            variance: -9,
            tone: "negative",
        },
    ],

    outlets: [
        {
            name: "Anna Nagar",
            amount: 23039,
            percentage: 44,
            status: "warning",
        },
        {
            name: "T Nagar",
            amount: 38473,
            percentage: 152,
            status: "positive",
        },
        {
            name: "OMR",
            amount: 76708,
            percentage: 368,
            status: "positive",
        },
    ],

    forecastRows: [
        {
            label: "🍳 Kitchen",
            value: "Reduce biryani prep by ~20 portions",
        },
        {
            label: "📦 Store",
            value: "Chicken need -5.0 kg · stock 22 kg",
            warning: "Insufficient for tomorrow",
        },
        {
            label: "🛒 Purchase",
            value: "Create PO for chicken today",
        },
        {
            label: "👥 Labour",
            value: "Current roster adequate",
        },
        {
            label: "📊 Management",
            value: "Expected sales -51% vs normal",
        },
    ],

    capacity: {
        forecastDemand: 23039,
        kitchenCapacity: 55542,
        status: "WITHIN CAPACITY",
        message: "Within kitchen capacity.",
    },

    billingRows: [
        {
            time: "11:23",
            bill: "AN-0040",
            table: "TA-01 · Takeaway",
            amount: 263,
        },
    ],

    modelNote:
        'Model: day-part pattern × current pace (60% carry-over) + bookings. "Normal" is estimated from available sales history. Weather, events and aggregator feeds are not connected yet — use the scenario selector.',
},
"T Nagar": {
  branch: "T Nagar",
  day: "Wednesday",

  summary: {
    status: "ON TRACK",
    message:
      "Sales are 109.4% above the normal Wednesday pace.",
    todaySales: 1607,
    projectedClose: 38473,
    target: 25330,
    variance: 13142,
    salesPace: 1607,
    normalPace: 768,
    requiredPerHour: 2372,
    hoursLeft: 10,
    confidence: 52,
    likelyRange: {
      min: 29239,
      max: 47706,
    },
  },

  metrics: [
    { label: "Today's sales", value: 1607, color: "green" },
    { label: "Projected close", value: 38473, color: "accent" },
    { label: "Target", value: 25330, color: "a2" },
    { label: "Variance", value: 13142, color: "green" },
    {
      label: "Sales pace /hr",
      value: 1607,
      normal: 768,
      color: "green",
    },
    {
      label: "Required /hr",
      value: 2372,
      hoursLeft: 10,
      color: "red",
    },
    {
      label: "Confidence",
      value: 52,
      suffix: "%",
      color: "blue",
    },
    {
      label: "Likely range",
      min: 29239,
      max: 47706,
      color: "blue",
    },
  ],

  chart: {
    target: 25330,
    max: 42320,
    ticks: [0, 21160, 42320],

    data: [
      { time: "11AM", actual: 0, forecast: null, normal: 0 },
      { time: "12PM", actual: 1607, forecast: 1607, normal: 768 },
      { time: "1PM", actual: null, forecast: 5414, normal: 3064 },
      { time: "2PM", actual: null, forecast: 11348, normal: 6644 },
      { time: "3PM", actual: null, forecast: 15584, normal: 9202 },
      { time: "4PM", actual: null, forecast: 16854, normal: 9969 },
      { time: "5PM", actual: null, forecast: 18124, normal: 10735 },
      { time: "6PM", actual: null, forecast: 20238, normal: 12013 },
      { time: "7PM", actual: null, forecast: 24045, normal: 14312 },
      { time: "8PM", actual: null, forecast: 29546, normal: 17636 },
      { time: "9PM", actual: null, forecast: 35901, normal: 21473 },
      { time: "10PM", actual: null, forecast: 38473, normal: 23028 },
    ],
  },

  dayPartRows: [
    {
      period: "Lunch",
      target: 10132,
      actual: 1607,
      expectedClose: 13048,
      status: "positive",
    },
    {
      period: "Evening",
      target: 5629,
      actual: 0,
      expectedClose: 8475,
      status: "positive",
    },
    {
      period: "Dinner",
      target: 9569,
      actual: 0,
      expectedClose: 14407,
      status: "positive",
    },
  ],

  historyRows: [
    { label: "Wed −1", amount: 22682 },
    { label: "Wed −2", amount: 23834 },
    { label: "Wed −3", amount: 22106 },
    { label: "Wed −4", amount: 23488 },
    { label: "Average", amount: 23028, bold: true },
    { label: "× current pace +109.4%", amount: 48210 },
    { label: "+ bookings / scenario", amount: 38473, bold: true },
  ],

  hourlyRows: [
    {
      hour: "11 AM",
      actual: 1607,
      normal: 768,
      variance: 109,
      color: "var(--green)",
    },
  ],

  weeklyRows: [
    { day: "Monday", normal: 22479, current: null, projection: null },
    { day: "Tuesday", normal: 23576, current: null, projection: null },
    { day: "Wednesday", normal: 23028, current: 1607, projection: 38473 },
    { day: "Thursday", normal: 24672, current: null, projection: null },
    { day: "Friday", normal: 28510, current: null, projection: null },
    { day: "Saturday", normal: 35090, current: null, projection: null },
    { day: "Sunday", normal: 38928, current: null, projection: null },
  ],

  channelRows: [
    {
      name: "Dine-in",
      amount: 1607,
      percentage: 100,
      variance: 44,
      tone: "positive",
    },
    {
      name: "Takeaway",
      amount: 0,
      percentage: 0,
      variance: -14,
      tone: "negative",
    },
    {
      name: "Direct delivery",
      amount: 0,
      percentage: 0,
      variance: -8,
      tone: "negative",
    },
    {
      name: "Swiggy",
      amount: 0,
      percentage: 0,
      variance: -13,
      tone: "negative",
    },
    {
      name: "Zomato",
      amount: 0,
      percentage: 0,
      variance: -9,
      tone: "negative",
    },
  ],

  outlets: [
    {
      name: "Anna Nagar",
      amount: 23039,
      percentage: 44,
      status: "warning",
    },
    {
      name: "T Nagar",
      amount: 38473,
      percentage: 152,
      status: "positive",
    },
    {
      name: "OMR",
      amount: 76708,
      percentage: 368,
      status: "positive",
    },
  ],

  forecastRows: [
    {
      label: "🍳 Kitchen",
      value: "Prepare ~26 extra biryani portions",
    },
    {
      label: "📦 Store",
      value: "Chicken need +6.5 kg · stock 22 kg",
      warning: "Insufficient for tomorrow",
    },
    {
      label: "🛒 Purchase",
      value: "Create PO for chicken today",
    },
    {
      label: "👥 Labour",
      value: "Add 2 kitchen staff 7–10 PM",
    },
    {
      label: "📊 Management",
      value: "Expected sales +67% vs normal",
    },
  ],

  capacity: {
    forecastDemand: 38473,
    kitchenCapacity: 27173,
    status: "CAPACITY ALERT",
    message:
      "Demand exceeds kitchen capacity by approximately ₹11,300. Extra prep and staff are recommended.",
  },

  billingRows: [
    {
      time: "11:53",
      bill: "TN-0013",
      table: "T5 · Dine-in",
      amount: 1607,
    },
  ],

  modelNote:
    'Model: day-part pattern × current pace (60% carry-over) + bookings. "Normal" is estimated from available sales history; targets are +10% over normal. Weather, events and aggregator feeds are not connected yet — use the scenario selector.',
},
};
