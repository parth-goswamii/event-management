import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isEvent, setIsEvent] = useState(false)
  const [isService, setIsService] = useState(false)
  const [isReports,setIsReports] = useState(false)
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Event"){
      setIsEvent(false);
    }
    if (iscurrentState !== "Service"){
      setIsService(false);
    }
    if (iscurrentState !== "Reports"){
      setIsReports(false);
    }
    
  }, [
    history,
    iscurrentState,
    isDashboard,
    isEvent,
    isService,
    isReports
  ]);

  const menuItems = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "mdi mdi-monitor-dashboard",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "event",
      label: "Event",
      icon: "mdi mdi-calendar",
      link: "/event",
      stateVariables: isEvent,
      click: function (e) {
        e.preventDefault();
        setIsEvent(!isEvent);
        setIscurrentState("Event");
        updateIconSidebar(e);
      },
    },
    {
      id: "service",
      label: "Service",
      icon: "mdi mdi-wrench-cog-outline",
      link: "/service",
      stateVariables: isService,
      click: function (e) {
        e.preventDefault();
        setIsService(!isService);
        setIscurrentState("Service");
        updateIconSidebar(e);
      },
    },
    {
      id: "report",
      label: "Reports",
      icon: "mdi mdi-file-cad",
      link: "/report",
      stateVariables: isReports,
      click: function (e) {
        e.preventDefault();
        setIsReports(!isReports);
        setIscurrentState("Reports");
        updateIconSidebar(e);
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
