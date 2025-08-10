import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  Spinner,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import DatePicker from 'react-datepicker';
import { subDays, format, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  useDailyRevenue,
  useDateRangeRevenue,
  useGenerateDailyRevenue,
  useRevenueKPIs,
  useMonthlyBreakdown,
  useYearOverYearComparison,
  useCurrentMonthRevenue,
} from '../../hooks/useRevenue';
import { useRevenueExport } from '../../hooks/useImportExport';
import { formatCurrency, formatDateString } from '../../utils/common';
import { FileUp, Download, X } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomDateInput = React.forwardRef(({ value, onClick, onChange, ...props }: any, ref: any) => (
  <button
    onClick={onClick}
    ref={ref}
    className="w-full p-2 text-sm border border-default-300 rounded-lg hover:border-primary transition-colors text-left"
  >
    {value || 'Select date'}
  </button>
));
CustomDateInput.displayName = 'CustomDateInput';

const RevenueDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [chartType, setChartType] = useState('area');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [comparisonYears, setComparisonYears] = useState([2024, 2025]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formattedDate = selectedDate ? formatDateString(selectedDate.toISOString()) : '';
  const formattedStart = startDate ? formatDateString(startDate.toISOString()) : '';
  const formattedEnd = endDate ? formatDateString(endDate.toISOString()) : '';

  const {
    data: dailyData,
    isLoading: isDailyLoading,
    refetch: refetchDaily
  } = useDailyRevenue(formattedDate);

  const {
    data: rangeData,
    isLoading: isRangeLoading
  } = useDateRangeRevenue(formattedStart, formattedEnd);

  const {
    data: kpis,
    isLoading: isKPIsLoading
  } = useRevenueKPIs(formattedStart, formattedEnd);

  const {
    data: monthlyData,
    isLoading: isMonthlyLoading
  } = useMonthlyBreakdown(selectedYear);

  const {
    data: yearComparisonData,
    isLoading: isComparisonLoading
  } = useYearOverYearComparison(comparisonYears.join(','));

  const {
    data: currentMonthData,
    isLoading: isCurrentMonthLoading
  } = useCurrentMonthRevenue();

  const {
    mutate: generateRevenue,
    isPending: isGenerating
  } = useGenerateDailyRevenue();

  const {
    mutate: exportRevenue,
    isPending: isExporting
  } = useRevenueExport();

  const [needsGeneration, setNeedsGeneration] = useState(false);

  useEffect(() => {
    if (!isDailyLoading && !dailyData) {
      setNeedsGeneration(true);
    } else {
      setNeedsGeneration(false);
    }
  }, [dailyData, isDailyLoading]);

  const handleGenerate = () => {
    if (!selectedDate) return;
    generateRevenue(formattedDate, {
      onSuccess: () => {
        refetchDaily();
      }
    });
  };

  const handleExport = () => {
    if (!startDate || !endDate) return;
    exportRevenue({
      startDate,
      endDate
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const prepareChartData = () => {
    if (!rangeData?.data) return [];
    return rangeData.data.map(item => ({
      date: format(parseISO(item.date || ''), 'MMM d'),
      revenue: item.revenues.total,
      expenses: item.expenses.total,
      profit: item.profit,
      room: item.revenues.room,
      food: item.revenues.food,
      other: item.revenues.other
    }));
  };

  const renderRevenueChart = () => {
    const chartData = prepareChartData();

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="room" stackId="a" fill="#0088FE" />
              <Bar dataKey="food" stackId="a" fill="#00C49F" />
              <Bar dataKey="other" stackId="a" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderRevenueBreakdown = () => {
    if (!rangeData?.totals) return null;

    const data = [
      { name: 'Room', value: rangeData.totals.revenue ? (rangeData.totals.revenue - rangeData.totals.expenses) : 0 },
      { name: 'Expenses', value: rangeData.totals.expenses }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderMonthlyTrends = () => {
    if (!monthlyData?.months) return null;

    const data = monthlyData.months.map(month => ({
      name: month.monthName,
      revenue: month.revenue,
      expenses: month.expenses,
      profit: month.profit
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" />
          <Bar dataKey="expenses" fill="#82ca9d" />
          <Bar dataKey="profit" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderYearComparison = () => {
    if (!yearComparisonData) return null;

    const normalizedData = yearComparisonData.map(yearData => {
      const fullYear = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        total_revenue: 0,
      }));

      const mergedData = fullYear.map(monthTemplate => {
        const actualData = yearData.data.find(d => d.month === monthTemplate.month);
        return actualData || monthTemplate;
      });

      return {
        ...yearData,
        data: mergedData
      };
    });

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(month) => new Date(2023, month - 1).toLocaleString('default', { month: 'short' })}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(month) => `Month ${month}`}
          />
          <Legend />
          {normalizedData.map((yearData) => (
            <Line
              key={yearData.year}
              type="monotone"
              dataKey="total_revenue"
              data={yearData.data}
              name={`${yearData.year} Revenue`}
              stroke={COLORS[yearData.year % COLORS.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (isDailyLoading || isRangeLoading || isKPIsLoading || isMonthlyLoading || isComparisonLoading || isCurrentMonthLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner
          size="lg"
          color="primary"
          label="Loading revenue data..."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-default-600 mb-1">Date Range</label>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateRangeChange}
                customInput={<CustomDateInput />}
                dateFormat="MMM d, yyyy"
                maxDate={new Date()}
                withPortal
              />
            </div>


            <Select
              label="Chart Type"
              selectedKeys={[chartType]}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full md:w-48"
            >
              <SelectItem key="area" value="area">Area Chart</SelectItem>
              <SelectItem key="bar" value="bar">Bar Chart</SelectItem>
              <SelectItem key="line" value="line">Line Chart</SelectItem>
            </Select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              color="primary"
              variant="bordered"
              startContent={<FileUp size={18} />}
              onPress={onOpen}
              className="w-full md:w-auto"
            >
              Import Data
            </Button>
            <Button
              color="primary"
              startContent={<Download size={18} />}
              onPress={handleExport}
              isLoading={isExporting}
              className="w-full md:w-auto"
            >
              Export Report
            </Button>
            {needsGeneration && (
              <Button
                color="secondary"
                isLoading={isGenerating}
                onPress={handleGenerate}
                className="w-full md:w-auto"
              >
                Generate Report
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Import Revenue Data</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <FileUp className="w-8 h-8 mb-2 text-default-400" />
                      <p className="text-sm font-medium text-default-600">
                        {selectedFile ? selectedFile.name : "Click to select file"}
                      </p>
                      <p className="text-xs text-default-400">
                        {selectedFile ? "" : "Only Excel files (.xlsx, .xls) are accepted"}
                      </p>
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-2">
                      <Chip
                        variant="flat"
                        color="primary"
                        endContent={
                          <button onClick={handleRemoveFile}>
                            <X size={14} className="ml-1 text-default-400 hover:text-default-600" />
                          </button>
                        }
                      >
                        {selectedFile.name}
                      </Chip>
                      <span className="text-xs text-default-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  isDisabled={!selectedFile}
                >
                  Import Data
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-1 border-default-200">
          <CardBody>
            <div className="flex flex-col">
              <span className="text-default-500 text-sm">Total Revenue</span>
              <span className="text-2xl font-bold">
                {formatCurrency(rangeData?.totals?.revenue || 0)}
              </span>
              <span className="text-default-400 text-xs mt-1">
                {rangeData?.data?.length || 0} days
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-1 border-default-200">
          <CardBody>
            <div className="flex flex-col">
              <span className="text-default-500 text-sm">Total Expenses</span>
              <span className="text-2xl font-bold">
                {formatCurrency(rangeData?.totals?.expenses || 0)}
              </span>
              <span className="text-default-400 text-xs mt-1">
                {formatCurrency(rangeData?.totals?.expenses ?
                  (rangeData.totals.expenses / rangeData.data.length) : 0)} avg/day
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-1 border-default-200">
          <CardBody>
            <div className="flex flex-col">
              <span className="text-default-500 text-sm">Net Profit</span>
              <span className="text-2xl font-bold">
                {formatCurrency(rangeData?.totals?.profit || 0)}
              </span>
              <span className="text-default-400 text-xs mt-1">
                {rangeData?.totals?.revenue ?
                  `${((rangeData.totals.profit / rangeData.totals.revenue) * 100).toFixed(1)}% margin` : '0% margin'}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-1 border-default-200">
          <CardBody>
            <div className="flex flex-col">
              <span className="text-default-500 text-sm">Occupancy Rate</span>
              <span className="text-2xl font-bold">
                {kpis?.occupancyRate ? `${(kpis.occupancyRate * 100).toFixed(1)}%` : '0%'}
              </span>
              <span className="text-default-400 text-xs mt-1">
                RevPAR: {formatCurrency(kpis?.revenuePerAvailableRoom || 0)}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      <Tabs aria-label="Revenue views">
        <Tab key="overview" title="Overview">
          <Card className="mt-4">
            <CardBody>
              <h3 className="text-lg font-bold mb-4">Revenue Trends</h3>
              {renderRevenueChart()}

              <Divider className="my-6" />

              <h3 className="text-lg font-bold mb-4">Current Month</h3>
              {currentMonthData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium">Revenue</h4>
                    <p className="text-2xl">{formatCurrency(currentMonthData.totalRevenue)}</p>
                    <div className="mt-2 space-y-1">
                      <p>Room: {formatCurrency(currentMonthData.breakdown.room)}</p>
                      <p>Food: {formatCurrency(currentMonthData.breakdown.food)}</p>
                      <p>Other: {formatCurrency(currentMonthData.breakdown.other)}</p>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium">Daily Average</h4>
                    <p className="text-2xl">
                      {formatCurrency(currentMonthData.totalRevenue / new Date().getDate())}
                    </p>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium">Projected Month End</h4>
                    <p className="text-2xl">
                      {formatCurrency(
                        (currentMonthData.totalRevenue / new Date().getDate()) *
                        new Date(selectedYear, currentMonthData.month, 0).getDate()
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="analysis" title="Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardBody>
                <h3 className="text-lg font-bold mb-4 text-center">Revenue vs Expenses</h3>
                {renderRevenueBreakdown()}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="text-lg font-bold mb-4 text-center">Monthly Trends</h3>
                {renderMonthlyTrends()}
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="comparison" title="Year Comparison">
          <Card className="mt-4">
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select
                  label="Select Years"
                  selectionMode="multiple"
                  selectedKeys={new Set(comparisonYears.map(String))}
                  onSelectionChange={(keys) =>
                    setComparisonYears(Array.from(keys).map(Number))
                  }
                  className="w-full md:w-64"
                >
                  {[2024, 2025, 2026, 2027].map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <h3 className="text-lg font-bold mb-4">Year-over-Year Comparison</h3>
              {renderYearComparison()}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default RevenueDashboard;