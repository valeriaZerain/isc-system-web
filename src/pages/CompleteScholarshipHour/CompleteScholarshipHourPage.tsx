import { Grid } from "@mui/material";
import CompleteScholarshipHourEventCard from "../../components/cards/CompleteScholarshipHourEventCard";
import { useState, useEffect } from "react";
import { Event } from "../../models/eventInterface";
import { getEventsService } from "../../services/eventsService";

const CompleteScholarshipHourPage = () => {
  const [events, setEvents] = useState<Event[]>();

  const fetchEvents = async () => {
    try {
      const res = await getEventsService();
      setEvents(res.data);
    } catch (error) {
      console.error(error, "Could not fetch events");
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {events?.map((event, index) => {
          return (
            <Grid item xs={12}>
              <CompleteScholarshipHourEventCard key={index} event={event} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default CompleteScholarshipHourPage;
