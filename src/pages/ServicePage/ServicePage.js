import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import {
  addServiceUrl,
  BASEURL,
  updateServiceUrl,
  deleteServiceUrl,
  listOfServiceUrl,
  listOfLatestEventUrl,
} from "../../API/api_helper";
import "../../STYLE/Service.css";
import { getItem } from "../../common/constants/enums";
import {
  ACTIONS,
  ADD,
  ADD_SERVICE,
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_SERVICE,
  CANCEL,
  CONFIRM_DELETE,
  DELETE,
  DESCRIPTION,
  EDIT_SERVICE,
  EMPTY_STRING,
  EVENT_NAME,
  PRICE,
  SERVICE_NAME,
  SERVICES,
  UPDATE,
  NA,
} from "../../common/constants/commonNames";
import BaseButton from "../../common/components/BaseButton";
import BaseTextField from "../../common/components/BaseTextField";
import { WidthFull } from "@mui/icons-material";

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({
    name: EMPTY_STRING,
    description: EMPTY_STRING,
    price: EMPTY_STRING,
    event_id: EMPTY_STRING,
  });

  const [currentService, setCurrentService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const token = getItem("authToken");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASEURL}${listOfServiceUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status !== StatusCodes.OK) {
        toast.error(response.message);
        return;
      }

      const result = await response.json();
      setServices(result.data || []);
    } catch (error) {
      toast.error(error.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASEURL}${listOfLatestEventUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status !== StatusCodes.OK) {
        toast.error(response.message);
        return;
      }

      const result = await response.json();
      setEvents(result.data || []);
    } catch (error) {
      toast.error(error.message);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleEventChange = (eventId) => {
    setNewService((prev) => ({ ...prev, event_id: eventId }));
  };

  const handleAddService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASEURL}${addServiceUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          service_name: newService.name,
          service_description: newService.description,
          price: newService.price,
          event_manage_id: newService.event_id,
        }),
      });

      const addedService = await response.json();

      if (addedService.statusCode === StatusCodes.CREATED) {
        toast.success(addedService.message);
        setOpen(false);
        setNewService({ name: EMPTY_STRING, description: EMPTY_STRING, price: EMPTY_STRING, event_id: EMPTY_STRING });
        fetchServices();
      } else {
        toast.error(addedService.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (service) => {
    setCurrentService(service);
    setNewService({
      name: service.service_name,
      description: service.service_description,
      price: service.price,
      event_id: service.event_manage ? service.event_manage.event_id : EMPTY_STRING,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentService(null);
  };

  const handleUpdateService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASEURL}${updateServiceUrl}${currentService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          service_name: newService.name,
          service_description: newService.description,
          price: newService.price,
          event_manage_id: newService.event_id,
        }),
      });

      const updatedService = await response.json();

      if (updatedService.statusCode === StatusCodes.ACCEPTED) {
        toast.success(updatedService.message);
        setEditOpen(false);
        setNewService({ name: EMPTY_STRING, description: EMPTY_STRING, price: EMPTY_STRING, event_id: EMPTY_STRING });
        fetchServices();
      } else {
        toast.error(updatedService.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpen = (id) => {
    setServiceToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setServiceToDelete(null);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASEURL}${deleteServiceUrl}${serviceToDelete}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ is_deleted: true }),
      });

      const deletedService = await response.json();

      if (deletedService.statusCode === StatusCodes.OK) {
        toast.success(deletedService.message);
        setServices((prev) => prev.filter((service) => service.id !== serviceToDelete));
        handleConfirmDeleteClose();
      } else {
        toast.error(deletedService.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const serviceColumns = [
    { id: "service_name", label: SERVICE_NAME },
    { id: "service_description", label: DESCRIPTION },
    { id: "price", label: PRICE },
    {
      id: "event_name",
      label: EVENT_NAME,
      render: (row) => (row.event_manage ? row.event_manage.event_name : NA),
    },
    {
      id: "actions",
      label: ACTIONS,
      render: (row) => (
        <>
          <BaseButton text={<EditIcon />} onClick={() => handleEditOpen(row)}  className="edit-btn"/>
          <BaseButton text={<DeleteIcon />} onClick={() => handleDeleteOpen(row.id)} className="delete-btn" />
        </>
      ),
    },
  ];

  return (
    <div className="top-div">
      <div className="button-div">
        <h2>{SERVICES}</h2>
        <BaseButton text={ADD_SERVICE} onClick={() => setOpen(true)}  className="top-add-serv"/>
      </div>

      <TableContainer component={Paper} className="table-style">
        <Table className="table-row">
          <TableHead>
            <TableRow>
              {serviceColumns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={index}>
                {serviceColumns.map((column) => (
                  <TableCell key={column.id}>
                    {column.render ? column.render(service) : service[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{ADD_SERVICE}</DialogTitle>
        <DialogContent>
          <BaseTextField 
            className="add-serv-ip"
            label={SERVICE_NAME}
            name="name"
            type="text"
            value={newService.name}
            onChange={handleInputChange}
          />
          <BaseTextField
            className="add-serv-ip"
            label={DESCRIPTION}
            name="description"
            type="text"
            value={newService.description}
            onChange={handleInputChange}
          />
          <BaseTextField
            className="add-serv-ip"
            label={PRICE}
            name="price"
            type="number"
            value={newService.price}
            onChange={handleInputChange}
          />
          <FormControl fullWidth className="event-dropdown">
            <InputLabel>{EVENT_NAME}</InputLabel>
            <Select
              value={newService.event_id}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.event_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <BaseButton text={CANCEL} onClick={() => setOpen(false)} disabled={loading}  />
          <BaseButton text={ADD} onClick={handleAddService} loading={loading} />
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>{EDIT_SERVICE}</DialogTitle>
        <DialogContent>
          <BaseTextField
            label={SERVICE_NAME}
            className="add-serv-ip"
            name="name"
            type="text"
            value={newService.name}
            onChange={handleInputChange}
          />
          <BaseTextField
           className="add-serv-ip"
            label={DESCRIPTION}
            name="description"
            type="text"
            value={newService.description}
            onChange={handleInputChange}
          />
          <BaseTextField
           className="add-serv-ip"
            label={PRICE}
            name="price"
            type="number"
            value={newService.price}
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel>{EVENT_NAME}</InputLabel>
            <Select
              value={newService.event_id}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.event_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <BaseButton text={CANCEL} onClick={handleEditClose} disabled={loading}  />
          <BaseButton text={UPDATE} onClick={handleUpdateService} loading={loading} />
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogTitle>{CONFIRM_DELETE}</DialogTitle>
        <DialogContent>{ARE_YOU_SURE_YOU_WANT_TO_DELETE_SERVICE}</DialogContent>
        <DialogActions>
          <BaseButton text={CANCEL} onClick={handleConfirmDeleteClose} disabled={loading} />
          <BaseButton text={DELETE} onClick={handleDeleteService} loading={loading} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServicePage;
