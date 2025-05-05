// ticketService.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/Ticket";

// Service for handling updates to existing tickets
export const submitUpdates = async (ticketId, updateData) => {
  try {
    const response = await axios.post(
      `${API_URL}/updateTicket/${ticketId}`,
      updateData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to submit updates";
  }
};

// Service for creating new tickets with updates
export const raiseTicketWithUpdates = async (ticketData) => {
  try {
    const response = await axios.post(`${API_URL}/raiseTicket`, ticketData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to raise ticket";
  }
};
