import React, { useState, useEffect } from "react";
import {  
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { BASEURL, eventReportUrl, bookingReportUrl } from "../../API/api_helper"; 
import { getItem } from "../../common/constants/enums";
import { ADDRESS_LINE_1, BOOKING_REPORT, CITY, CREATED_BY_EMAIL, DATE_CREATED_AT, EMPTY_STRING, END_DATE, EVENT_DATE, EVENT_DESCRIPTION, EVENT_NAME, EVENT_REPORT, EVENT_VALUE, GENERATE_REPORT, LOADING, NA, NO_DATA_AVAILABLE, PLEASE_SELECT_BOTH_START_END_DATE, REPORT, REPORT_TYPE, START_DATE, STATUS } from "../../common/constants/commonNames";
import { StatusCodes } from "http-status-codes";
import "../../STYLE/ReportsPage.css"


const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(EMPTY_STRING);
  const [endDate, setEndDate] = useState(EMPTY_STRING);
  const [selectedReportType, setSelectedReportType] = useState(EVENT_VALUE);
  const [reportTypeToRender, setReportTypeToRender] = useState(EVENT_VALUE);
  const [reportGenerated, setReportGenerated] = useState(false); 

  useEffect(() => {
    const fetchInitialReportData = async () => {
      setLoading(true);
      const endpoint = `${BASEURL}${eventReportUrl}`; 

      const token = getItem("authToken");

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({ startDate: EMPTY_STRING, endDate: EMPTY_STRING }), 
        });

        const result = await response.json();

        if (!response.ok===StatusCodes.OK) {
          toast.error(result.message);
          return;
        }

        setReportData(result.data || []);
        setReportGenerated(true); 
      } catch (err) {
        toast.error(err.message);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialReportData();
  }, []);

  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      alert(PLEASE_SELECT_BOTH_START_END_DATE);
      return;
    }

    setLoading(true);
    const endpoint = selectedReportType === EVENT_VALUE 
      ? `${BASEURL}${eventReportUrl}`
      : `${BASEURL}${bookingReportUrl}`;

    const token = getItem("authToken");

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      const result = await response.json();

      if (!response.ok===StatusCodes.OK) {
        toast.error(result.message);
        return;
      }

      setReportData(result.data || []);
      setReportGenerated(true); 
      setReportTypeToRender(selectedReportType); 

    } catch (err) {
      toast.error(err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) {
      return <Typography>{LOADING}</Typography>;
    }

    if (reportData.length === 0) {
      return <Typography>{NO_DATA_AVAILABLE}</Typography>;
    }

    const columns = reportTypeToRender === EVENT_VALUE
      ? [
          { id: "event_name", label: EVENT_NAME },
          { id: "event_description", label: EVENT_DESCRIPTION },
          { id: "created_at", label: DATE_CREATED_AT },
          { id: "auth_user.email", label: CREATED_BY_EMAIL},
        ]
      : [
          { id: "event_date", label: EVENT_DATE },
          { id: "status", label: STATUS },
          { id: "address.address_line1", label:ADDRESS_LINE_1 },
          { id: "address.city.city_name", label: CITY },
          { id: "auth_user.email", label: CREATED_BY_EMAIL },
        ];

    return (
      <TableContainer className="table-container" >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <TableRow key={row.id}>
                {reportTypeToRender === EVENT_VALUE ? (
                  <>
                    <TableCell>{row.event_name}</TableCell>
                    <TableCell>{row.event_description}</TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{row.auth_user?.email || NA}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{new Date(row.event_date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.status ||NA}</TableCell>
                    <TableCell>{row.address?.address_line1 || NA}</TableCell>
                    <TableCell>{row.address?.city?.city_name ||NA}</TableCell>
                    <TableCell>{row.auth_user?.email ||NA}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="top-div">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined" className="main-card" >
            <CardContent>
              <Grid container className="grid-card" >
                <Grid item>
                  <Typography variant="h5" gutterBottom>
                    {REPORT}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={2} className="align-cent" >

                    <Grid item>
                      <Grid container className="align-cent">
                        <Typography className="startdt" >{START_DATE}</Typography>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="dateip"
                        />
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid container className="align-cent">
                        <Typography className="startdt" >{END_DATE}</Typography>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="dateip"
                        />
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid container className="align-cent">
                        <Typography className="repoty" >{REPORT_TYPE}</Typography>
                        <select
                          value={selectedReportType}
                          onChange={(e) => setSelectedReportType(e.target.value)}
                          className="drpdwn"
                        >
                          <option value="event">{EVENT_REPORT}</option>
                          <option value="booking">{BOOKING_REPORT}</option>
                        </select>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchReportData}
                      >
                        {GENERATE_REPORT}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              {reportGenerated && renderTable()} 
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportPage;
