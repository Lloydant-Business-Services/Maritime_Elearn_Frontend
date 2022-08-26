import React, { Component } from "react";
import { MDBDataTableV5 } from "mdbreact";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/images/home/logo.png";
import * as Unicons from "@iconscout/react-unicons/index";
import Spinner from "../../pages/Front/Spinner";
import PulseLoader from "react-spinners/PulseLoader";
import $ from "jquery"







export default class InstructorReportTable extends Component {
  state = {};

  exportPDF = () => {
    
    const marginLeft = 20;
    let _this = this;
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

    $("#exportReport").fadeIn()


      doc.setFontSize(15);
      doc.setFont("Times New Roman");

      const uni = "LLOYDANT UNIVERSITY";
      const ass = this.props?.loadedData?.studentName.toUpperCase();
      const sessionSem = this.props?.loadedLabel;
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

      const headers = [["S/N", "COURSE CODE", "COURSE TITLE", "SCORE"]];

      let bodyFoot = [
        {
          vc: "Powered by LloydAnt",
        },
      ];

      const dora = bodyFoot.map((d) => [d.vc]);

      const data = this.props?.assignmentList?.map((d,i) => [
        i+1,
        d.courseCode,
        d.courseTitle,
        d.score,
      ]);

      let content = {
        startY: 220,
        head: headers,
        body: data,
        theme:"grid",
        headStyles:{
            fillColor:'#473e92'
         }
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
      doc.text("ASSIGNMENT REPORT", 60, 150);
      doc.text(sessionSem + " Session",  350, 150);
      doc.setLineDash([20, 0], 10);
      doc.line(50, 155, 553, 155);

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");

      doc.text("Name: " + ass, 40, 200);
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      doc.autoTable(content);
      //  doc.autoTableEndPosY() + 15
      var check = doc.autoTableEndPosY() + 15;

      doc.autoTable(content2);
      setTimeout(() => {
        $("#exportReport").fadeOut() 
      }, 2000);

      doc.save("AssignmentReport.pdf");
    }
  };

  componentDidMount() {
    $("#exportReport").fadeOut()

  }

  render() {
    const data = {
      columns: [
        {
            label: 'S/No',
            field: 'sNo',
        },
        {
            label: 'Course Code',
            field: 'courseCode',
        },
        {
            label: 'Course Title',
            field: 'courseTitle',
        },
        {
            label: 'Score',
            field: 'score',
        },
      ],
      rows: this.props?.assignmentList,
    };

    return (
      <>
       <div className="spin-back"  id="exportReport">
						<div className="jumbotron jum2">
							<PulseLoader
								size={20}
								color={"#192f59"}
								loading={true}
							/>
						</div>
					</div>
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
              onClick={this.exportPDF}
            >
              <Unicons.UilFileExport /> Export Report PDF
            </button>

            {/* <PulseLoader
								size={20}
								color={"#192f59"}
								loading={true}
							/> */}
          </div>
        </div>
      </>
    );
  }
}
