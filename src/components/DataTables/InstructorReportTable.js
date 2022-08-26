import React, { Component } from "react";
import { MDBDataTableV5 } from "mdbreact";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/images/home/logo.png";
import * as Unicons from "@iconscout/react-unicons/index";

export default class InstructorReportTable extends Component {
  state = {};

  exportPDF = () => {
    const orientation = "portrait";
    const unit = "pt";
    const size = "A4";
    const margins = {
      bottom: 40,
      top: 10,
      left: 10,
      right: 10,
    };
    const marginLeft = 20;

    if (typeof window !== "undefined") {
      const doc = new jsPDF("portrait", "pt", "A4", [200, 400]);

      var img = new Image();
      img.src = logo;

      var objToday = new Date(),
        weekday = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = (function () {
          var a = objToday;
          if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
          a = parseInt((a + "").charAt(1));
          return 1 === a ? "st" : 2 === a ? "nd" : 3 === a ? "rd" : "th";
        })(),
        dayOfMonth =
          today + (objToday.getDate() < 10)
            ? "0" + objToday.getDate() + domEnder
            : objToday.getDate() + domEnder,
        months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour =
          objToday.getHours() > 12
            ? objToday.getHours() - 12
            : objToday.getHours() < 10
            ? "0" + objToday.getHours()
            : objToday.getHours(),
        curMinute =
          objToday.getMinutes() < 10
            ? "0" + objToday.getMinutes()
            : objToday.getMinutes(),
        curSeconds =
          objToday.getSeconds() < 10
            ? "0" + objToday.getSeconds()
            : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
      var today = dayOfMonth + " " + curMonth + ", " + curYear;

      doc.setFontSize(15);
      doc.setFont("Times New Roman");

      const uni = "LLOYDANT UNIVERSITY";
      const ass = this.props.instructorList[0].department + " Department";
      const footer = "khjlllbk";
      const title = "Uinvited";
      const headers2 = [
        [
          " ",
          // "STAFF NO",
          // "STAFF NAME",
          // "RANK",
          // "DEPARTMENT",
          // "SALARY LEVEL",
          // "DATE OF ASSUMPTION"
          // "application score",
        ],
      ];

      const headers = [["S/N", "STAFF", "EMAIL", "DEPARTMENT"]];

      let bodyFoot = [
        {
          vc: "For: SCHOOL ADMINISTRATOR",
        },
      ];

      const dora = bodyFoot.map((d) => [d.vc]);

      const data = this.props.instructorList.map((d) => [
        d.sNo,
        d.name,
        d.email,
        d.department,
      ]);

      let content = {
        startY: 220,
        head: headers,
        body: data,
      };

      let content2 = {
        head: headers2,
        body: dora,
        theme: "plain",
        styles: { fontStyle: "italic" },
      };

      doc.setFont("Arial");
      doc.setFontSize(17);

      doc.addImage(img, "png", 280, 20, 34, 34);

      doc.setFont(undefined, "bold");
      doc.text(uni, 190, 70);
      doc.setFont(undefined, "normal");
      doc.text("P.M.B. 5025", 260, 87);
      doc.text("ENUGU", 280, 105);

      doc.setFontSize(15);
      doc.setLineDash([20, 0], 10);
      doc.line(50, 135, 553, 135);
      doc.text("INSTRUCTOR REPORT", 60, 150);
      doc.text("Date: " + " " + today, 380, 150);
      doc.setLineDash([20, 0], 10);
      doc.line(50, 155, 553, 155);

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");

      doc.text(ass, 210, 200);
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      doc.autoTable(content);
      //  doc.autoTableEndPosY() + 15
      var check = doc.autoTableEndPosY() + 15;

      doc.autoTable(content2);

      doc.save(today + " InstructorReport.pdf");
    }
  };

  componentDidMount() {}

  render() {
    const data = {
      columns: [
        {
          label: "S/No",
          field: "sNo",
        },
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Email",
          field: "email",
        },
        {
          label: "Department",
          field: "department",
        },
      ],
      rows: this.props.instructorList,
    };

    return (
      <>
        <div>
          <hr className="my-2" />

          <div className="overflow-scroll">
            <MDBDataTableV5
              hover
              striped
              entriesOptions={[10, 20, 25]}
              entries={10}
              pagesAmount={4}
              pagingTop
              searchTop
              searchBottom={false}
              data={data}
              sortRows={["name"]}
            />
          </div>

          <div className="mt-3">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => this.exportPDF()}
            >
              <Unicons.UilFileExport /> Export Report PDF
            </button>
          </div>
        </div>
      </>
    );
  }
}
