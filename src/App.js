import React, { useState, useRef, useEffect } from "react";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { nanoid } from "nanoid";
import {
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Container
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";

import "./custom.css";

import events from "./events";
import CustomModal from "./components/CustomModal";
import ServiceItemList from "./components/ServiceItemList";
import ServiceSelect from "./components/ServiceSelect";
import { click } from "@testing-library/user-event/dist/click";

export default function App() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const calendarRef = useRef(null);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [servicesForEvent, setServicesForEvent] = useState([]);

  const [services, setServices] = useState([
    {value: "General Cleaning", label: "General Cleaning"},
    {value: "Wash Clothes", label: "Wash Clothes"},
    {value: "Maintenance", label: "Maintenance"}
  ])

  const handleCloseModal = () => {
    handleClose();
    setModal(false);
  };

  function handleDateClick(arg) {
    console.log('handleDateClick');
  }

  function handleDateSelect(selectInfo) {
    if (
      selectInfo.view.type === "timeGridWeek" ||
      selectInfo.view.type === "timeGridDay"
    ) {
      selectInfo.view.calendar.unselect();
      setState({ selectInfo, state: "create" });
      setStart(selectInfo.start);
      setEnd(selectInfo.end);
      setModal(true);
    }
  }

  function renderEventContent(eventInfo) {
    return (
      <div>
        <i
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {eventInfo.event.title}
        </i>
      </div>
    );
  }

  function handleEventClick(clickInfo) {
    setState({ clickInfo, state: "update" });
    // set detail
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);

    let _services = []
    for (let i = 0; i < clickInfo.event.extendedProps.service.length; i++) {
      _services.push({value: clickInfo.event.extendedProps.service[i], label: clickInfo.event.extendedProps.service[i]})
    }
    setServicesForEvent(_services)
    setModal(true);
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }
  function handleEventDrop(checkInfo) {
    setState({ checkInfo, state: "drop" });
    setConfirmModal(true);
  }

  function handleEventResize(checkInfo) {
    setState({ checkInfo, state: "resize" });
    setConfirmModal(true);
  }

  function handleEdit() {
    state.clickInfo.event.setStart(start);
    state.clickInfo.event.setEnd(end);
    let tmp = []
    for (let i = 0; i < servicesForEvent.length; i++) {
      tmp.push(servicesForEvent[i].value)
    }
    state.clickInfo.event.setExtendedProp("service", tmp)

    state.clickInfo.event.mutate({
      standardProps: { title }
    });
    handleClose();
  }

  function handleSubmit() {
    const newEvent = {
      id: nanoid(),
      title,
      start: state.selectInfo?.startStr || start.toISOString(),
      end: state.selectInfo?.endStr || end.toISOString(),
    };

    let calendarApi = calendarRef.current.getApi();

    calendarApi.addEvent(newEvent);
    handleClose();
  }

  function handleDelete() {
    state.clickInfo.event.remove();
    handleClose();
  }

  function handleClose() {
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setState({});
    setModal(false);
  }

  const [state, setState] = useState({});

  // useEffect(() => {
  //   console.log("services", services)
  // }, [services])

  return (
    <div className="App">
      <h1 className="text-center mt-4">Calendar Event Todo App</h1>
      <Container>
        <Row>
          <Col md={3} className="mt-5">
            <ServiceItemList setServices={setServices} />
          </Col>
          <Col md={9}>
            <Row className="mb-4">
              <Col
                className="col-sm-3 col-md-3 pl-4"
              >
              </Col>
              <Col
                className="col-sm-3 offset-sm-6 col-md-3 offset-md-6 pr-4"
              >
                <Button
                  style={{ float: "right" }}
                  color="secondary"
                  onClick={() => setModal(true)}
                >
                  Add Event
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                  }}
                  buttonText={{
                    month: "month",
                    week: "week",
                    day: "day",
                    list: "list"
                  }}
                  initialView="timeGridWeek"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  allDaySlot={false}
                  weekends={weekendsVisible}
                  initialEvents={events}
                  select={handleDateSelect}
                  eventContent={renderEventContent} // custom render function
                  eventClick={handleEventClick}
                  eventsSet={() => handleEvents(events)}
                  eventDrop={handleEventDrop}
                  eventResize={handleEventResize}
                  dateClick={handleDateClick}
                  eventAdd={(e) => {
                    console.log("eventAdd", e);
                  }}
                  eventChange={(e) => {
                    console.log("eventChange", e);
                  }}
                  eventRemove={(e) => {
                    console.log("eventRemove", e);
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        
      </Container>

      <CustomModal
        title={state.state === "update" ? "Update Event" : "Add Event"}
        isOpen={modal}
        toggle={handleCloseModal}
        onCancel={handleCloseModal}
        onSubmit={state.clickInfo ? handleEdit : handleSubmit}
        submitText={state.clickInfo ? "Update" : "Save"}
        onDelete={state.clickInfo && handleDelete}
        deleteText="Delete"
      >
        <FormGroup>
          <Label>Event Name</Label>
          <Input
            type="text"
            name="title"
            placeholder="with a placeholder"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Event Date (From - End)</Label>
          <DateRangePicker
            initialSettings={{
              locale: {
                format: "M/DD hh:mm A"
              },
              startDate: start,
              endDate: end,
              timePicker: true
            }}
            onApply={(event, picker) => {
              setStart(new Date(picker.startDate));
              setEnd(new Date(picker.endDate));
            }}
          >
            <input className="form-control" type="text" />
          </DateRangePicker>
        </FormGroup>
        <FormGroup>
          <Label>Services</Label>
          <ServiceSelect services={services} selectedServices={servicesForEvent} setServicesForEvent={setServicesForEvent}></ServiceSelect>
        </FormGroup>
      </CustomModal>

      <CustomModal
        title={state.state === "resize" ? "Resize Event" : "Drop Event"}
        isOpen={confirmModal}
        toggle={() => {
          state.checkInfo.revert();
          setConfirmModal(false);
        }}
        onCancel={() => {
          state.checkInfo.revert();
          setConfirmModal(false);
        }}
        cancelText="Cancel"
        onSubmit={() => setConfirmModal(false)}
        submitText={"OK"}
      >
        Do you want to {state.state} this event?
      </CustomModal>
    </div>
  );
}
