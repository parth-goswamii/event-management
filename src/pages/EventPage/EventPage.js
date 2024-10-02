import React, { useEffect, useState } from "react";
import {
  Button,
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
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getItem } from "../../common/constants/enums";
import {
  addEventImageUrl,
  addEventUrl,
  BASEURL,
  deleteEventUrl,
  editEventUrl,
  listOfLatestEventUrl,
  profileUrl,
} from "../../API/api_helper";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import {
  ACTIONS,
  ADD,
  ADD_EVENT,
  ADD_EVENT_IMAGE,
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_EVENT,
  CANCEL,
  CONFIRM_DELETE,
  CREATED_BY_EMAIL,
  DASH,
  DATE,
  DELETE,
  EDIT_EVENT,
  EMPTY_STRING,
  EVENT,
  EVENT_DESCRIPTION,
  EVENT_IMAGE,
  EVENT_NAME,
  NA,
  NO_EVENT_ID_TO_DELETE,
  NO_IMAGE,
  PLEASE_SELECT_AN_IMAGE_AND_EVENT_TO_UPLOAD_IMAGE,
  SELECT_EVENT,
  UPDATE,
  UPLOAD,
  UPLOAD_EVENT_IMAGE,
} from "../../common/constants/commonNames";

import "../../STYLE/Event.css"

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", description: "" });
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [imageUploadOpen, setImageUploadOpen] = useState(false);

  const token = getItem("authToken");

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
      if (Array.isArray(result.data)) {
        setEvents(result.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      toast.error(error.message);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = async () => {
    try {
      const response = await fetch(`${BASEURL}${addEventUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          event_name: newEvent.name,
          event_description: newEvent.description,
        }),
      });

      if (response.status === StatusCodes.CREATED) {
        const errorData = await response.json();
        toast.success(errorData.message);
        return;
      }

      const addedEvent = await response.json();
      toast.success(addedEvent.message);
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      setOpen(false);
      setNewEvent({ name: EMPTY_STRING, description: EMPTY_STRING });
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageUploadClick = () => {
    setImageUploadOpen(true);
  };

  const handleImageUploadClose = () => {
    setImageUploadOpen(false);
    setImageFile(null);
    setSelectedEventId(EMPTY_STRING);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !selectedEventId) {
      alert(PLEASE_SELECT_AN_IMAGE_AND_EVENT_TO_UPLOAD_IMAGE);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("event_manage_id", selectedEventId);

    try {
      const response = await fetch(`${BASEURL}${addEventImageUrl}`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.status !== StatusCodes.OK) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const result = await response.json();
      toast.success(result.message);
      handleImageUploadClose();
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditOpen = (event) => {
    setCurrentEvent(event);
    setNewEvent({
      name: event.event_name,
      description: event.event_description,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentEvent(null);
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(
        `${BASEURL}${editEventUrl}${currentEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            event_name: newEvent.name,
            event_description: newEvent.description,
          }),
        }
      );

      if (response.status !== StatusCodes.OK) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const updatedEvent = await response.json();
      toast.success(updatedEvent.message);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
      setEditOpen(false);
      setNewEvent({ name: EMPTY_STRING, description: EMPTY_STRING });
      fetchEvents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteOpen = (id) => {
    setEventToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setEventToDelete(null);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) {
      toast.error(NO_EVENT_ID_TO_DELETE);
      return;
    }

    try {
      const response = await fetch(`${BASEURL}${deleteEventUrl}${eventToDelete}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ is_deleted: true }),
      });

      if (response.status !== StatusCodes.OK) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const result = await response.json();
      toast.success(result.message);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventToDelete)
      );
      handleConfirmDeleteClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const eventColumns = [
    { id: "event_name", label: EVENT_NAME },
    { id: "event_description", label: EVENT_DESCRIPTION },
    {
      id: "created_at",
      label: DATE,
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : DASH,
    },
    { id: "auth_user.email", label: CREATED_BY_EMAIL, render: (row) => (row.auth_user ? row.auth_user.email : NA),},
    {
      id: "event_manage_images",
      label: EVENT_IMAGE,
      render: (row) => {
        const images = row.event_manage_images || [];
        return images.length > 0 ? (
          <img
            src={`${profileUrl}${images[0].image}`}
            alt={row.event_name}
            className="col-img"
          />
        ) : (
          <span>{NO_IMAGE}</span>
        );
      },
    },
    {
      id: "actions",
      label: ACTIONS,
      render: (row) => (
        <>
          <Button
            onClick={() => handleEditOpen(row)}
            className="edit-btn"
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDeleteOpen(row.id)}
            className="dlt-btn"
          >
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="top-div">
      <div className="button-div">
        <h2>{EVENT}</h2>
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleImageUploadClick}
            className="add-eve-button"
          >
            {ADD_EVENT_IMAGE}
          </Button>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            {ADD_EVENT}
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} className="table-style" >
        <Table>
          <TableHead>
            <TableRow>
              {eventColumns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={index}>
                {eventColumns.map((column) => (
                  <TableCell key={column.id}>
                    {column.render ? column.render(event) : event[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{ADD_EVENT}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Name"
            type="text"
            fullWidth
            variant="outlined"
            name="name"
            value={newEvent.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Event Description"
            type="text"
            fullWidth
            variant="outlined"
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {CANCEL}
          </Button>
          <Button onClick={handleAddEvent} color="primary">
            {ADD}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={imageUploadOpen} onClose={handleImageUploadClose}>
        <DialogTitle>{UPLOAD_EVENT_IMAGE}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>{SELECT_EVENT}</InputLabel>
            <Select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              label="Select Event"
            >
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.event_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="imgch-ip"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageUploadClose} color="primary">
            {CANCEL}
          </Button>
          <Button onClick={handleImageUpload} color="primary">
            {UPLOAD}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>{EDIT_EVENT}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Name"
            type="text"
            fullWidth
            variant="outlined"
            name="name"
            value={newEvent.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Event Description"
            type="text"
            fullWidth
            variant="outlined"
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            {CANCEL}
          </Button>
          <Button onClick={handleUpdateEvent} color="primary">
            {UPDATE}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogTitle>{CONFIRM_DELETE}</DialogTitle>
        <DialogContent>
          {ARE_YOU_SURE_YOU_WANT_TO_DELETE_EVENT}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose} color="primary">
            {CANCEL}
          </Button>
          <Button onClick={handleDeleteEvent} color="primary">
            {DELETE}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventPage;