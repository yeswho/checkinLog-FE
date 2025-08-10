export interface RevenueSummary {
    id: number;
    summary_date: string;
    total_revenue: number;
    room_revenue: number;
    food_revenue: number;
    other_revenue: number;
    total_expenses: number;
    salary_expenses: number;
    operational_expenses: number;
    net_profit: number;
    total_bookings: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface DailyRevenueDetails {
    date: string;
    revenues: {
        total: number;
        breakdown: {
            room: number;
            food: number;
            other: number;
        };
    };
    expenses: {
        total: number;
        breakdown: {
            salary: number;
            operational: number;
        };
    };
    profit: number;
    bookings: number;
    occupancyRate: number;
    revPAR: number;
}

export interface DateRangeRevenue {
    startDate: string;
    endDate: string;
    data: Array<{
        date: string;
        revenues: {
            total: number;
            room: number;
            food: number;
            other: number;
        };
        expenses: {
            total: number;
            salary: number;
            operational: number;
        };
        profit: number;
        bookings: number;
    }>;
    totals: {
        revenue: number;
        expenses: number;
        profit: number;
        bookings: number;
        averageDailyRevenue: number;
        averageOccupancy: number;
    };
}

export interface MonthlyRevenue {
    month: number;
    year: number;
    totalRevenue: number;
    breakdown: {
        room: number;
        food: number;
        other: number;
    }
}

export interface MonthlyBreakdown {
    year: number;
    months: Array<{
        month: number;
        monthName: string;
        revenue: number;
        expenses: number;
        profit: number;
        breakdown: {
            room: number;
            food: number;
            other: number;
        };
    }>;
    annualTotals: {
        revenue: number;
        expenses: number;
        profit: number;
    };
}

export interface RevenueKPIs {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    avgDailyRevenue: number;
    occupancyRate: number;
    revenuePerAvailableRoom: number;
}

export interface YearComparisonData {
    year: number;
    data: MonthlyRevenue[];
}