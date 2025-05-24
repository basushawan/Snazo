import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import InfoCard from "../../components/cards/InfoCard";
import { addThousandSeparators } from "../../utils/helper";
import { IoMdCard } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/layouts/TaskListTable";
import CustomPieChart from "../../components/charts/CustomPieChart";
import CustomBarChart from "../../components/charts/CustomBarChart";

const COLORS = ["#8d51ff", "#00b8db", "#7bce00"];

const Dashboard = () => {
  useUserAuth();
  const [dashboardData, setDashboardData] = React.useState(null);
  const [pieChartData, setPieChartData] = React.useState(null);
  const [barChartData, setBarChartData] = React.useState(null);
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);

  //Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDist = data?.taskDist || null;
    const taskPriority = data?.taskPriorityLevels || null;

    const statusData = [
      { status: "Pending", count: taskDist?.Pending || 0 },
      { status: "In-Progress", count: taskDist?.["In-Progress"] || 0 },
      { status: "Completed", count: taskDist?.Completed || 0 },
    ];
    setPieChartData(statusData);

    const priorityData = [
      { status: "Low", count: taskPriority?.Low || 0 },
      { status: "Medium", count: taskPriority?.Medium || 0 },
      { status: "High", count: taskPriority?.High || 0 },
    ];
    setBarChartData(priorityData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.DASHBOARD);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error getting dashboard data: ", error);
    }
  };
  const onSeeMore = () => {
    navigate("/admin/tasks");
  };
  React.useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Hey {user?.name} !</h2>
            <p className="mt-1.5 text-xs md:text-[13px] text-gray-400">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            color="bg-primary"
            value={addThousandSeparators(
              dashboardData?.charts?.taskDist?.All || 0
            )}
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Pending"
            color="bg-violet-500"
            value={addThousandSeparators(
              dashboardData?.charts?.taskDist?.Pending || 0
            )}
          />

          <InfoCard
            icon={<IoMdCard />}
            label="In-Progress"
            color="bg-cyan-500"
            value={addThousandSeparators(
              dashboardData?.charts?.taskDist?.["In-Progress"] || 0
            )}
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Completed"
            color="bg-lime-500"
            value={addThousandSeparators(
              dashboardData?.charts?.taskDist?.Completed || 0
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>
        <div className="">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button onClick={onSeeMore} className="card-btn">
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
