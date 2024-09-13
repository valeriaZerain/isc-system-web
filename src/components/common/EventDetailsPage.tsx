import { ReactNode } from "react";
import { Container, Grid, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { EventDetails } from "../../models/eventInterface";

interface TablePageProps {
  event: EventDetails;
  children: ReactNode;
}

const TablePage: React.FC<TablePageProps> = ({ event, children }) => {
  return event ? (
    <Container fixed>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PersonIcon color="primary" />
            {event.title}
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                <strong>Fecha Inicial:</strong> {event.date.format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Fecha Final:</strong> {event.endDate.format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Encargado:</strong> {event.responsiblePerson}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Ubicación:</strong> {event.location}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Máximo Becarios:</strong> {event.maxParticipants}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                <strong>Periodo de Inscripciones:</strong>{" "}
                {event.registrationDeadline}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Horas Becarias:</strong> {event.scholarshipHours}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Duración:</strong> {event.duration} horas
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Solicitudes de Becarios:</strong> 
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Typography variant="h6" align="center">
      Cargando detalles del evento...
    </Typography>
  );
};

export default TablePage;
