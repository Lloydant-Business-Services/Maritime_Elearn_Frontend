import React, { Component } from "react";
import { MDBDataTableV5 } from "mdbreact";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/images/home/logo.png";
import * as Unicons from "@iconscout/react-unicons/index";
import { Table } from "antd";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import Column from "antd/lib/table/Column";

export default class InstructorReportTable extends Component {
  state = {
    headerOthers: {},
  };

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
      const doc = new jsPDF("landscape", "pt", "A4", [200, 400], true);

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
      const ass = this.props.departmentName + " Department";
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

      const headers = [this.props.header];

      let bodyFoot = [
        {
          vc: "For: SCHOOL ADMINISTRATOR",
        },
      ];

      const dora = bodyFoot.map((d) => [d.vc]);

      const datas = () => {
        for (var i = 0; i < this.props.instructorList.length; i++) {
          let allData = Object.values(
            this.props.instructorList === undefined
              ? []
              : this.props.instructorList
          );
          console.log(allData, "alldataaaa=======");

          return allData?.map((key, index) => {
            console.log(key, "valuesssssssssss");
            return [
              {
                value: key,
              },
            ];
          });
        }
      };

      // const data = this.props.instructorList.map((d) => [
      //   d.S_N,
      //   d.Name,
      //   d.Matric_Number,
      //   d.Total_Score,
      //   d.Assignment,
      //   d.Score,
      // ]);

      let content = {
        startY: 220,
        head: headers,
        body: this.props.body,
      };

      let content2 = {
        head: headers2,
        body: dora,
        theme: "plain",
        styles: { fontStyle: "italic" },
      };

      doc.setFont("Arial");
      doc.setFontSize(17);

      doc.addImage(img, "png", 400, 20, 34, 34, undefined, "FAST");

      doc.setFont(undefined, "bold");
      doc.text(uni, 310, 70);
      doc.setFont(undefined, "normal");
      doc.text("P.M.B. 5025", 380, 87);
      doc.text("ENUGU", 390, 105);

      doc.setFontSize(15);
      doc.setLineDash([10, 0], 10);
      doc.line(50, 135, 753, 135);
      doc.text("CUMMULATIVE SCORE REPORT", 160, 150);
      doc.text("Date: " + " " + today, 480, 150);
      doc.setLineDash([10, 0], 10);
      doc.line(50, 155, 753, 155);

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");

      doc.text(ass, 310, 200);
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      doc.autoTable(content);
      //  doc.autoTableEndPosY() + 15
      var check = doc.autoTableEndPosY() + 15;

      doc.autoTable(content2);

      doc.save(today + " InstructorReport.pdf");
    }
  };

  renderTableHeader = () => {
    let newProp = this.props.instructorList[0];
    let header1 = Object.keys(newProp === undefined ? [] : newProp);

    return header1?.map((key, index) => {
      console.log(key, "key======");
      return {
        title: key,
        dataIndex: key,
        key: key,
        // width: "20%",
      };
    });
  };

  componentDidMount() {
    // this.renderTableHeader();
  }

  render() {
    console.log(this.props.instructorList, "mapptabless");
    // let header = Object.keys(this.state.students[0]);

    const styles = require("antd/dist/antd.css");

    // const data = {
    //   columns: [
    //     {
    //       title: "S/No",
    //       field: "sNo",
    //     },
    //     {
    //       title: "Name",
    //       field: "name",
    //     },
    //     {
    //       title: "Matric Number",
    //       field: "matricNo",
    //     },
    //     {
    //       title: "Cummulative Score",
    //       field: "score",
    //     },
    //     // {
    //     //   title: "details",
    //     //   field: "view details",
    //     // },
    //   ],
    //   rows: this.props.instructorList,
    // };

    console.log(this.props.instructorList, "instructorlistt===");
    console.log(this.props.allAssignmentDetails, "detailsss===");

    const columns = [
      { title: "S/No", dataIndex: "sNo", key: "sNo", width: "25%" },
      { title: "Name", dataIndex: "name", key: "name", width: "25%" },
      {
        title: "Matric Number",
        dataIndex: "matricNo",
        key: "matricNo",
        width: "25%",
      },
      {
        title: "Cummulative Score",
        dataIndex: "score",
        key: "score",
        width: "25%",
      },
    ];

    const columnsNew = [
      { title: "S/No", dataIndex: "sNo", key: "sNo", width: "25%" },
      {
        title: "Assignment Name",
        dataIndex: "assignmentName",
        key: "assignmentName",
        width: "25%",
      },
      {
        title: "Assignment Score",
        dataIndex: "score",
        key: "score",
        width: "25%",
      },
    ];

    const expandedRow = (row, index) => {
      console.log(row);
      // let inTable = row.key == 1 ? data1 : row.key == 2 ? data2 : data;
      return (
        <Table
          columns={columnsNew}
          dataSource={this.props.allAssignmentDetails}
          pagination={false}
        />
      );
    };

    // const expandedRow = (row, index) => {
    //   console.log(row);
    //   let inTable = row.key == 1 ? data1 : row.key == 2 ? data2 : data;
    //   return (
    //     <Table columns={columns} dataSource={inTable} pagination={false} />
    //   );
    // };

    return (
      <>
        <div>
          <hr className="my-2" />

          <div className="overflow-scroll">
            {/* <MDBDataTableV5
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
            /> */}
            <Table
              columns={this.renderTableHeader()}
              // expandedRowRender={expandedRow}
              dataSource={this.props.instructorList}
              rowClassName="editable-row"
            />
            ,
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
