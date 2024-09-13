import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import ContainerPage from "../../components/common/ContainerPage";
import {
  deleteEventService,
  getEventsInformationsService,
} from "../../services/eventsService";
import { EventInformations } from "../../models/eventInterface";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const EventTable = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventInformations[]>();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alert, setAlert] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const fetchEvents = async () => {
    const res = await getEventsInformationsService();
    if (res.success) {
      setEvents(res.data);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "start_date",
      headerName: "Fecha Inicio",
      headerAlign: "center",
      align: "center",
      flex: 1,
      // TODO: change any to an interface
      valueGetter: (params: any) =>
        dayjs(params.startDate).format("DD/MM/YYYY"),
    },
    {
      field: "title",
      headerName: "Nombre del Evento",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "responsible_intern_id",
      headerName: "Supervisor del evento",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "pending_interns",
      headerName: "Solicitudes de Becarios",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "accepted_interns",
      headerName: "Becarios Seleccionados",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            aria-label="ver"
            onClick={() => handleView(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="editar"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="eliminar"
            onClick={() => handleClickOpen(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  const handleView = (id: number) => {
    navigate(`/interns/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/editEvent/${id}`);
  };

  const handleClickOpen = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    const res = selectedId && (await deleteEventService(selectedId));
    if (res.success) {
      setAlert({
        severity: "success",
        message: "¡Evento eliminado con éxito!",
      });
    } else {
      setAlert({
        severity: "error",
        message: "No se pudo eliminar el evento",
      });
    }
    setSnackbarOpen(true);
    setOpen(false);
    fetchEvents();
  };

  return (
    <ContainerPage
      title="Lista de Eventos"
      subtitle="Resumen de los eventos programados y sus detalles"
      actions={
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateEvent}
          startIcon={<AddIcon />}
        >
          Agregar evento
        </Button>
      }
    >
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={events || []}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          classes={{
            root: "bg-white dark:bg-gray-800",
            columnHeader: "bg-gray-200 dark:bg-gray-800 ",
            cell: "bg-white dark:bg-gray-800",
            row: "bg-white dark:bg-gray-800",
            columnHeaderTitle: "!font-bold text-center",
          }}
          pageSizeOptions={[5, 10]}
        />
        <ConfirmDialog
          open={open}
          onClose={handleClose}
          onConfirm={handleDelete}
          title="Confirmar eliminación"
          description="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        />
        {alert && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={alert.severity}
              sx={{ width: "100%" }}
            >
              {alert.message}
            </Alert>
          </Snackbar>
        )}
      </div>
    </ContainerPage>
  );
};

export default EventTable;
