// Define the type for an available time slot
export interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: string; // "available" or "booked"
  service: {
    _id: string;
  };
}

// Define the type for service details
export interface Service {
  photo: string | undefined;
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

// Define the response structure for service details query
export interface ServiceResponse {
  data: { data: Service };
  isLoading: boolean;
  isError: boolean;
}

// Define the response structure for available time slots query
export interface TimeSlotsResponse {
  data: {
    data: { data: TimeSlot[] };
  };
  isLoading: boolean;
  isError: boolean;
}
