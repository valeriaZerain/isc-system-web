import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  IconButton,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Event } from "../../models/eventInterface";
import { FormContainer } from "../CreateGraduation/components/FormContainer";
import ErrorDialog from "../../components/common/ErrorDialog";
import SuccessDialog from "../../components/common/SucessDialog";
import LoadingOverlay from "../../components/common/Loading";
import {
  getFullEventInformationService,
  updateEventService,
} from "../../services/eventsService";
import { Interns } from "../../models/internsInterface.ts";
import { getInternList } from "../../services/internService.ts";


const validationSchema = Yup.object({
  title: Yup.string().required("El nombre del evento es obligatorio"),
  description: Yup.string().required("La descripción es obligatoria"),
  location: Yup.string().required("La ubicacion es obligatorio"),
  date: Yup.date().required("La fecha es obligatoria"),
  endDate: Yup.date().required("La fecha de finalización es obligatoria"),
  duration: Yup.number()
    .required("La duración es obligatoria")
    .min(1, "La duracion minima es de 1 hora"),
  scholarshipHours: Yup.string().required(
    "Las horas becarias son obligatorias"
  ),
  maxParticipants: Yup.number()
    .required("El número de becarios es obligatorio")
    .min(1, "Debe haber al menos un becario"),
  minParticipants: Yup.number()
    .required("La cantidad mínima de becarios es obligatoria")
    .min(1, "Debe haber al menos 1 becario"),

  responsiblePerson: Yup.number().notRequired(),
});

const UpdateEventForm = () => {
  const { id_event } = useParams<{ id_event: string }>();
  const [event, setEvent] = useState<Event>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [interns, setInterns] = useState<Interns[]>([]); 

  dayjs.extend(utc);
  dayjs.extend(timezone);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await getInternList(); 
        console.log(response)
        setInterns(response.data); 
      } catch (error) {
        console.error("Error al cargar becarios", error);
      }
    };
    fetchInterns();
  }, []);

  const handleCancel = () => {
    formik.resetForm();
    navigate("/programDirector");
  };

  const handleBackNavigate = () => {
    navigate("/programDirector");
  };

  const sucessDialogClose = () => {
    setSuccessDialog(false);
    formik.resetForm();
  };

  const errorDialogClose = () => {
    setErrorDialog(false);
  };

  const fetchEvent = async () => {
    try {
      if (id_event) {
        const res = await getFullEventInformationService(id_event);
        setEvent(res.data);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id_event]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formatWithTimezone = (date: string) => {
        return dayjs(date).tz("America/Caracas").format();
      };

      const valuesWithTimezone = {
        ...formik.values,
        start_date: formatWithTimezone(formik.values.start_date),
        end_date: formatWithTimezone(formik.values.end_date),
        start_cancellation_date: formatWithTimezone(
          formik.values.start_cancellation_date!
        ),
        end_cancellation_date: formatWithTimezone(
          formik.values.end_cancellation_date!
        ),
        registration_deadline: formatWithTimezone(
          formik.values.registration_deadline
        ),
      };
      if (id_event) {
        const res = await updateEventService(
          parseInt(id_event),
          valuesWithTimezone
        );
      }
      formik.resetForm();
      setMessage("Evento actualizado con éxito");
      setSuccessDialog(true);
      navigate("/programDirector");
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar el evento");
      setErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<Event>({
    initialValues: {
      title: event?.title || "",
      start_date: dayjs(event?.start_date).format("YYYY-MM-DD") || "",
      end_date: dayjs(event?.end_date).format("YYYY-MM-DD") || "",
      duration_hours: event?.duration_hours || 0,
      assigned_hours: event?.assigned_hours || 0,
      location: event?.location || "",
      description: event?.description || "",
      max_interns: event?.max_interns || 0,
      min_interns: event?.min_interns || 0,
      responsible_intern_id: event?.responsible_intern_id || 0,
      registration_deadline:
        dayjs(event?.registration_deadline).format("YYYY-MM-DD") || "",
      start_cancellation_date:
        dayjs(event?.start_cancellation_date).format("YYYY-MM-DD") || "",
      end_cancellation_date:
        dayjs(event?.end_cancellation_date).format("YYYY-MM-DD") || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleUpdate,
  });

  return (
    <Grid container spacing={0} alignItems="center">
      <Grid container spacing={4} sx={{ padding: 2, position: "relative" }}>
        <IconButton
          onClick={handleBackNavigate}
          aria-label="back"
          sx={{ position: "absolute", left: 21, top: 60 }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <FormContainer>
        {loading && <LoadingOverlay message="Actualizar Evento..." />}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h4">Actualizar Evento</Typography>
              <Typography
                margin="normal"
                variant="body2"
                sx={{ fontSize: 14, color: "gray" }}
              >
                Ingrese los datos del evento a continuación.
              </Typography>
              <Divider flexItem sx={{ mt: 2, mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={3}>
                  <Typography variant="h6">Información del Evento</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Grid item xs={9}>
                    <TextField
                      id="title"
                      name="title"
                      label="Nombre del evento"
                      variant="outlined"
                      fullWidth
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      helperText={formik.touched.title && formik.errors.title}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="description"
                      name="description"
                      label="Descripción del evento"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                      margin="normal"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      id="location"
                      name="location"
                      label="Ubicación"
                      variant="outlined"
                      fullWidth
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.location &&
                        Boolean(formik.errors.location)
                      }
                      helperText={
                        formik.touched.location && formik.errors.location
                      }
                      margin="normal"
                    />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        id="start_date"
                        name="start_date"
                        label="Fecha de inicio"
                        type="date"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.start_date &&
                          Boolean(formik.errors.start_date)
                        }
                        helperText={
                          formik.touched.start_date && formik.errors.start_date
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="end_date"
                        name="end_date"
                        label="Fecha de finalización"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.end_date &&
                          Boolean(formik.errors.end_date)
                        }
                        helperText={
                          formik.touched.end_date && formik.errors.end_date
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="start_cancellation_date"
                        name="start_cancellation_date"
                        label="Fecha inicio de bajas"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.start_cancellation_date}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.start_cancellation_date &&
                          Boolean(formik.errors.start_cancellation_date)
                        }
                        helperText={
                          formik.touched.start_cancellation_date &&
                          formik.errors.start_cancellation_date
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="end_cancellation_date"
                        name="end_cancellation_date"
                        label="Fecha fin de bajas"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.end_cancellation_date}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.end_cancellation_date &&
                          Boolean(formik.errors.end_cancellation_date)
                        }
                        helperText={
                          formik.touched.end_cancellation_date &&
                          formik.errors.end_cancellation_date
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="registration_deadline"
                        name="registration_deadline"
                        label="Fecha límite de inscripción"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formik.values.registration_deadline}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.registration_deadline &&
                          Boolean(formik.errors.registration_deadline)
                        }
                        helperText={
                          formik.touched.registration_deadline &&
                          formik.errors.registration_deadline
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="duration_hours"
                        name="duration_hours"
                        label="Duración (horas)"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formik.values.duration_hours}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.duration_hours &&
                          Boolean(formik.errors.duration_hours)
                        }
                        helperText={
                          formik.touched.duration_hours &&
                          formik.errors.duration_hours
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Divider flexItem sx={{ mt: 2, mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={3}>
                  <Typography variant="h6">Becarios</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        id="assigned_hours"
                        name="assigned_hours"
                        label="Horas Becarias"
                        type="number"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={formik.values.assigned_hours}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.assigned_hours &&
                          Boolean(formik.errors.assigned_hours)
                        }
                        helperText={
                          formik.touched.assigned_hours &&
                          formik.errors.assigned_hours
                        }
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        id="min_interns"
                        name="min_interns"
                        label="N° Mínimo de Becarios"
                        type="number"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={formik.values.min_interns}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.min_interns &&
                          Boolean(formik.errors.min_interns)
                        }
                        helperText={
                          formik.touched.min_interns &&
                          formik.errors.min_interns
                        }
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        id="max_interns"
                        name="max_interns"
                        label="N° Máximo de Becarios"
                        type="number"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={formik.values.max_interns}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.max_interns &&
                          Boolean(formik.errors.max_interns)
                        }
                        helperText={
                          formik.touched.max_interns &&
                          formik.errors.max_interns
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Divider flexItem sx={{ mt: 2, mb: 2 }} />
            </Grid>

            <Grid container alignItems="center" style={{ marginLeft: '5%' }}>
              <Grid item xs={4} style={{marginLeft:'-10px'}}>
                  <Typography variant="h6" style={{ marginTop: '5px' }}>Supervisor</Typography>
                </Grid>
                <Grid item xs={7}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel></InputLabel>
                        <Autocomplete
                          id="responsible_intern_id"
                          name="responsible_intern_name"
                          options={interns || []}
                          getOptionLabel={(option) => `${option.code + '  ' + option.name + '  ' +option.lastname}`}
                          value={interns.find (
                            (intern) =>
                              intern.id === formik.values.responsible_intern_id) || null}
                          onChange={(event, newValue) =>
                            formik.setFieldValue(
                              "responsible_intern_id",
                              newValue?.id || ""
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Supervisor"
                              variant="outlined"
                              error={
                                formik.touched.responsible_intern_id &&
                                Boolean(formik.errors.responsible_intern_id)
                              }
                              helperText={
                                formik.touched.responsible_intern_id &&
                                formik.errors.responsible_intern_id
                              }
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                </Grid>
             </Grid>

          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            style={{ marginTop: "90px" }}
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleUpdate}
              >
                Actualizar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
        <SuccessDialog
          open={successDialog}
          onClose={sucessDialogClose}
          title={"Evento Creado!"}
          subtitle={"El evento ha sido creado con éxito."}
        />
        <ErrorDialog
          open={errorDialog}
          onClose={errorDialogClose}
          title={"¡Vaya!"}
          subtitle={message}
        />
      </FormContainer>
    </Grid>
  );
};

export default UpdateEventForm;
