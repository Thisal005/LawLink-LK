import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const LawyerAvailability = () => {
  const { user } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [newSlots, setNewSlots] = useState([]); // Slots being added in current session
  const [existingSlots, setExistingSlots] = useState([]); // All slots from DB
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all slots when date changes
  useEffect(() => {
    if (selectedDate && user?._id) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/availability/all/${user._id}`,
            { withCredentials: true }
          );
          const slots = response.data.data
            .filter((slot) => dayjs(slot.startTime).isSame(selectedDate, "day"))
            .map((slot) => ({
              _id: slot._id, // Add slot ID for removal
              startTime: slot.startTime,
              endTime: slot.endTime,
              status: slot.status, // Include status
              displayStart: dayjs(slot.startTime).format("HH:mm"),
              displayEnd: dayjs(slot.endTime).format("HH:mm"),
            }));
          setExistingSlots(slots);
        } catch (err) {
          console.error("Failed to fetch slots:", err);
          setError("Failed to load existing slots");
        }
      };
      fetchSlots();
    }
  }, [selectedDate, user?._id]);

  // Calculate end time (30 minutes after start time)
  const getEndTime = useCallback(
    (time) => {
      const start = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${time}`);
      return start.add(30, "minute").format("HH:mm");
    },
    [selectedDate]
  );

  // Add a new slot
  const handleAddSlot = () => {
    if (!selectedDate || !startTime) {
      setError("Please select a date and start time");
      return;
    }

    const start = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${startTime}`);
    if (start.isBefore(dayjs())) {
      setError("Cannot set availability in the past");
      return;
    }

    const newSlotStart = start;
    const newSlotEnd = start.add(30, "minute");
    const allSlots = [...newSlots, ...existingSlots];
    const hasOverlap = allSlots.some((slot) => {
      const existingStart = dayjs(slot.startTime);
      const existingEnd = dayjs(slot.endTime);
      return newSlotStart.isBefore(existingEnd) && newSlotEnd.isAfter(existingStart);
    });

    if (hasOverlap) {
      setError("This slot overlaps with an existing slot");
      return;
    }

    const newSlot = {
      startTime: start.toISOString(),
      endTime: newSlotEnd.toISOString(),
      displayStart: start.format("HH:mm"),
      displayEnd: newSlotEnd.format("HH:mm"),
      status: "available",
    };

    setNewSlots((prev) =>
      [...prev, newSlot].sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
    );
    setStartTime("");
    setError(null);
  };

  // Remove a new slot (from newSlots)
  const handleRemoveNewSlot = (index) => {
    setNewSlots((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove an existing slot (from DB)
  const handleRemoveExistingSlot = async (slotId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/availability/${slotId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setExistingSlots((prev) => prev.filter((slot) => slot._id !== slotId));
        toast.success("Slot removed successfully");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to remove slot";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async () => {
    if (newSlots.length === 0) {
      setError("Please add at least one new availability slot");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await Promise.all(
        newSlots.map((slot) =>
          axios.post(
            "http://localhost:5000/api/availability/add",
            {
              startTime: slot.startTime,
              endTime: slot.endTime,
            },
            { withCredentials: true }
          )
        )
      );

      if (response.every((res) => res.data.success)) {
        toast.success(
          `Successfully added ${newSlots.length} availability slot${newSlots.length > 1 ? "s" : ""}!`
        );
        const newSlotsWithIds = response.map((res, index) => ({
          ...newSlots[index],
          _id: res.data.data._id, // Add the returned slot ID
        }));
        setExistingSlots((prev) =>
          [...prev, ...newSlotsWithIds].sort((a, b) =>
            dayjs(a.startTime).diff(dayjs(b.startTime))
          )
        );
        setNewSlots([]);
        setStartTime("");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to add availability slots";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewSlots([]);
    setStartTime("");
    setError(null);
  };

  return (
    <div className="lawyer-availability p-6 bg-white rounded-lg shadow-md">
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Manage Availability
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Your Availability</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              minDate={dayjs()}
              sx={{ mt: 2 }}
            />
          </LocalizationProvider>

          <div className="flex gap-2 items-end mt-4">
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 1800 }} // 30-minute intervals
            />
            <Button
              variant="outlined"
              onClick={handleAddSlot}
              disabled={!startTime || !selectedDate}
            >
              Add Slot
            </Button>
          </div>

          {(existingSlots.length > 0 || newSlots.length > 0) && (
            <div className="mt-4">
              <Typography variant="subtitle1">Availability Slots:</Typography>
              <List dense>
                {[...existingSlots, ...newSlots]
                  .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
                  .map((slot, index) => {
                    const minutesUntilStart = dayjs(slot.startTime).diff(dayjs(), "minute");
                    const canRemove = minutesUntilStart > 15 && slot.status === "available";
                    const isNewSlot = !slot._id; // New slots won't have an _id yet

                    return (
                      <ListItem
                        key={slot._id || `new-${index}`} // Use index for new slots
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() =>
                              isNewSlot
                                ? handleRemoveNewSlot(index - existingSlots.length)
                                : handleRemoveExistingSlot(slot._id)
                            }
                            disabled={!canRemove}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${slot.displayStart} - ${slot.displayEnd} (${slot.status})`}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || newSlots.length === 0}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              `Add ${newSlots.length} Slot${newSlots.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LawyerAvailability;