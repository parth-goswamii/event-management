import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { StatusCodes } from "http-status-codes";
import {
  ACTIVE_USERS,
  ADDRESS_LINE_1,
  APPROVED_BOOKINGS,
  CANCELLED_BOOKINGS,
  CITY,
  CREATED_BY_EMAIL,
  DASH,
  DATE,
  DEACTIVATED_USERS,
  ERROR_FETCHING_DATA_FROM,
  EVENT_DATE,
  EVENT_DESCRIPTION,
  EVENT_NAME,
  HTTP_ERROR_STATUS,
  LATEST_BOOKINGS,
  LATEST_EVENTS,
  NO_LATEST_BOOKINGS_AVAILABLE,
  NO_LATEST_EVENTS_AVAILABLE,
  PENDING_BOOKING,
  STATUS,
  TOTAL_BOOKING,
  TOTAL_EVENTS,
  TOTAL_USERS,
  USER_COUNT_BY_YEAR,
  YEARLY,
} from "../../common/constants/commonNames";
import {
  BASEURL,
  countOfBookingStatusUrl,
  countOfTotalEventUrl,
  countOfTotalUserUrl,
  graphOfUserUrl,
  listOfLatestBookingUrl,
  listOfLatestEventUrl,
} from "../../API/api_helper";
import { toast } from "react-toastify";
import "../../STYLE/Dashboard.css";
import BaseTable from "../../common/components/BaseTable";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [latestEvents, setLatestEvents] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [countOfPendingBooking, setCountOfPendingBooking] = useState(0);
  const [countOfApprovedBooking, setCountOfApprovedBooking] = useState(0);
  const [countOfCancelledBooking, setCountOfCancelledBooking] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalDeActiveUsers, setTotalDeActiveUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [userGraphData, setUserGraphData] = useState([]);
  const [userCountsByYear, setUserCountsByYear] = useState([]);
  const [animatedTotalBookings, setAnimatedTotalBookings] = useState(0);
  const [animatedPendingBookings, setAnimatedPendingBookings] = useState(0);
  const [animatedApprovedBookings, setAnimatedApprovedBookings] = useState(0);
  const [animatedCancelledBookings, setAnimatedCancelledBookings] = useState(0);
  const [animatedTotalUsers, setAnimatedTotalUsers] = useState(0);
  const [animatedActiveUsers, setAnimatedActiveUsers] = useState(0);
  const [animatedDeActiveUsers, setAnimatedDeActiveUsers] = useState(0);
  const [animatedTotalEvents, setAnimatedTotalEvents] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchData = async (url, setState, method = "GET", body = null) => {
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: method === "POST" ? JSON.stringify(body) : null,
        });
        if (!response.status === StatusCodes.OK) {
          throw new Error(`${HTTP_ERROR_STATUS} ${response.status}`);
        }
        const data = await response.json();
        setState(data.data || []);
      } catch (err) {
        toast.error(`${ERROR_FETCHING_DATA_FROM}${url}:`, err);
      }
    };

    fetchData(`${BASEURL}${listOfLatestEventUrl}`, setLatestEvents);
    fetchData(`${BASEURL}${listOfLatestBookingUrl}`, setLatestBookings);

    fetchData(`${BASEURL}${countOfBookingStatusUrl}`, (data) => {
      if (data.length > 0) {
        const bookingData = data[0];
        setTotalBookings(bookingData.countOfTotalBooking);
        setCountOfPendingBooking(bookingData.countOfPendingBooking);
        setCountOfApprovedBooking(bookingData.countOfApprovedBooking);
        setCountOfCancelledBooking(bookingData.countOfCancelledBooking);
      }
    });

    fetchData(`${BASEURL}${countOfTotalUserUrl}`, (data) => {
      if (data.length > 0) {
        const userData = data[0];
        setTotalUsers(userData.countOfTotalUser);
        setTotalActiveUsers(userData.countOfTotalActiveUser);
        setTotalDeActiveUsers(userData.countOfTotalDeActiveUser);
      }
    });

    fetchData(`${BASEURL}${countOfTotalEventUrl}`, (data) => {
      if (data.length > 0) {
        setTotalEvents(data[0].countOfTotalEvent);
      }
    });

    fetchData(`${BASEURL}${graphOfUserUrl}`, setUserCountsByYear, "POST", {
      type: "Yearly",
    });
  }, []);

  useEffect(() => {
    const animateCount = (targetValue, setAnimatedValue) => {
      let count = 0;
      const interval = setInterval(() => {
        if (count < targetValue) {
          count += Math.ceil(targetValue / 100);
          setAnimatedValue(Math.min(count, targetValue));
        } else {
          clearInterval(interval);
        }
      }, 20);
    };

    animateCount(totalBookings, setAnimatedTotalBookings);
    animateCount(countOfPendingBooking, setAnimatedPendingBookings);
    animateCount(countOfApprovedBooking, setAnimatedApprovedBookings);
    animateCount(countOfCancelledBooking, setAnimatedCancelledBookings);
    animateCount(totalUsers, setAnimatedTotalUsers);
    animateCount(totalActiveUsers, setAnimatedActiveUsers);
    animateCount(totalDeActiveUsers, setAnimatedDeActiveUsers);
    animateCount(totalEvents, setAnimatedTotalEvents);
  }, [
    totalBookings,
    countOfPendingBooking,
    countOfApprovedBooking,
    countOfCancelledBooking,
    totalUsers,
    totalActiveUsers,
    totalDeActiveUsers,
    totalEvents,
  ]);

  const pieChartData = {
    labels: userCountsByYear.map((item) => item.Year),
    datasets: [
      {
        data: userCountsByYear.map((item) => item.countOfTotalUser),
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const eventColumns = [
    { id: "event_name", label: EVENT_NAME },
    { id: "event_description", label: EVENT_DESCRIPTION },
    {id: "created_at", label: EVENT_DATE},
    { id: "auth_user.email", label: CREATED_BY_EMAIL }, 
  ];

  const bookingColumns = [
    { id: "event_date", label: EVENT_DATE },
    { id: "status", label: STATUS },
    { id: "address.address_line1", label: ADDRESS_LINE_1 },
    { id: "address.city.city_name", label:CITY },
    { id: "auth_user.email", label:CREATED_BY_EMAIL },
  ];

  return (
    <div className="top-div">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="e0f7fa">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {TOTAL_BOOKING}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedTotalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="c8e6c9">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {APPROVED_BOOKINGS}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedApprovedBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="ffe0b2">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {PENDING_BOOKING}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedPendingBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="ffccbc">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {CANCELLED_BOOKINGS}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedCancelledBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="e0f7fa">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {TOTAL_USERS}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedTotalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="c8e6c9">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {ACTIVE_USERS}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedActiveUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="ffccbc">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {DEACTIVATED_USERS}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedDeActiveUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} className="c8e6c9">
            <CardContent>
              <Typography variant="h6" className="font-weight-bold">
                {TOTAL_EVENTS}
              </Typography>
              <Typography variant="h5" className="font-weight-bold">
                {animatedTotalEvents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} className="table-card m-1">
            <Typography variant="h6">{LATEST_EVENTS}</Typography>
            <div className="table-div">
              <BaseTable
                columns={eventColumns}
                data={latestEvents} 
                noDataMessage={NO_LATEST_EVENTS_AVAILABLE}
              />
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} className="table-card m-1">
            <Typography variant="h6">{LATEST_BOOKINGS}</Typography>
            <div className="table-div">
              <BaseTable
                columns={bookingColumns}
                data={latestBookings} 
                noDataMessage={NO_LATEST_BOOKINGS_AVAILABLE}
              />
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} className="pb-5">
          <Card elevation={3} className="pie-card">
            <Typography variant="h6">{USER_COUNT_BY_YEAR}</Typography>
            <div className="pie-div">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
